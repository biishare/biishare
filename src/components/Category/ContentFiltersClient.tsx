'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Box, Chip, Button, Popover } from "@mui/material"

import {
  LEVEL_LABEL_MAP,
  SUBJECT_LABEL_MAP
} from "../../../constants/maps"

import { usePostFilters } from "../../../utils/Post/FetchPosts"
import { FiltersSkeleton } from "../Skeleton/Filters.Skeleton"
import { getContentTypeLabel } from "../../../utils/labels"
import type { PostContentType } from "../../../types/post"

const DEFAULT_CONTENT_TYPES: PostContentType[] = ["video", "document", "image", "playlist"]

export default function ContentFiltersClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { filters, loading, error } = usePostFilters()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [popoverType, setPopoverType] = useState("")

  if (loading) return <FiltersSkeleton />
  if (error || !filters) return <Box mt={4}>Erro ao carregar filtros</Box>

  const contentTypes = Array.from(new Set([...DEFAULT_CONTENT_TYPES, ...filters.contentTypes]))
  const get = (key: string) => searchParams.get(key) || ""

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) params.set(key, value)
    else params.delete(key)

    params.delete("page")

    const query = params.toString()
    router.replace(query ? `/?${query}` : "/", {
      scroll: false,
    })
  }

  const openPopover = (e: React.MouseEvent<HTMLElement>, type: string) => {
    setAnchorEl(e.currentTarget)
    setPopoverType(type)
  }

  const closePopover = () => setAnchorEl(null)

  const open = Boolean(anchorEl)

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mt: 2,
        mb: 1,
        px: 2,
        overflowX: "auto",
        position: "sticky",
        top: 0,
        zIndex: 999,
        bgcolor: "background.paper",
        borderBottom: "1px solid #e0e0e0",
        py: 1,
      }}
    >
      <Chip
        label={
          get("level")
            ? LEVEL_LABEL_MAP[get("level")]
            : "Todos os niveis"
        }
        onClick={(e) => openPopover(e, "level")}
        color={get("level") ? "warning" : "default"}
      />

      <Chip
        label={
          get("subjectId")
            ? SUBJECT_LABEL_MAP[get("subjectId")]
            : "Todas as disciplinas"
        }
        onClick={(e) => openPopover(e, "subjectId")}
        color={get("subjectId") ? "warning" : "default"}
      />

      <Chip
        label={
          get("contentType")
            ? getContentTypeLabel(get("contentType") as PostContentType)
            : "Todos os tipos"
        }
        onClick={(e) => openPopover(e, "contentType")}
        color={get("contentType") ? "warning" : "default"}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>

          {popoverType === "level" &&
            ["", ...filters.levels].map((l) => (
              <Button
                key={l || "all"}
                onClick={() => {
                  updateQuery("level", l)
                  closePopover()
                }}
              >
                {l ? LEVEL_LABEL_MAP[l] : "Todos"}
              </Button>
            ))}

          {popoverType === "subjectId" &&
            ["", ...filters.subjects].map((s) => (
              <Button
                key={s || "all"}
                onClick={() => {
                  updateQuery("subjectId", s)
                  closePopover()
                }}
              >
                {s ? SUBJECT_LABEL_MAP[s] : "Todos"}
              </Button>
            ))}

          {popoverType === "contentType" &&
            ["", ...contentTypes].map((t) => (
              <Button
                key={t || "all"}
                onClick={() => {
                  updateQuery("contentType", t)
                  closePopover()
                }}
              >
                {t ? getContentTypeLabel(t as PostContentType) : "Todos"}
              </Button>
            ))}
        </Box>
      </Popover>
    </Box>
  )
}
