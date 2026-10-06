import { AppShell } from "@/components/app-shell";
import { AiAssistant } from "@/components/ai_assistant";

export default function AssistantPage() {
  return (
    <AppShell
      title="AI Assistant"
      description="Manage employee records using natural language."
    >
      <AiAssistant />
    </AppShell>
  );
}