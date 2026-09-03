import type { Note } from "@/types";

export function stripTags(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}

export function sortedNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
}

export function relTime(ts?: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export interface SearchResult {
  note: Note;
  snippet: string;
}

export function searchNotes(notes: Note[], query: string): SearchResult[] {
  const q = query.toLowerCase();
  return sortedNotes(notes)
    .filter((n) => {
      const title = (n.title || "").toLowerCase();
      const body = stripTags(n.contentHtml).toLowerCase();
      return title.includes(q) || body.includes(q);
    })
    .map((note) => {
      const body = stripTags(note.contentHtml);
      const snippet = body.slice(0, 160) + (body.length > 160 ? "…" : "");
      return { note, snippet };
    });
}
