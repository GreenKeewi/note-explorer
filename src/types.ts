export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Note {
  id: string;
  title: string;
  folderId: string | null;
  contentHtml: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotebookData {
  folders: Folder[];
  notes: Note[];
}
