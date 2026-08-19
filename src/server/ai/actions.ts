"use server";

import { runInvestigationAgent, createInvestigation } from "./agent";
import { generateAiText } from "./providers";
import { executeAiQuery } from "./data-layer";
import { auth } from "@/server/auth";

export async function runInvestigationStep(question: string, connectionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const investigation = await createInvestigation(session.user.id, question);
  const result = await runInvestigationAgent(session.user.id, investigation.id, question, connectionId);

  return result;
}

export async function explainChart(prompt: string, data: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const systemContext = "You are a data analyst. Explain the following chart data clearly and concisely. Highlight any anomalies or interesting trends.";
  const fullPrompt = `${prompt}\n\nData:\n${JSON.stringify(data).substring(0, 2000)}`;

  const result = await generateAiText(session.user.id, fullPrompt, systemContext);
  return result;
}

export async function generateDashboard(prompt: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // In a full implementation this would output structured JSON matching our dashboard schema
  return { success: false, error: "Not fully implemented yet in mock" };
}

export async function executeNLQuery(prompt: string, connectionId: string) {
   // This would convert NL to SQL, then run executeAiQuery.
   // Simplified version delegating to agent for now.
   return await runInvestigationStep(prompt, connectionId);
}
