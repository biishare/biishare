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
export type SavedPostDTO = {
  id: string;
  savedAt: string;
  post: PostDTO;
};

export type SavedPostsResponse = {
  data: SavedPostDTO[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};
/* ---------- FILTERS ---------- */
  
export type PostFiltersResponse = {
  subjects: string[];
  levels: string[];
  contentTypes: ("video" | "document")[];
};
