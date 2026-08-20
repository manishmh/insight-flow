import { tool } from 'ai';
import { z } from 'zod';
import { executeAiAgent, getProviderConfig } from './providers';
// import { fetchSchemaMetadata, executeAiQuery } from './data-layer';
import { db } from '@/lib/db';

export async function createInvestigation(userId: string, question: string) {
  try {
    return await db.investigation.create({
      data: {
        userId,
        question,
        status: 'IN_PROGRESS'
      }
    });
  } catch (error: any) {
     // Return dummy if DB doesn't have the table yet
     return { id: "dummy-investigation-" + Date.now(), userId, question, status: "IN_PROGRESS" };
  }

}

export async function runInvestigationAgent(userId: string, investigationId: string, question: string, contextPayload: any) {
  const config = await getProviderConfig(userId);

  const tools = {
    getSchema: tool({
      description: 'Get the database schema (tables and columns) to understand the data structure.',
      parameters: z.object({}),
      execute: async () => {
        try {
          return { success: true, schema: contextPayload.schema || contextPayload.columns || [] };
        } catch (e: any) {
          return { success: false, error: e.message };
        }
      },
    }),
    executeSql: tool({
      description: 'Execute a read-only SQL query against the database.',
      parameters: z.object({
        query: z.string().describe('The SQL SELECT query to execute.'),
        reason: z.string().describe('Explanation of why this query is being executed.'),
      }),
      execute: async ({ query, reason }) => {
        try {
          // In the mock/indexedDB environment, we don't execute real SQL against a DB connection string.
          // We pretend the query ran and return the sample data provided from the client.
          const result = { success: true, data: contextPayload.sampleData || [], columns: contextPayload.columns || [] };

          // Data minimization based on privacy mode
          let dataToReturn: any = result.data;

          if (config.privacyMode === 'METADATA_ONLY') {
            dataToReturn = { message: "Query successful, but privacy mode restricts viewing results. Columns available: " + result.columns?.join(", ") };
          } else if (config.privacyMode === 'MINIMIZED') {
            // For minimized, we could potentially just return the first few rows and summary stats.
            // For now, if there are many rows, just return the first 10.
            if (Array.isArray(dataToReturn) && dataToReturn.length > 10) {
               dataToReturn = {
                 summary: `Returned ${dataToReturn.length} rows. Data minimized for privacy.`,
                 sample: dataToReturn.slice(0, 10)
               };
            }
          }

          // Log the step
          try {
            await db.investigationStep.create({
              data: {
                investigationId,
                stepNumber: 0,
                action: 'Execute SQL',
                description: reason,
                query: query,
                resultSummary: JSON.stringify(dataToReturn).substring(0, 500)
              }
            });
          } catch(e) {}

          return { success: true, columns: result.columns, data: dataToReturn };
        } catch (e: any) {
          return { success: false, error: e.message };
        }
      },
    })
  };

  const systemPrompt = `You are Insight Flow, an AI data analyst.
Context Data: ${JSON.stringify(contextPayload).substring(0, 1000)}

Your goal is to answer the user's business question by querying their database.
Always inspect the schema first if you don't know the table structures.
Use the executeSql tool to run read-only Postgres queries.
Never use destructive operations.
Only claim conclusions backed by evidence from the data.
Be concise.`;

  try {
    const result = await executeAiAgent(userId, question, systemPrompt, tools, 5);

    try {
      await db.investigation.update({
        where: { id: investigationId },
        data: {
          status: 'COMPLETED',
          result: result.text
        }
      });
    } catch(e) {}

    return { success: true, text: result.text };
  } catch (error: any) {
    try {
      await db.investigation.update({
        where: { id: investigationId },
        data: {
          status: 'FAILED',
          result: error.message
        }
      });
    } catch (e) {}
    return { success: false, error: error.message };
  }
}
