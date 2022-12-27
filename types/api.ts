export interface ShopifyData {
    collection: Partial<ShopifyCollection>
}

export interface ShopifyCollection {
    products: Partial<ShopifyProduct>
}

export interface ShopifyProduct {
    nodes: Partial<ShopifyProductNode>[]
}

export interface ShopifyProductNode {
    id: string | null
    description: string | null
    onlineStoreUrl: string | null
    priceRange: Partial<ShopifyPriceRange>
    title: string|null
    images: Partial<ShopifyImage>
}

export interface ShopifyPriceRange {
    maxVariantPrice: Partial<ShopifyPriceVariant>
    minVariantPrice: Partial<ShopifyPriceVariant>
}

export interface ShopifyPriceVariant {
    amount: number | null
}

export interface ShopifyImage {
    nodes: Partial<ShopifyImageNode>[]
}

export interface ShopifyImageNode {
    url: string | null
}
