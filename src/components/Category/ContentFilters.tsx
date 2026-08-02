'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Chip, Button, Popover, useMediaQuery } from "@mui/material";
import { LEVEL_LABEL_MAP, SUBJECT_LABEL_MAP } from "../../../constants/maps";
import { usePostFilters } from "../../../utils/Post/FetchPosts";
import { FiltersSkeleton } from "../Skeleton/Filters.Skeleton";
import { useFeedChrome } from "../../../hooks/useFeedChrome";

export default function ContentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, loading, error } = usePostFilters();
  const { filterTop } = useFeedChrome();
  const isDesktop = useMediaQuery("(min-width:900px)", { noSsr: true });
  const stickyTop = isDesktop ? 0 : filterTop;
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverType, setPopoverType] = useState<string>("");

  useEffect(() => {
    let frame = 0;

    const updateStickyState = () => {
      frame = 0;
      const filtersNode = filtersRef.current;

      if (!filtersNode) return;

      const { top } = filtersNode.getBoundingClientRect();
      setIsStuck(top <= stickyTop + 1);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateStickyState);
    };

    updateStickyState();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [loading, stickyTop]);

  if (loading) return <FiltersSkeleton stickyTop={stickyTop} stuck={isStuck} />;
  if (error || !filters) return <Box mt={4}>Erro ao carregar filtros</Box>;

  // obter valor atual
  const getFilterValue = (key: string) => searchParams.get(key) || "";

  // atualizar query
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", {
      scroll: false,
    });
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
      ref={filtersRef}
      data-testid="content-filters"
      aria-label="Filtros de conteudo"
      sx={{
        display: "flex",
        gap: 1,
        mt: 2,
        mb: isStuck ? 2 : 1,
        mx: {
          xs: 0,
          lg: -1.5,
        },
        px: {
          xs: 2,
          lg: 1.5,
        },
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },

        position: "sticky",
        top: stickyTop,
        zIndex: 40,
        transition:
          "top 180ms ease, margin-bottom 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",

        bgcolor: isStuck ? "rgba(255,255,255,0.96)" : "background.paper",
        backdropFilter: isStuck ? "blur(14px)" : "none",
        borderBottom: isStuck
          ? "1px solid rgba(226, 232, 240, 0.9)"
          : "1px solid transparent",
        boxShadow: "none",
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
