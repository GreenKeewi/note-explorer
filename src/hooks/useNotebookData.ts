import { useEffect, useState } from "react";
import type { NotebookData } from "@/types";

export function useNotebookData() {
  const [data, setData] = useState<NotebookData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/data.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: NotebookData) => {
        if (!cancelled) setData({ notes: json.notes || [] });
      })
      .catch(() => {
        if (!cancelled) setData({ notes: [] });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
