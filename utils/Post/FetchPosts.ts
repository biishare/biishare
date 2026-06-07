// utils/Post/usePostFilters.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { getPostFilters } from '../../services/post.service'

export function usePostFilters() {
  const {
    data,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['post-filters'],
    queryFn: getPostFilters,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  })

  return {
    filters: data ?? null,
    loading: isPending && !data,
    error: isError ? 'Erro ao carregar filtros' : null,
  }
}
