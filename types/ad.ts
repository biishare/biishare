export type AdLayout =
    | 'hero'
    | 'banner'
    | 'card'

export type AdFitMode =
    | 'cover'
    | 'contain'
    | 'auto'

export type AdFocalPoint =
    | 'center'
    | 'top'
    | 'bottom'

export type AdPriority =
    | 'visual'
    | 'informational'

/* ---------- BASE ---------- */

type AdBase = {
    _id: string

    title?: string

    subtitle?: string

    cta?: string

    link?: string

    layout: AdLayout

    fitMode: AdFitMode

    focalPoint: AdFocalPoint

    blurStrength: number

    priority: AdPriority

    active: boolean

    createdAt: string

    updatedAt: string
}

/* ---------- VIDEO ---------- */

type AdVideo = {
    mediaType: 'video'

    video: string

    image?: never
}

/* ---------- IMAGE ---------- */

type AdImage = {
    mediaType: 'image'

    image: string

    video?: never
}

/* ---------- FINAL ---------- */

export type Ad =
    AdBase &
    (AdVideo | AdImage)