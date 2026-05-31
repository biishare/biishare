import { api } from '../lib/axios'

import { Ad } from '../types/ad' 

export type GetAdsParams = {
  layout?: string

  active?: boolean

  page?: number

  limit?: number
}

/**
 * Pega anúncios
 * - Se layout = "all" ou undefined → retorna todos
 * - active controla ativos/inativos
 * - page e limit controlam paginação
 */

export async function getAds(
  params?: GetAdsParams
) {
  const cleanParams =
    Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, v]) =>
          v !== undefined &&
          v !== ''
      )
    )

  const response = await api.get(
    '/ads',
    {
      params: cleanParams,
    }
  )

  return response.data as {
    data: Ad[]

    page: number

    total: number

    totalPages?: number
  }
}

/* ======================================================
 * GET AD BY ID
 * ====================================================== */

export async function getAdById(
  id: string
): Promise<Ad> {
  const response = await api.get(
    `/ads/${id}`
  )

  return response.data.data
}