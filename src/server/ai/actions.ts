"use server";

import { runInvestigationAgent, createInvestigation } from "./agent";
import { generateAiText } from "./providers";
import { executeAiQuery } from "./data-layer";
import { auth } from "@/server/auth";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/encryption";

export async function runInvestigationStep(question: string, contextPayload: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const investigation = await createInvestigation(session.user.id, question);

  try {
    const result = await runInvestigationAgent(session.user.id, investigation.id, question, contextPayload);
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
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




export async function getAISettings() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const config = await db.aIProviderConfig.findUnique({
      where: { userId: session.user.id },
    });

    if (!config) {
      return { success: true, data: { provider: 'mock', model: 'mock-model', privacyMode: 'MINIMIZED', hasKey: false } };
    }

    return {
      success: true,
      data: {
        provider: config.provider,
        model: config.model || '',
        privacyMode: config.privacyMode,
        hasKey: !!config.encryptedKey
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveAISettings(data: { provider: string, model: string, apiKey: string, privacyMode: 'FULL' | 'MINIMIZED' | 'METADATA_ONLY' }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const updateData: any = {
      provider: data.provider,
      model: data.model,
      privacyMode: data.privacyMode,
    };

    if (data.apiKey && data.apiKey !== "********") {
       updateData.encryptedKey = encrypt(data.apiKey);
    }

    await db.aIProviderConfig.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        ...updateData
      }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
