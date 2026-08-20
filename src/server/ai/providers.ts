import { generateText, LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

export type SupportedProvider = 'openai' | 'anthropic' | 'mock';

// We abstract the call so we can inject keys or mock responses
export async function getProviderConfig(userId: string) {
  try {
    const config = await db.aIProviderConfig.findUnique({ where: { userId } });
    return config || { provider: 'mock', model: 'mock-model', encryptedKey: null, privacyMode: 'MINIMIZED' };
  } catch (error: any) {
    // If table doesn't exist yet, fallback to mock to prevent 500 error
    return { provider: 'mock', model: 'mock-model', encryptedKey: null, privacyMode: 'MINIMIZED' };
  }
}

export async function createAiClient(userId: string) {
  const config = await getProviderConfig(userId);
  let apiKey = '';

  if (config.encryptedKey) {
    try {
      apiKey = decrypt(config.encryptedKey);
    } catch (e) {
      console.warn("Failed to decrypt user BYOK. Falling back to default if exists.");
    }
  }

  if (config.provider === 'openai') {
    return createOpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
  } else if (config.provider === 'anthropic') {
    return createAnthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY });
  }

  // default to a deterministic mock
  return null;
}

// Simple wrapper around generateText
export async function generateAiText(userId: string, prompt: string, systemContext: string = "") {
  const config = await getProviderConfig(userId);

  if (config.provider === 'mock') {
    const isDashboard = prompt.toLowerCase().includes("dashboard");
    if (isDashboard) {
      return { text: JSON.stringify({ dashboardConfig: { metric: "Mock Revenue", type: "Bar" } }), usage: { totalTokens: 20 } };
    }
    return { text: "Mock response analyzing: " + prompt.substring(0, 50), usage: { totalTokens: 10 } };
  }

  const client = await createAiClient(userId);
  if (!client) throw new Error("Unsupported or misconfigured AI provider");

  const modelString = config.model || (config.provider === 'openai' ? 'gpt-4o-mini' : 'claude-3-haiku-20240307');

  const { text, usage } = await generateText({
    model: client(modelString) as unknown as LanguageModel,
    system: systemContext,
    prompt,
  });

  return { text, usage };
}

// Wrapping tool execution using Vercel AI sdk
export async function executeAiAgent(userId: string, prompt: string, systemContext: string, tools: any, maxSteps: number = 5) {
  const config = await getProviderConfig(userId);

  if (config.provider === 'mock') {
    return { text: "Mock Analysis completed. Tools used deterministically. Analysis for: " + prompt.substring(0, 50), steps: [{ step: "Executed Mock SQL" }] };
  }

  const client = await createAiClient(userId);
  if (!client) throw new Error("Unsupported or misconfigured AI provider");

  const modelString = config.model || (config.provider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-20240620');

  const result = await generateText({
    model: client(modelString) as unknown as LanguageModel,
    system: systemContext,
    prompt,
    tools,
    maxToolRoundtrips: maxSteps,
  });

  return result;
}
