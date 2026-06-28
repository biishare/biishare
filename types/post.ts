/* ---------- MEDIA ---------- */

export type MediaItem = {
  title: string;
  url: string;
  totalPages?: number; // 👈 novo (usado apenas em documentos)
};

/* ---------- POST ---------- */

export type PostDTO = {
  _id: string;
  subjectId?: string;
  subjectIds: string[];
  title: string;
  description: string;
  level: string;
  contentType: "video" | "document";
  imageLink: string;

  videos?: MediaItem[];
  documents?: MediaItem[];

  createdAt: string;
  updatedAt: string;
};

/* ---------- FILTERS ---------- */
  
export type PostFiltersResponse = {
  subjects: string[];
  levels: string[];
  contentTypes: ("video" | "document")[];
};
