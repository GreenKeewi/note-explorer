import { FileText, Folder as FolderIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Folder, Note } from "@/types";
import { childFolders, childNotes, relTime } from "@/lib/notes";

export function EntryGrid({
  folders,
  notes,
  allFolders,
  allNotes,
  onOpenFolder,
  onOpenNote,
}: {
  folders: Folder[];
  notes: Note[];
  allFolders: Folder[];
  allNotes: Note[];
  onOpenFolder: (id: string) => void;
  onOpenNote: (id: string) => void;
}) {
  return (
    <div className="space-y-8">
      {folders.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Folders
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((f) => {
              const count = childFolders(allFolders, f.id).length + childNotes(allNotes, f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onOpenFolder(f.id)}
                  className="min-h-11 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-colors hover:border-muted-foreground/30 hover:bg-accent/40">
                    <CardContent className="flex items-start gap-3 pt-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-400">
                        <FolderIcon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 pt-1">
                        <span className="block truncate font-semibold">{f.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {count} {count === 1 ? "item" : "items"}
                        </span>
                      </span>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {notes.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onOpenNote(n.id)}
                className="min-h-11 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="h-full transition-colors hover:border-muted-foreground/30 hover:bg-accent/40">
                  <CardContent className="flex items-start gap-3 pt-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <FileText className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 pt-1">
                      <span className="block truncate font-semibold">{n.title || "Untitled"}</span>
                      <span className="block text-xs text-muted-foreground">
                        {relTime(n.updatedAt || n.createdAt)}
                      </span>
                    </span>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
