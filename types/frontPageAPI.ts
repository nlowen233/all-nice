export interface ShopifyDataFrontPage {
    collection?: {
        products?: {
            nodes?: ShopifyProductNodeFrontPage[]
        }
    }
}

export interface ShopifyProductNodeFrontPage {
    id?: string | null
    description?: string | null
    handle?: string | null
    priceRange?: ShopifyPriceRangeFrontPage
    title?: string | null
    images?: {
        nodes?: { url?: string | null }[]
    }
}

export interface ShopifyPriceRangeFrontPage {
    maxVariantPrice?: ShopifyPriceVariantFrontPage
    minVariantPrice?: ShopifyPriceVariantFrontPage
}

export interface ShopifyPriceVariantFrontPage {
    amount?: string | null
}
