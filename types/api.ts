export interface ShopifyDataProductHandles {
    collection?: {
        products?: {
            nodes?: { handle?: string | null }[]
        }
    }
}

export interface CustomerUserError {
    message?: string
    field?: string
    code?: string
}
