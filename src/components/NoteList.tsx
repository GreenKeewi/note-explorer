import { FileText } from "lucide-react";
import type { Note } from "@/types";
import { relTime, stripTags } from "@/lib/notes";
import { cn } from "@/lib/utils";

export function NoteList({
  notes,
  activeNoteId,
  onOpenNote,
  emptySnippet,
}: {
  notes: Note[];
  activeNoteId: string | null;
  onOpenNote: (id: string) => void;
  emptySnippet?: (note: Note) => string;
}) {
  return (
    <ul className="flex flex-col">
      {notes.map((note) => {
        const preview = emptySnippet ? emptySnippet(note) : stripTags(note.contentHtml).slice(0, 120);
        const isActive = note.id === activeNoteId;
        return (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => onOpenNote(note.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex w-full min-h-[44px] flex-col gap-1 border-b border-border/60 px-4 py-3.5 text-left transition-colors sm:px-5",
                isActive ? "bg-accent" : "hover:bg-accent/50",
              )}
            >
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate font-medium text-foreground">{note.title || "Untitled"}</span>
              </div>
              <div className="flex items-baseline gap-2 pl-5.5">
                <span className="shrink-0 font-mono text-[0.7rem] text-muted-foreground">
                  {relTime(note.updatedAt || note.createdAt)}
                </span>
                {preview && (
                  <span className="truncate text-sm text-muted-foreground">{preview}</span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
