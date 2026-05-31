"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getPostById } from "../../../services/post.service";
import DetailContent from "./DetailContent";
import { PostDTO } from "../../../types/post";
import DetailContentSkeleton from "../Skeleton/Detaile.Skeleton";


interface Props {
  id: String
}

export default function ContentPage({id}:Props) {


  const [post, setPost] = useState<PostDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Narrowing REAL
    if (typeof id !== "string") {
      setLoading(false);
      return;
    }

    const postId: string = id; // ← agora é string garantida

    async function load() {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <DetailContentSkeleton />
  }

  if (!id) {
    return (
      <Typography align="center" color="error">
        ID inválido ou não informado
      </Typography>
    );
  }

  if (!post) {
    return <Typography align="center">Conteúdo não encontrado</Typography>;
  }

  return <DetailContent post={post} />;
}
