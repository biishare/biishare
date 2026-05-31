// utils/Post/usePostFilters.ts
"use client";

import { useEffect, useState } from "react";
import { getPostFilters } from "../../services/post.service";
import { PostFiltersResponse } from "../../types/post"; 

export function usePostFilters() {
  const [filters, setFilters] = useState<PostFiltersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchFilters() {
      try {
        console.log("📡 Chamando GET /api/posts/filters");

        const data = await getPostFilters();

        console.log("✅ Filtros recebidos:", data);

        if (mounted) {
          setFilters(data);
        }
      } catch (err: any) {
        console.group("🔥 ERRO AO CARREGAR FILTROS");

        console.log("Mensagem:", err?.message);
        console.log("URL:", err?.config?.url);
        console.log("Method:", err?.config?.method);

        if (err?.response) {
          console.log("Status:", err.response.status);
          console.log("Response data:", err.response.data);
        } else {
          console.log("Sem response (Network / CORS / API off)");
        }

        console.groupEnd();

        if (mounted) setError("Erro ao carregar filtros");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFilters();
    return () => {
      mounted = false;
    };
  }, []);

  return { filters, loading, error };
}



// import { useState, useEffect } from "react";
// import { getPosts } from "../../services/post.service";

// /* ---------- TYPES ---------- */

// type PostLite = {
//   year: number;
// };

// interface Filters {
//   anos: number[];
//   loading: boolean;
//   error: string | null;
// }

// export function useFetchFilters(): Filters {
//   const [anos, setAnos] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;

//     async function fetchYears() {
//       try {
//         setLoading(true);
//         setError(null);

//         // 🔹 pega apenas o necessário para filtros
//         const response = await getPosts({ limit: 1000 });
//         const posts: PostLite[] = response.data;

//         if (!mounted) return;

//         const uniqueAnos = Array.from(
//           new Set(posts.map((p) => p.year))
//         ).sort((a, b) => a - b);

//         setAnos(uniqueAnos);
//       } catch {
//         if (mounted) {
//           setError("Erro ao carregar anos disponíveis.");
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchYears();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   return {
//     anos,
//     loading,
//     error,
//   };
// }
