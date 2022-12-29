export interface SiteLink {
    title: string
    onClick?: () => void
    link: string
}

export interface APIRes<T> {
    err: boolean
    message?: string
    res?: T
}

export interface CarouselItem {
    imgURL: string
    id: string
}

export type LoadState = 'init' | 'loading' | 'success' | 'failure'
export type Primitive = number | string | boolean | null | undefined
