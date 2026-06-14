"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { Maximize2 } from "lucide-react";

import { PostDTO } from "../../../types/post";
import { ContentPlaylist } from "./ContentPlayList";
import { SUBJECTS } from "../../../constants/subjects";
import { FullscreenPdfViewer } from "../Modal/PdfImageViewer";
import { PdfImageViewer } from "../Document/PdfImageViewer";
import VideoPlay from "../VideoPlay/VideoPlay";
import RelatedContent from "./RelatedContent";

interface DetailContentProps {
  post: PostDTO;
}

export default function DetailContent({ post }: DetailContentProps) {
  const contentType = post.contentType;

  const list =
    contentType === "video"
      ? post.videos ?? []
      : post.documents ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [openFullscreen, setOpenFullscreen] = useState(false);

  const activeItem = list[activeIndex];

  const subjectLabel =
    SUBJECTS.find(s => s.id === post.subjectId)?.label ?? post.subjectId;

  if (!activeItem) {
    return <Typography>Nenhum conteúdo disponível</Typography>;
  }

  const totalPages =
    contentType === "document" && "totalPages" in activeItem
      ? activeItem.totalPages ?? 1
      : undefined;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 6, lg: 10 },
        py: 4,
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* 🎥 HERO */}
        <Box>
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: "#000",
            }}
          >
            {contentType === "video" ? (
              <Box sx={{ aspectRatio: "16 / 9" }}>
                <VideoPlay
                  url={activeItem.url}
                  poster=""
                  blurDataURL=""
                  markVideoAsCompleted={() => {}}
                />
              </Box>
            ) : (
              <Box sx={{ position: "relative" }}>
                <PdfImageViewer
                  url={activeItem.url}
                  height={520}
                  maxPages={totalPages}
                />

                {/* botão flutuante */}
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setOpenFullscreen(true)}
                  startIcon={<Maximize2 size={16} />}
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    backdropFilter: "blur(6px)",
                    background: "rgba(0,0,0,0.6)",
                    "&:hover": {
                      background: "rgba(0,0,0,0.8)",
                    },
                  }}
                >
                  Expandir
                </Button>
              </Box>
            )}
          </Paper>

          {/* 📄 INFO */}
          <Box mt={2}>
            <Typography variant="h5" fontWeight={700}>
              {post.title}
            </Typography>

            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              <Chip label={subjectLabel} size="small" />
              <Chip label={post.level} size="small" />
              <Chip label={post.year} size="small" />

              {contentType === "document" && totalPages && (
                <Chip label={`${totalPages} páginas`} size="small" />
              )}
            </Stack>
          </Box>
        </Box>

        {/* 📚 PLAYLIST */}
        <Paper
          sx={{
            borderRadius: 3,
            p: 2,
            height: "fit-content",
            maxHeight: { md: "80vh" },
            overflow: "auto",
            position: "sticky",
            top: 20,
          }}
        >
          <Typography fontWeight={700} mb={2}>
            {contentType === "video"
              ? "Conteúdos do vídeo"
              : "Documentos"}
          </Typography>

          <ContentPlaylist
            items={list}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            type={contentType}
          />
        </Paper>
      </Box>

      <RelatedContent post={post} />

      {/* FULLSCREEN */}
      {contentType === "document" && (
        <FullscreenPdfViewer
          open={openFullscreen}
          onClose={() => setOpenFullscreen(false)}
          url={activeItem.url}
          totalPages={totalPages}
        />
      )}
    </Box>
  );
}
