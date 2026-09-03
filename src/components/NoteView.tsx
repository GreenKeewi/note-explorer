import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Pause, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { relTime, stripTags } from "@/lib/notes";
import type { Note } from "@/types";

const speechAvailable =
  typeof window !== "undefined" &&
  typeof window.speechSynthesis !== "undefined" &&
  typeof window.SpeechSynthesisUtterance !== "undefined";

export function NoteView({
  note,
  onBack,
  showBack,
}: {
  note: Note | null;
  onBack: () => void;
  showBack: boolean;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const stopSpeech = () => {
    if (speechAvailable) window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  useEffect(() => {
    stopSpeech();
    return () => {
      if (speechAvailable) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id]);

  const handlePlayPause = () => {
    if (speaking && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
      return;
    }
    if (speaking && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      return;
    }
    const text = contentRef.current ? stripTags(contentRef.current.innerHTML) : "";
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = utterance.onend;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setPaused(false);
  };

  if (!note) {
    return (
      <div className="hidden h-full flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground md:flex">
        <p className="max-w-[32ch] text-sm">Select a note to read it here.</p>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-1 flex-col overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-md sm:px-8">
        {showBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Back to notes"
            className="rounded-full md:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="size-4.5" aria-hidden="true" />
          </Button>
        )}
        {speechAvailable && (
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant={speaking && !paused ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={handlePlayPause}
            >
              {speaking && !paused ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : speaking && paused ? (
                <Play className="size-4" aria-hidden="true" />
              ) : (
                <Volume2 className="size-4" aria-hidden="true" />
              )}
              {speaking && !paused ? "Pause" : speaking && paused ? "Resume" : "Read aloud"}
            </Button>
            {speaking && (
              <Button type="button" variant="secondary" size="sm" className="rounded-full" onClick={stopSpeech}>
                <Square className="size-3.5" aria-hidden="true" />
                Stop
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-[68ch] flex-1 px-5 py-8 sm:px-8 sm:py-12">
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          {relTime(note.updatedAt || note.createdAt)}
        </p>
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {note.title || "Untitled"}
        </h1>
        <div
          ref={contentRef}
          className="note-content text-[1.05rem] leading-[1.8] text-foreground/90 [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-foreground [&_img]:my-6 [&_img]:rounded-lg [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2"
          dangerouslySetInnerHTML={{ __html: note.contentHtml || "" }}
        />
      </div>
    </article>
  );
}
