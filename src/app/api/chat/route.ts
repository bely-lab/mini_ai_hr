import OpenAI from "openai";
import { NextResponse } from "next/server";
import * as z from "zod";

import { createClient } from "@/lib/supabase/server";
import { employeeTools } from "@/lib/ai/tools";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(10000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
});

type RuntimeTool = {
  description: string;
  parameters: z.ZodType;
  execute: (args: unknown) => Promise<unknown>;
};

const runtimeTools =
  employeeTools as unknown as Record<string, RuntimeTool>;

const toolDefinitions = Object.entries(runtimeTools).map(
  ([name, tool]) => ({
    type: "function" as const,
    name,
    description: tool.description,
    parameters: z.toJSONSchema(tool.parameters, {
      io: "input",
    }),
    strict: false,
  }),
);

const SYSTEM_INSTRUCTIONS = `
You are the AI HR Assistant for Mini AI HR.

You help an authenticated HR Admin manage employee records.

You can:
- list employees
- find a specific employee
- create an employee
- update employee information
- deactivate an employee
- generate and save an employee summary

Rules:
1. Never invent employee information.
2. Use employee tools for employee data instead of relying on conversation assumptions.
3. For employee creation, collect all required fields before calling create_employee:
   full name, email, phone, job title, department, employment type,
   joining date, status, manager name, and work location.
4. Never guess missing required information.
5. Joining dates cannot be in the future.
6. When updating or deactivating an employee, identify the employee unambiguously.
7. If multiple employees have the same name, ask the HR Admin to identify the correct employee by email or another identifier.
8. Never update or deactivate an employee based on an uncertain match.
9. Employee status is not changed through update_employee. Use deactivate_employee for deactivation.
10. Do not claim an action succeeded unless the corresponding tool succeeded.
11. If a tool reports an error or no change, explain that result accurately.
12. When generating an employee summary, use only information returned by the employee tool. Do not invent achievements, responsibilities, skills, qualifications, or other facts.
13. After successfully completing an action, briefly explain what was done.
14. Keep responses concise and professional.
`;

function isRateLimitError(error: unknown): boolean {
  return error instanceof OpenAI.APIError && error.status === 429;
}

function getOpenAIErrorMessage(error: unknown): string {
  if (isRateLimitError(error)) {
    return "The AI assistant is temporarily rate-limited. Please try again later.";
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 401 || error.status === 403) {
      return "The AI assistant is not currently available.";
    }

    if (error.status >= 500) {
      return "The AI service is temporarily unavailable. Please try again.";
    }
  }

  return "The AI assistant is temporarily unavailable.";
}

function isFunctionCall(
  item: OpenAI.Responses.ResponseOutputItem,
): item is OpenAI.Responses.ResponseFunctionToolCall {
  return item.type === "function_call";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat request." },
        { status: 400 },
      );
    }

    const totalCharacters = parsed.data.messages.reduce(
      (total, message) => total + message.content.length,
      0,
    );

    if (totalCharacters > 40000) {
      return NextResponse.json(
        {
          error:
            "The conversation is too long. Please start a new conversation.",
        },
        { status: 400 },
      );
    }

    const input = parsed.data.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    let response: OpenAI.Responses.Response;

    try {
      response = await openai.responses.create({
        model: "gpt-6-luna",
        instructions: SYSTEM_INSTRUCTIONS,
        input,
        tools: toolDefinitions,
      });
    } catch (error) {
      console.error("OpenAI request failed:", error);

      return NextResponse.json(
        { error: getOpenAIErrorMessage(error) },
        { status: isRateLimitError(error) ? 429 : 503 },
      );
    }

    for (let iteration = 0; iteration < 8; iteration += 1) {
      const functionCalls = response.output.filter(isFunctionCall);

      if (functionCalls.length === 0) {
        return NextResponse.json({
          message:
            response.output_text ||
            "I couldn't generate a response.",
        });
      }

      const toolOutputs: OpenAI.Responses.ResponseInputItem[] = [];

      for (const call of functionCalls) {
        const tool = runtimeTools[call.name];

        if (!tool) {
          toolOutputs.push({
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.stringify({
              success: false,
              message: `Unknown tool: ${call.name}`,
            }),
          });

          continue;
        }

        try {
          const argumentsValue = JSON.parse(call.arguments);

          const validatedArguments =
            tool.parameters.parse(argumentsValue);

          const result = await tool.execute(
            validatedArguments,
          );

          toolOutputs.push({
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.stringify(result),
          });
        } catch (error) {
          console.error(
            `AI tool "${call.name}" failed:`,
            error,
          );

          toolOutputs.push({
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.stringify({
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "The requested HR action could not be completed.",
            }),
          });
        }
      }

      try {
        response = await openai.responses.create({
          model: "gpt-6-luna",
          instructions: SYSTEM_INSTRUCTIONS,
          previous_response_id: response.id,
          input: toolOutputs,
          tools: toolDefinitions,
        });
      } catch (error) {
        console.error(
          "OpenAI follow-up request failed:",
          error,
        );

        return NextResponse.json(
          { error: getOpenAIErrorMessage(error) },
          { status: isRateLimitError(error) ? 429 : 503 },
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "The assistant could not complete the requested action.",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("AI assistant error:", error);

    return NextResponse.json(
      {
        error: "The AI assistant is temporarily unavailable.",
      },
      { status: 503 },
    );
  }
}