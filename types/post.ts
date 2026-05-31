/* ---------- MEDIA ---------- */

export type MediaItem = {
  title: string;
  url: string;
  totalPages?: number; // 👈 novo (usado apenas em documentos)
};

/* ---------- POST ---------- */

export type PostDTO = {
  _id: string;
  subjectId: string;
  title: string;
  year: number;
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
  years: number[];
  contentTypes: ("video" | "document")[];
};
