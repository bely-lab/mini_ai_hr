import OpenAI from "openai";
import { NextResponse } from "next/server";
import * as z from "zod";

import { employeeTools } from "@/lib/ai/tools";
import { saveEmployeeSummary } from "@/lib/employees/data";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(10000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
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

Use the available tools for all employee data and actions.

Rules:
- Never invent employee information.
- Ask for missing required information before creating an employee.
- Never guess missing information.
- Joining dates cannot be in the future.
- Identify employees unambiguously before updating or deactivating them.
- If multiple employees match a name, ask for clarification.
- Use deactivate_employee to deactivate employees.
- Do not change employee status through update_employee.
- Never claim an action succeeded unless its tool succeeded.
- Generate summaries only from information returned by the employee tools.
- When generate_employee_summary is used, respond with the concise factual employee summary itself.
- Do not add information that is not present in the employee record.
- Keep responses concise and professional.
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

    if (totalCharacters > 12000) {
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
        max_output_tokens: 1000,
      });
    } catch (error) {
      console.error("OpenAI request failed:", error);

      return NextResponse.json(
        { error: getOpenAIErrorMessage(error) },
        { status: isRateLimitError(error) ? 429 : 503 },
      );
    }

    let summaryEmployeeId: string | null = null;
    let summarySaved = false;

    for (let iteration = 0; iteration < 8; iteration += 1) {
      const functionCalls = response.output.filter(isFunctionCall);

      if (functionCalls.length === 0) {
        const message =
          response.output_text ||
          "I couldn't generate a response.";

        if (summaryEmployeeId && !summarySaved && message.trim()) {
          try {
            await saveEmployeeSummary(
              summaryEmployeeId,
              message,
            );
            summarySaved = true;
          } catch (error) {
            console.error(
              "Failed to save generated employee summary:",
              error,
            );

            return NextResponse.json(
              {
                error:
                  "The summary was generated but could not be saved. Please try again.",
              },
              { status: 500 },
            );
          }
        }

        return NextResponse.json({
          message,
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

          if (call.name === "generate_employee_summary") {
            const resultRecord =
              result as {
                success?: boolean;
                employee?: { id?: string };
              };

            if (
              resultRecord.success &&
              resultRecord.employee?.id
            ) {
              summaryEmployeeId = resultRecord.employee.id;
            }
          }

          if (call.name === "save_employee_summary") {
            summarySaved = true;
          }

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
          max_output_tokens: 1000,
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