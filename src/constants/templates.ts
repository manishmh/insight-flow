/** Prebuilt dashboards: each block binds to an existing sample dataset by name. */
export const DASHBOARD_TEMPLATES: Record<
  string,
  { label: string; blocks: { board: string; source: string }[] }
> = {
  sales: {
    label: "Sales overview",
    blocks: [
      { board: "Orders", source: "orders" },
      { board: "Products", source: "products" },
      { board: "Customers", source: "customers" },
      { board: "Purchases", source: "purchases" },
    ],
  },
  users: {
    label: "Users & workspaces",
    blocks: [
      { board: "Users", source: "users" },
      { board: "Workspaces", source: "workspaces" },
      { board: "Documents", source: "documents" },
    ],
  },
};

export type TemplateKey = keyof typeof DASHBOARD_TEMPLATES;
