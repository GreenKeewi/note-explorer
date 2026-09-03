import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { stripTags } from "@/lib/notes";
import type { Note } from "@/types";

const speechAvailable =
  typeof window !== "undefined" &&
  typeof window.speechSynthesis !== "undefined" &&
  typeof window.SpeechSynthesisUtterance !== "undefined";

export function ReaderDialog({
  note,
  folderPathLabel,
  onClose,
}: {
  note: Note | null;
  folderPathLabel: string;
  onClose: () => void;
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
    if (!note) stopSpeech();
    // stop speech whenever the note changes or dialog closes
    return () => {
      if (speechAvailable) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

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

  return (
    <Dialog
      open={!!note}
      onOpenChange={(open) => {
        if (!open) {
          stopSpeech();
          onClose();
        }
      }}
    >
      <DialogContent className="p-0">
        {note && (
          <>
            <DialogHeader>
              <span className="mb-1 w-fit rounded-full bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
                {folderPathLabel}
              </span>
              <DialogTitle>{note.title || "Untitled"}</DialogTitle>
            </DialogHeader>

            {speechAvailable && (
              <div className="flex flex-wrap items-center gap-2 px-6">
                <Button
                  type="button"
                  variant={speaking && !paused ? "default" : "outline"}
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
                  <Button type="button" variant="secondary" className="rounded-full" onClick={stopSpeech}>
                    <Square className="size-4" aria-hidden="true" />
                    Stop
                  </Button>
                )}
              </div>
            )}

            <ScrollArea className="px-6 pb-6 pt-4">
              <div
                ref={contentRef}
                className="note-content max-w-[68ch] text-[1.05rem] leading-relaxed [&_h1]:font-semibold [&_h1]:text-xl [&_h2]:font-semibold [&_h2]:text-lg [&_h3]:font-semibold [&_img]:rounded-md [&_a]:text-primary [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:pl-5 [&_li]:mb-1.5"
                dangerouslySetInnerHTML={{ __html: note.contentHtml || "" }}
              />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
