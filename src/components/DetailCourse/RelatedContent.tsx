"use client";

import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "../../../services/post.service";
import { PostDTO } from "../../../types/post";
import ContentCard from "../Course/ContentCard";
import { ToqueRow } from "../Toque/ToqueRow";

interface Props {
  post: PostDTO;
}

export default function RelatedContent({ post }: Props) {
  const { data } = useQuery({
    queryKey: ["related-posts", post._id, post.subjectId, post.level],
    queryFn: () =>
      getPosts({
        subjectId: post.subjectId,
        level: post.level,
        page: 1,
        limit: 5,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const relatedPosts =
    data?.data
      .filter(item => item._id !== post._id)
      .slice(0, 4) ?? [];

  if (relatedPosts.length === 0) {
    return (
      <Box mt={5}>
        <ToqueRow
          area={post.subjectId}
          page={1}
          limit={5}
          title="Toques relacionados"
        />
      </Box>
    );
  }

  return (
    <Box mt={5}>
      <ToqueRow
        area={post.subjectId}
        page={1}
        limit={5}
        title="Toques relacionados"
      />

      <Box mt={4}>
        <Typography
          component="h2"
          fontSize={18}
          fontWeight={800}
          px={1}
          mb={1.5}
        >
          Outros posts relacionados
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            px: 1,
          }}
        >
          {relatedPosts.map(item => (
            <ContentCard key={item._id} post={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
