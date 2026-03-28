"use server"

import { Client } from 'pg';

export async function fetchExternalPostgresData(
  connectionString: string,
  query: string
) {
  if (!connectionString || !query) {
    return { success: false, error: 'Connection string and query are required' };
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
    console.error("Postgres connect/query Error:", error);
    try {
      await client.end();
    } catch(e) { /* ignore cleanup errors */ }
    
    return {
      success: false,
      error: error.message || 'Failed to fetch data from the provided database.'
    };
  }
}
