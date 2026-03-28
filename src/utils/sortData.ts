/**
 * Utility function to sort table data by a specific column
 * Handles different data types: numbers, strings, dates, etc.
 */

export type SortOrder = "asc" | "desc" | "none";

/**
 * Determines the type of a value and converts it for comparison
 */
function getComparableValue(value: any): { value: any; type: "number" | "string" | "date" | "null" } {
  if (value === null || value === undefined || value === "") {
    return { value: null, type: "null" };
  }

  // Try to parse as number
  if (typeof value === "number") {
    return { value, type: "number" };
  }

  // Try to parse string as number
  const numValue = Number(value);
  if (!isNaN(numValue) && isFinite(numValue) && value.toString().trim() !== "") {
    return { value: numValue, type: "number" };
  }

  // Try to parse as date
  const dateValue = new Date(value);
  if (!isNaN(dateValue.getTime()) && typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return { value: dateValue.getTime(), type: "date" };
  }

  // Default to string comparison
  return { value: String(value).toLowerCase(), type: "string" };
}

/**
 * Compares two values for sorting
 */
function compareValues(a: any, b: any, order: "asc" | "desc"): number {
  const aComp = getComparableValue(a);
  const bComp = getComparableValue(b);

  // Handle null values - always put them at the end
  if (aComp.type === "null" && bComp.type === "null") return 0;
  if (aComp.type === "null") return 1;
  if (bComp.type === "null") return -1;

  // Compare based on type
  let comparison = 0;
  
  if (aComp.type === bComp.type) {
    // Same type - direct comparison
    if (aComp.value < bComp.value) comparison = -1;
    else if (aComp.value > bComp.value) comparison = 1;
    else comparison = 0;
  } else {
    // Different types - prioritize numbers > dates > strings
    const typePriority: Record<string, number> = {
      number: 3,
      date: 2,
      string: 1,
      null: 0,
    };
    
    const aPriority = typePriority[aComp.type] ?? 0;
    const bPriority = typePriority[bComp.type] ?? 0;
    
    if (aPriority !== bPriority) {
      comparison = aPriority - bPriority;
    } else {
      // Fallback to string comparison
      comparison = String(aComp.value).localeCompare(String(bComp.value));
    }
  }

  return order === "asc" ? comparison : -comparison;
}

/**
 * Sorts table data (array of arrays) by a specific column index
 * @param data - Array of rows, where each row is an array of values
 * @param columnIndex - Index of the column to sort by
 * @param order - Sort order: "asc", "desc", or "none"
 * @returns Sorted copy of the data array
 */
export function sortTableData(
  data: any[][],
  columnIndex: number,
  order: SortOrder
): any[][] {
  if (order === "none" || columnIndex < 0 || data.length === 0) {
    return [...data];
  }

  // Check if columnIndex is valid
  const maxIndex = Math.max(...data.map(row => row.length - 1));
  if (columnIndex > maxIndex) {
    return [...data];
  }

  // Create a copy and sort
  const sorted = [...data].sort((rowA, rowB) => {
    const valueA = rowA[columnIndex];
    const valueB = rowB[columnIndex];
    return compareValues(valueA, valueB, order);
  });

  return sorted;
}

/**
 * Sorts table data by column name (finds index from columns array)
 * @param data - Array of rows, where each row is an array of values
 * @param columns - Array of column names
 * @param columnName - Name of the column to sort by
 * @param order - Sort order: "asc", "desc", or "none"
 * @returns Sorted copy of the data array
 */
export function sortTableDataByColumn(
  data: any[][],
  columns: string[],
  columnName: string | null,
  order: SortOrder
): any[][] {
  if (!columnName || order === "none") {
    return [...data];
  }

  const columnIndex = columns.indexOf(columnName);
  if (columnIndex === -1) {
    return [...data];
  }

  return sortTableData(data, columnIndex, order);
}
