export interface Note {
  id: string;
  title: string;
  contentHtml: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotebookData {
  notes: Note[];
}
