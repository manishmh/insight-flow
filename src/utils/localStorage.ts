export const setTableState = (key: string, state: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
};
  
export const getTableState = (key: string) => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
};
  
export const removeTableState = (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
};
  