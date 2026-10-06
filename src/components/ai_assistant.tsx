"use client";

import { FormEvent, useRef, useState } from "react";
import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessage: Message = {
  role: "assistant",
  content:
    "Hi! I can help you manage employees. You can ask me to find, create, update, deactivate, or summarize employee records.",
};

const examplePrompts = [
  {
    title: "View employees",
    prompt: "Show me all employees.",
  },
  {
    title: "View active employees",
    prompt: "Show me all active employees.",
  },
  {
    title: "Find an employee",
    prompt: "Find James",
  },
  {
    title: "Generate a summary",
    prompt: "Generate a summary for James Michael.",
  },
];

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    initialMessage,
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function sendMessage(messageText?: string) {
    const content = (messageText ?? input).trim();

    if (!content || pending) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      let data: { message?: string; error?: string };

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The assistant returned an invalid response.",
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "The assistant could not process your request.",
        );
      }

      const assistantMessage = data.message?.trim();

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            assistantMessage ||
            "I couldn't generate a response.",
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The assistant is temporarily unavailable.",
      );
    } finally {
      setPending(false);
      textareaRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setInput(event.target.value);
    setError(null);
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] min-h-[560px] flex-col overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">
              AI HR Assistant
            </h2>

            <p className="truncate text-xs text-muted-foreground">
              Employee management assistant
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/20">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background">
                    <Bot className="size-4 text-muted-foreground" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] px-1 text-sm leading-6 sm:max-w-[75%] ${
                    isUser
                      ? "rounded-xl rounded-br-sm bg-primary px-4 py-3 text-primary-foreground"
                      : "py-1 text-foreground"
                  }`}
                >
                  {message.content}
                </div>

                {isUser && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          {pending && (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background">
                <Bot className="size-4 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Working on your request...
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          {messages.length === 1 && !pending && !error && (
            <div className="pt-3">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Sparkles className="size-3.5" />
                Suggested actions
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {examplePrompts.map((example) => (
                  <button
                    key={example.prompt}
                    type="button"
                    onClick={() =>
                      void sendMessage(example.prompt)
                    }
                    className="rounded-lg border bg-background px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <p className="text-sm font-medium">
                      {example.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {example.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-background p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <div className="min-w-0 flex-1 rounded-lg border bg-background transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about employees..."
              disabled={pending}
              rows={2}
              maxLength={10000}
              aria-label="Message AI HR Assistant"
              className="min-h-12 w-full resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="px-3 pb-2">
              <span className="text-[11px] text-muted-foreground">
                Enter to send 
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!input.trim() || pending}
            size="icon"
            className="size-12 shrink-0"
            aria-label="Send message"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}