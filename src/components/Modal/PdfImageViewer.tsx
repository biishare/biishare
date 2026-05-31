import { Dialog, IconButton, Box } from "@mui/material";
import { X } from "lucide-react";
import { PdfImageViewer } from "../Document/PdfImageViewer";

interface FullscreenPdfViewerProps {
  open: boolean;
  onClose: () => void;
  url: string;
  totalPages?: number;
}

export function FullscreenPdfViewer({
  open,
  onClose,
  url,
  totalPages,
}: FullscreenPdfViewerProps) {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      {/* HEADER FIXO */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "#111",
          p: 1,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <IconButton onClick={onClose}>
          <X color="#fff" />
        </IconButton>
      </Box>

      {/* PDF SCROLL */}
      <PdfImageViewer
        url={url}
        height="calc(100vh - 48px)"
        maxPages={totalPages}
      />
    </Dialog>
  );
}
