import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Folder } from "@/types";

export function FolderBreadcrumb({
  path,
  onNavigate,
}: {
  path: Folder[];
  onNavigate: (folderId: string | null) => void;
}) {
  return (
    <Breadcrumb aria-label="Folder path">
      <BreadcrumbList>
        <BreadcrumbItem>
          {path.length === 0 ? (
            <BreadcrumbPage className="flex items-center gap-1.5">
              <Home className="size-3.5" aria-hidden="true" />
              Home
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md px-1 py-1"
                onClick={() => onNavigate(null)}
              >
                <Home className="size-3.5" aria-hidden="true" />
                Home
              </button>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {path.map((folder, i) => {
          const isLast = i === path.length - 1;
          return (
            <span key={folder.id} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button type="button" className="rounded-md px-1 py-1" onClick={() => onNavigate(folder.id)}>
                      {folder.name}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
