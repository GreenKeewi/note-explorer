import { useMemo, useState } from "react";
import { NotebookPen, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteList } from "@/components/NoteList";
import { NoteView } from "@/components/NoteView";
import { EmptyState } from "@/components/EmptyState";
import { useNotebookData } from "@/hooks/useNotebookData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { searchNotes, sortedNotes } from "@/lib/notes";

export default function App() {
  const { data, loading } = useNotebookData();
  const [searchInput, setSearchInput] = useState("");
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  const debouncedQuery = useDebouncedValue(searchInput, 200);
  const trimmedQuery = debouncedQuery.trim();

  const notes = data?.notes ?? [];
  const orderedNotes = useMemo(() => sortedNotes(notes), [notes]);
  const results = useMemo(
    () => (trimmedQuery ? searchNotes(notes, trimmedQuery) : null),
    [notes, trimmedQuery],
  );
  const visibleNotes = results ? results.map((r) => r.note) : orderedNotes;

  const openNote = notes.find((n) => n.id === openNoteId) ?? null;
  const showingNoteOnMobile = !!openNote;

  return (
    <div className="h-dvh bg-background">
      <a
        href="#note-list"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to notes
      </a>

      <div className="mx-auto flex h-full max-w-6xl md:border-x md:border-border/60">
        <div
          className={`flex w-full shrink-0 flex-col border-border/60 md:w-[340px] md:border-r ${
            showingNoteOnMobile ? "hidden md:flex" : "flex"
          }`}
        >
          <header className="shrink-0 border-b border-border/60 px-4 py-4 sm:px-5">
            <h1 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <NotebookPen className="size-4" aria-hidden="true" />
              </span>
              Notebook
            </h1>
            <div className="relative" role="search">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="search" className="sr-only">
                Search notes
              </label>
              <Input
                id="search"
                type="search"
                placeholder="Search notes…"
                autoComplete="off"
                className="pl-9 pr-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-full"
                  onClick={() => setSearchInput("")}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </Button>
              )}
            </div>
          </header>

          <div id="note-list" className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-2 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={<NotebookPen className="size-6" aria-hidden="true" />}
                  title="No notes yet"
                  description="This notebook is empty. Once notes are added, they'll show up here."
                />
              </div>
            ) : visibleNotes.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={<Search className="size-6" aria-hidden="true" />}
                  title="No matches"
                  description={`Nothing found for "${trimmedQuery}".`}
                />
              </div>
            ) : (
              <NoteList
                notes={visibleNotes}
                activeNoteId={openNoteId}
                onOpenNote={setOpenNoteId}
              />
            )}
          </div>
        </div>

        <div className={`min-w-0 flex-1 flex-col ${showingNoteOnMobile ? "flex" : "hidden md:flex"}`}>
          <NoteView note={openNote} onBack={() => setOpenNoteId(null)} showBack={true} />
        </div>
      </div>
    </div>
  );
}
