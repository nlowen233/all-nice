export interface SiteLink {
    title: string
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
