'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Chip, Button, Popover } from "@mui/material";
import { LEVEL_LABEL_MAP, SUBJECT_LABEL_MAP } from "../../../constants/maps";
import { usePostFilters } from "../../../utils/Post/FetchPosts";
import { FiltersSkeleton } from "../Skeleton/Filters.Skeleton";

export default function ContentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, loading, error } = usePostFilters();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverType, setPopoverType] = useState<string>("");

  if (loading) return <FiltersSkeleton />;
  if (error || !filters) return <Box mt={4}>Erro ao carregar filtros</Box>;

  // obter valor atual
  const getFilterValue = (key: string) => searchParams.get(key) || "";

  // atualizar query
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const openPopover = (event: React.MouseEvent<HTMLElement>, type: string) => {
    setAnchorEl(event.currentTarget);
    setPopoverType(type);
  };

  const closePopover = () => setAnchorEl(null);

  const popoverOpen = Boolean(anchorEl);

  // 🔥 ESTILO PADRÃO DOS CHIPS
  const getChipStyle = (active: boolean) => ({
    minWidth: 120,
    fontWeight: 600,
    borderRadius: 999,

    backgroundColor: active ? '#F59E0B' : '#F1F5F9',
    color: active ? '#fff' : '#64748B',

    border: active
      ? '1px solid #F59E0B'
      : '1px solid transparent',

    boxShadow: active
      ? '0 2px 6px rgba(245,158,11,0.35)'
      : 'none',

    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: active
        ? '#e59400'
        : '#E2E8F0',
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mt: 2,
        mb: 1,
        px: 2,
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },

        position: "sticky",
        top: 0,
        zIndex: 999,

        bgcolor: "background.paper",
        borderBottom: "1px solid #e0e0e0",
        py: 1,
      }}
    >
      {/* NÍVEL */}
      <Chip
        label={
          getFilterValue("level")
            ? LEVEL_LABEL_MAP[getFilterValue("level")]
            : "Todos os níveis"
        }
        onClick={(e) => openPopover(e, "level")}
        clickable
        sx={getChipStyle(!!getFilterValue("level"))}
      />

      {/* DISCIPLINA */}
      <Chip
        label={
          getFilterValue("subjectId")
            ? SUBJECT_LABEL_MAP[getFilterValue("subjectId")]
            : "Todas as disciplinas"
        }
        onClick={(e) => openPopover(e, "subjectId")}
        clickable
        sx={getChipStyle(!!getFilterValue("subjectId"))}
      />

      {/* TIPO */}
      <Chip
        label={
          getFilterValue("contentType") === "video"
            ? "Vídeos"
            : getFilterValue("contentType") === "document"
            ? "Documentos"
            : "Todos os tipos"
        }
        onClick={(e) => openPopover(e, "contentType")}
        clickable
        sx={getChipStyle(!!getFilterValue("contentType"))}
      />

      {/* POPOVER */}
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 2,
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* LEVEL */}
          {popoverType === "level" &&
            ["", ...filters.levels].map((level) => (
              <Button
                key={level || "all"}
                variant={
                  getFilterValue("level") === level
                    ? "contained"
                    : "outlined"
                }
                color="warning"
                onClick={() => {
                  updateQuery("level", level);
                  closePopover();
                }}
              >
                {level
                  ? LEVEL_LABEL_MAP[level]
                  : "Todos os níveis"}
              </Button>
            ))}

          {/* SUBJECT */}
          {popoverType === "subjectId" &&
            ["", ...filters.subjects].map((sub) => (
              <Button
                key={sub || "all"}
                variant={
                  getFilterValue("subjectId") === sub
                    ? "contained"
                    : "outlined"
                }
                color="warning"
                onClick={() => {
                  updateQuery("subjectId", sub);
                  closePopover();
                }}
              >
                {sub
                  ? SUBJECT_LABEL_MAP[sub]
                  : "Todas as disciplinas"}
              </Button>
            ))}

          {/* TYPE */}
          {popoverType === "contentType" &&
            ["", "video", "document"].map((type) => (
              <Button
                key={type || "all"}
                variant={
                  getFilterValue("contentType") === type
                    ? "contained"
                    : "outlined"
                }
                color="warning"
                onClick={() => {
                  updateQuery("contentType", type);
                  closePopover();
                }}
              >
                {type === "video"
                  ? "Vídeos"
                  : type === "document"
                  ? "Documentos"
                  : "Todos os tipos"}
              </Button>
            ))}
        </Box>
      </Popover>
    </Box>
  );
}
