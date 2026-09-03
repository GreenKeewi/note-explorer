import { FileText, SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import type { Folder } from "@/types";
import { folderPathString, highlightSnippet, searchNotes } from "@/lib/notes";
import type { Note } from "@/types";

export function SearchResults({
  query,
  notes,
  folders,
  onOpenNote,
}: {
  query: string;
  notes: Note[];
  folders: Folder[];
  onOpenNote: (id: string) => void;
}) {
  const results = searchNotes(notes, query);

  if (results.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-7" aria-hidden="true" />}
        title="No matches"
        description={`Nothing found for "${query}". Try a different word.`}
      />
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {results.length} {results.length === 1 ? "result" : "results"} for &quot;{query}&quot;
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ note, titleMatches, snippet }) => {
          const h = !titleMatches ? highlightSnippet(snippet, query) : null;
          return (
            <button
              key={note.id}
              type="button"
              onClick={() => onOpenNote(note.id)}
              className="min-h-11 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors hover:border-muted-foreground/30 hover:bg-accent/40">
                <CardContent className="flex items-start gap-3 pt-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 pt-1">
                    <span className="block truncate font-semibold">{note.title || "Untitled"}</span>
                    <span className="block truncate font-mono text-xs text-muted-foreground">
                      {folderPathString(folders, note.folderId)}
                    </span>
                    {h && (
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {h.prefix}
                        {h.before}
                        <mark>{h.match}</mark>
                        {h.after}
                        {h.suffix}
                      </span>
                    )}
                  </span>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </section>
  );
}
