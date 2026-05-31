// src/utils/documentViewer.ts
export function getDocumentViewerUrl(url: string) {
  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    url
  )}`;
}
