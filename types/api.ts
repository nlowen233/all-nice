export interface ShopifyDataProductHandles {
    collection?: {
        products?: {
            nodes?: { handle?: string | null }[]
        }
    }
}

export interface ShopifyUserError {
    message?: string
    field?: string
    code?: string
}
