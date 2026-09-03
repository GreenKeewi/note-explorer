import type { Folder, Note } from "@/types";

export function stripTags(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}

export function folderPath(folders: Folder[], folderId: string | null): Folder[] {
  const parts: Folder[] = [];
  let cur = folderId;
  let guard = 0;
  while (cur !== null && cur !== undefined && guard < 64) {
    const f = folders.find((x) => x.id === cur);
    if (!f) break;
    parts.unshift(f);
    cur = f.parentId;
    guard++;
  }
  return parts;
}

export function folderPathString(folders: Folder[], folderId: string | null): string {
  const parts = folderPath(folders, folderId);
  return parts.length ? parts.map((f) => f.name).join(" / ") : "Home";
}

export function childFolders(folders: Folder[], parentId: string | null): Folder[] {
  return folders
    .filter((f) => (f.parentId ?? null) === (parentId ?? null))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function childNotes(notes: Note[], folderId: string | null): Note[] {
  return notes
    .filter((n) => (n.folderId ?? null) === (folderId ?? null))
    .sort((a, b) => a.title.localeCompare(b.title));
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
  titleMatches: boolean;
  snippet: string;
}

export function highlightSnippet(text: string, query: string): { before: string; match: string; after: string; prefix: string; suffix: string } {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) {
    return { prefix: "", before: text.slice(0, 140), match: "", after: "", suffix: text.length > 140 ? "…" : "" };
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 80);
  return {
    prefix: start > 0 ? "…" : "",
    before: text.slice(start, idx),
    match: text.slice(idx, idx + query.length),
    after: text.slice(idx + query.length, end),
    suffix: end < text.length ? "…" : "",
  };
}

export function searchNotes(notes: Note[], query: string): SearchResult[] {
  const q = query.toLowerCase();
  return notes
    .filter((n) => {
      const title = (n.title || "").toLowerCase();
      const body = stripTags(n.contentHtml).toLowerCase();
      return title.includes(q) || body.includes(q);
    })
    .sort((a, b) => {
      const at = (a.title || "").toLowerCase().includes(q) ? 0 : 1;
      const bt = (b.title || "").toLowerCase().includes(q) ? 0 : 1;
      return at - bt;
    })
    .map((note) => {
      const body = stripTags(note.contentHtml);
      const titleMatches = (note.title || "").toLowerCase().includes(q);
      const snippet = titleMatches ? body.slice(0, 140) + (body.length > 140 ? "…" : "") : body;
      return { note, titleMatches, snippet };
    });
}
