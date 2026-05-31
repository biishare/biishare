/* eslint-disable @next/next/no-img-element */
import { Box } from "@mui/material";

function pdfPageToImage(url: string, page: number, width = 1400) {
  return url.replace(
    "/upload/",
    `/upload/pg_${page},w_${width},f_webp,q_auto/`
  );
}

export function PdfImageViewer({
  url,
  maxPages = 12,
  height = 500,
}: {
  url: string;
  maxPages?: number;
  height?: number | string;
}) {
  return (
    <Box
      sx={{
        height,
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "#000",
        p: 2,
      }}
    >
      {Array.from({ length: maxPages }).map((_, i) => (
        <img
          key={i}
          src={pdfPageToImage(url, i + 1)}
          alt={`Página ${i + 1}`}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            marginBottom: 16,
            background: "#fff",
          }}
        />
      ))}
    </Box>
  );
}
