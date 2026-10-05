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

const runtimeTools = employeeTools as unknown as Record<string, RuntimeTool>;

const toolDefinitions = Object.entries(runtimeTools).map(([name, tool]) => ({
  type: "function" as const,
  name,
  description: tool.description,
  parameters: z.toJSONSchema(tool.parameters, {
    io: "input",
  }),
  strict: false,
}));

const SYSTEM_INSTRUCTIONS = `
You are the AI HR Assistant for Mini AI HR.

You help an authenticated HR Admin manage employees.

You can perform these actions:
- list employees
- find a specific employee
- create an employee
- update an employee
- deactivate an employee
- generate an employee summary

Rules:
1. Never invent employee information.
2. For employee creation, collect all required employee fields before calling create_employee:
   full name, email, phone, job title, department, employment type,
   joining date, status, manager name, and work location.
3. If required information is missing, ask the HR Admin for it instead of guessing.
4. When updating or deactivating an employee, identify the employee unambiguously.
5. If multiple employees have the same name, ask the HR Admin to identify the correct employee.
6. Never deactivate or update an employee based on an uncertain match.
7. Use the tools for employee data. Do not claim that an action succeeded unless the corresponding tool succeeded.
8. When generating an employee summary, use only information returned by the employee tool. Do not invent achievements, responsibilities, skills, or other facts.
9. After successfully completing an action, briefly explain what was done.
10. Keep responses concise and professional.
`;

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

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat request." },
        { status: 400 },
      );
    }

    const input = parsed.data.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    let response = await openai.responses.create({
      model: "gpt-6-luna",
      instructions: SYSTEM_INSTRUCTIONS,
      input,
      tools: toolDefinitions,
    });

    for (let iteration = 0; iteration < 8; iteration += 1) {
      const functionCalls = response.output.filter(
        (item) => item.type === "function_call",
      );

      if (functionCalls.length === 0) {
        return NextResponse.json({
          message: response.output_text,
        });
      }

      const toolOutputs = [];

      for (const call of functionCalls) {
        const tool = runtimeTools[call.name];

        if (!tool) {
          toolOutputs.push({
            type: "function_call_output" as const,
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

          const result = await tool.execute(validatedArguments);

          toolOutputs.push({
            type: "function_call_output" as const,
            call_id: call.call_id,
            output: JSON.stringify(result),
          });
        } catch (error) {
          toolOutputs.push({
            type: "function_call_output" as const,
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

      response = await openai.responses.create({
        model: "gpt-6-luna",
        instructions: SYSTEM_INSTRUCTIONS,
        previous_response_id: response.id,
        input: toolOutputs,
        tools: toolDefinitions,
      });
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
      { status: 500 },
    );
  }
}