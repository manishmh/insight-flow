"use server"

import { Client } from 'pg';

const isReadOnlyQuery = (query: string) => {
  const normalized = query.trim().replace(/;+\s*$/, "").toLowerCase();
  const statementCount = normalized.split(";").filter(Boolean).length;

  if (statementCount > 1) return false;

  return normalized.startsWith("select ") || normalized.startsWith("with ");
};

export async function fetchExternalPostgresData(
  connectionString: string,
  query: string
) {
  if (!connectionString || !query) {
    return { success: false, error: 'Connection string and query are required' };
  }

  if (!isReadOnlyQuery(query)) {
    return { success: false, error: "Only read-only SELECT queries are allowed." };
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // We only execute the select or given query. 
    // NeonDB / Postgres driver usually executes queries via client.query()
    const result = await client.query(query);
    await client.end();

    const dataArray = result.rows;
    // result.fields contains objects with `name` representing column name
    const columns = result.fields.map((f: any) => f.name);
    
    return {
      success: true,
      data: {
        columns,
        data: dataArray,
        columnsInfo: {}, // Keeping compatible format
        duration: 0,
        updatedAt: Date.now()
      }
    };
  } catch (error: any) {
    console.error("Postgres connect/query Error:", error?.message || error);
    try {
      await client.end();
    } catch(e) { /* ignore cleanup errors */ }
    
    return {
      success: false,
      error: error.message || 'Failed to fetch data from the provided database.'
    };
  }
}
