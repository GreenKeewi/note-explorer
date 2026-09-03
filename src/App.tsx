import { useMemo, useState } from "react";
import { BookOpen, FolderOpen, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderBreadcrumb } from "@/components/FolderBreadcrumb";
import { EntryGrid } from "@/components/EntryGrid";
import { SearchResults } from "@/components/SearchResults";
import { EmptyState } from "@/components/EmptyState";
import { ReaderDialog } from "@/components/ReaderDialog";
import { useNotebookData } from "@/hooks/useNotebookData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { childFolders, childNotes, folderPath, folderPathString } from "@/lib/notes";

export default function App() {
  const { data, loading } = useNotebookData();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  const debouncedQuery = useDebouncedValue(searchInput, 200);
  const trimmedQuery = debouncedQuery.trim();

  const folders = data?.folders ?? [];
  const notes = data?.notes ?? [];

  const path = useMemo(() => folderPath(folders, currentFolderId), [folders, currentFolderId]);
  const visibleFolders = useMemo(() => childFolders(folders, currentFolderId), [folders, currentFolderId]);
  const visibleNotes = useMemo(() => childNotes(notes, currentFolderId), [notes, currentFolderId]);

  const openNote = notes.find((n) => n.id === openNoteId) ?? null;

  const navigateTo = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to notes
      </a>

      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl">
              <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                <BookOpen className="size-4.5" aria-hidden="true" />
              </span>
              <span>
                <span className="text-primary">Note</span>book
              </span>
            </h1>
            {!loading && (
              <Badge variant="outline" className="font-mono text-[0.7rem]">
                {notes.length} {notes.length === 1 ? "note" : "notes"} · {folders.length}{" "}
                {folders.length === 1 ? "folder" : "folders"}
              </Badge>
            )}
          </div>

          <div className="relative" role="search">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="search" className="sr-only">
              Search all notes
            </label>
            <Input
              id="search"
              type="search"
              placeholder="Search all notes…"
              autoComplete="off"
              className="pl-11 pr-11"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-full"
                onClick={() => setSearchInput("")}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>

          {!trimmedQuery && <FolderBreadcrumb path={path} onNavigate={navigateTo} />}
        </div>
      </header>

      <main id="main" className="mx-auto max-w-4xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : trimmedQuery ? (
          <SearchResults query={trimmedQuery} notes={notes} folders={folders} onOpenNote={setOpenNoteId} />
        ) : folders.length === 0 && notes.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-7" aria-hidden="true" />}
            title="Nothing here yet"
            description="This notebook is empty. Once notes and folders are added, they will show up here for browsing and search."
          />
        ) : visibleFolders.length === 0 && visibleNotes.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-7" aria-hidden="true" />}
            title="Empty folder"
            description="No subfolders or notes here."
          />
        ) : (
          <EntryGrid
            folders={visibleFolders}
            notes={visibleNotes}
            allFolders={folders}
            allNotes={notes}
            onOpenFolder={navigateTo}
            onOpenNote={setOpenNoteId}
          />
        )}
      </main>

      <ReaderDialog
        note={openNote}
        folderPathLabel={openNote ? folderPathString(folders, openNote.folderId) : ""}
        onClose={() => setOpenNoteId(null)}
      />
    </div>
  );
}
