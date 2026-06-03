import { fetchSampleDataByIds } from "@/server/components/block-functions";

// Request coalescer: blocks call fetchSampleDataBatched(id) independently as they
// mount, but every id requested within a short window is gathered into a single
// fetchSampleDataByIds() call. One server round-trip serves the whole dashboard
// instead of one serialized server action per block.

type Waiter = { resolve: (v: any) => void; reject: (e: any) => void };

let pending = new Map<string, Waiter[]>();
let timer: ReturnType<typeof setTimeout> | null = null;
const WINDOW_MS = 25;

const flush = async () => {
  const batch = pending;
  pending = new Map();
  timer = null;

  const ids = Array.from(batch.keys());
  try {
    const rows = await fetchSampleDataByIds(ids);
    const byId = new Map((rows ?? []).map((r: any) => [r.id, r]));
    batch.forEach((waiters, id) => {
      const row = byId.get(id) ?? null;
      waiters.forEach((w) => w.resolve(row));
    });
  } catch (error) {
    batch.forEach((waiters) => waiters.forEach((w) => w.reject(error)));
  }
};

export const fetchSampleDataBatched = (id: string): Promise<any> =>
  new Promise((resolve, reject) => {
    const waiters = pending.get(id);
    if (waiters) waiters.push({ resolve, reject });
    else pending.set(id, [{ resolve, reject }]);
    if (!timer) timer = setTimeout(flush, WINDOW_MS);
  });
