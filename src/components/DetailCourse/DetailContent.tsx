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

import { MediaItem, PostDTO, PostContentType } from "../../../types/post";
import { ContentPlaylist } from "./ContentPlayList";
import { FullscreenPdfViewer } from "../Modal/PdfImageViewer";
import { PdfImageViewer } from "../Document/PdfImageViewer";
import VideoPlay from "../VideoPlay/VideoPlay";
import RelatedContent from "./RelatedContent";
import { getContentTypeLabel, getLevelLabel, getSubjectLabels } from "../../../utils/labels";
import SavePostButton from "../Post/SavePostButton";

interface DetailContentProps {
  post: PostDTO;
}

type RenderKind = "video" | "document" | "image";

export default function DetailContent({ post }: DetailContentProps) {
  const contentType = post.contentType;
  const list = getPostContentItems(post);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openFullscreen, setOpenFullscreen] = useState(false);
  const [expanded, setExpanded] = useState(false)

  const activeItem = list[activeIndex] ?? list[0];
  const activeKind = activeItem ? getRenderKind(contentType, activeItem) : "video";

  const subjectLabel = getSubjectLabels(post.subjectIds, post.subjectId);

  if (!activeItem) {
    return <Typography>Nenhum conteudo disponivel</Typography>;
  }

  const totalPages =
    activeKind === "document"
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
        <Box>
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: "#000",
            }}
          >
            {activeKind === "video" && (
              <Box sx={{ aspectRatio: "16 / 9" }}>
                <VideoPlay
                  url={activeItem.url}
                  poster=""
                  blurDataURL=""
                  markVideoAsCompleted={() => { }}
                />
              </Box>
            )}

            {activeKind === "image" && (
              <Box
                component="img"
                src={activeItem.url}
                alt={activeItem.title || post.title}
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  display: "block",
                  objectFit: "contain",
                  bgcolor: "#000",
                }}
              />
            )}

            {activeKind === "document" && (
              <Box sx={{ position: "relative" }}>
                <PdfImageViewer
                  url={activeItem.url}
                  height={520}
                  maxPages={totalPages}
                />

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

          <Box mt={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1}
            >
              <Typography variant="h5" fontWeight={700}>
                {post.title}
              </Typography>
              <SavePostButton postId={post._id} title={post.title} />
            </Stack>

            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              <Chip label={subjectLabel} size="small" />
              <Chip label={getLevelLabel(post.level)} size="small" />
              <Chip label={getContentTypeLabel(contentType)} size="small" />

              {activeKind === "document" && totalPages && (
                <Chip label={`${totalPages} paginas`} size="small" />
              )}
            </Stack>

            <Box mt={2}>
              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.5,
                  opacity: 0.9,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: expanded ? "unset" : 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setExpanded(v => !v)}
              >
                {post.description}
              </Typography>
            </Box>
          </Box>
        </Box>

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
            {contentType === "playlist" ? "Playlist" : "Conteudos"}
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

      {activeKind === "document" && (
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

function getPostContentItems(post: PostDTO): MediaItem[] {
  if (post.contentType === "video") {
    return (post.videos ?? []).map((item) => ({ ...item, kind: "video" }));
  }

  if (post.contentType === "document") {
    return (post.documents ?? []).map((item) => ({ ...item, kind: "document" }));
  }

  if (post.contentType === "image") {
    return (post.images ?? []).map((item) => ({ ...item, kind: "image" }));
  }

  return (post.playlist ?? []).map((item) => ({
    ...item,
    kind: item.kind === "document" ? "document" : "video",
  }));
}

function getRenderKind(contentType: PostContentType, item: MediaItem): RenderKind {
  if (contentType === "playlist") {
    return item.kind === "document" ? "document" : "video";
  }

  if (contentType === "document") {
    return "document";
  }

  if (contentType === "image") {
    return "image";
  }

  return "video";
}
