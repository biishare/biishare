import { api } from '../lib/axios'
import { Toque } from '../types/Toque'

export type GetShortsParams = {
  area?: string
  page?: number
  limit?: number
}

/**
 * Pega shorts
 * - Se area = "todos" ou undefined → retorna todos os shorts
 * - page e limit controlam paginação / quantidade
 */
export async function getShorts(params?: GetShortsParams) {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
  )

  const response = await api.get('/toques', { params: cleanParams })

  return response.data as {
    data: Toque[]
    page: number
    total: number
    totalPages?: number
  }
}

export async function getToqueById(id: string): Promise<Toque> {
  const response = await api.get(`/toques/${id}`)
  return response.data
}