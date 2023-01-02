export interface ShopifyDataSingleProduct {
    product?: ShopifyProductSingleProduct
}

export interface ShopifyProductSingleProduct {
    handle?: string | null
    id?: string | null
    title?: string | null
    images?: ShopifyImagesSingleProduct
    description?: string | null
    featuredImage?: ShopifyFeaturedImageSingleProduct
    totalInventory?: string | null
    priceRange?: ShopifyPriceRangeSingleProduct
    options?: ShopifyOptionsSingleProduct[]
    variants?: {
        nodes?: {
            id?: string
            availableForSale?: boolean | null
            quantityAvailable?: number | null
            price?: {
                amount?: string | null
            }
            selectedOptions?: {
                name?: string | null
                value: string | null
            }[]
        }[]
    }
}

export interface ShopifyImagesSingleProduct {
    nodes?: ShopifyImageNodeSingleProduct[]
}

export interface ShopifyImageNodeSingleProduct {
    url?: string | null
}

export interface ShopifyFeaturedImageSingleProduct {
    id?: string | null
}

export interface ShopifyPriceRangeSingleProduct {
    maxVariantPrice: ShopifyVariantPriceSingleProduct
    minVariantPrice: ShopifyVariantPriceSingleProduct
}

export interface ShopifyVariantPriceSingleProduct {
    amount?: string | null
}

export interface ShopifyOptionsSingleProduct {
    id?: string | null
    name?: string | null
    values?: string[]
}
