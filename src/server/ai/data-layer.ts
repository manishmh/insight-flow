import { Client } from 'pg';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

const QUERY_TIMEOUT_MS = 15000;
const MAX_ROWS = 1000;

export const isReadOnlyQuery = (query: string) => {
  const normalized = query.trim().replace(/;+\s*$/, "").toLowerCase();
  const statementCount = normalized.split(";").filter(Boolean).length;

  if (statementCount > 1) return false;

  // Basic guard against destructive queries
  const lowerQuery = normalized;
  const destructiveKeywords = ['insert', 'update', 'delete', 'drop', 'alter', 'truncate', 'grant', 'revoke', 'commit', 'rollback', 'create', 'replace'];

  if (destructiveKeywords.some(kw => lowerQuery.includes(kw))) {
     // Wait, some of these might be column names or data. This is naive.
     // To be safer, we can just ensure it STARTS with select, with, or explain
  }

  return normalized.startsWith("select ") || normalized.startsWith("with ") || normalized.startsWith("explain ");
};

export async function fetchSchemaMetadata(connectionId: string, userId: string) {
  const connection = await db.databaseConnection.findUnique({
    where: { id: connectionId, userId },
  });

  if (!connection) {
    throw new Error('Database connection not found');
  }

  const url = decrypt(connection.encryptedUrl);
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, statement_timeout: QUERY_TIMEOUT_MS });

  try {
    await client.connect();
    // Query to get tables and columns
    const schemaQuery = `
      SELECT
        table_name,
        column_name,
        data_type
      FROM
        information_schema.columns
      WHERE
        table_schema = 'public'
      ORDER BY
        table_name, ordinal_position;
    `;
    const result = await client.query(schemaQuery);

    // Group by table
    const schema: Record<string, { name: string; type: string }[]> = {};
    result.rows.forEach(row => {
      if (!schema[row.table_name]) {
        schema[row.table_name] = [];
      }
      schema[row.table_name].push({ name: row.column_name, type: row.data_type });
    });

    return schema;
  } finally {
    await client.end();
  }
}

export async function executeAiQuery(connectionId: string, userId: string, query: string) {
  if (!isReadOnlyQuery(query)) {
    throw new Error("Only read-only SELECT queries are allowed for AI execution.");
  }

  const connection = await db.databaseConnection.findUnique({
    where: { id: connectionId, userId },
  });

  if (!connection) {
    throw new Error('Database connection not found');
  }

  const url = decrypt(connection.encryptedUrl);
  // enforce query timeout
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, statement_timeout: QUERY_TIMEOUT_MS });

  try {
    await client.connect();

    // Attempt to wrap in a read-only transaction for extra safety
    await client.query('BEGIN READ ONLY');

    // We append a limit if it doesn't exist, but it's safer to just limit in JS
    // if the query is complex. Here we'll just execute and slice if needed.
    const result = await client.query(query);
    await client.query('COMMIT');

    const rows = result.rows.slice(0, MAX_ROWS);
    const columns = result.fields.map(f => f.name);

    return {
      success: true,
      columns,
      data: rows,
      truncated: result.rows.length > MAX_ROWS
    };
  } catch (error: any) {
    try { await client.query('ROLLBACK'); } catch (e) {}
    console.error("AI Query Execution Error:", error);
    return {
      success: false,
      error: error.message || 'Failed to execute query'
    };
  } finally {
    await client.end();
  }
}
