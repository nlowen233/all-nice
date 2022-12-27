import Image from 'next/image'
import React from 'react'
import { ShopifyProductNode } from '../types/api'

type Props = {
    product: Partial<ShopifyProductNode>
}

export const ProductCard = ({product}:Props) => {
    const imgUrl = !!product.images?.nodes ? product.images?.nodes[0].url||undefined : undefined
    return (
        <div>
            <Image
                src={imgUrl||''}
                alt={'image of product'}
                width={200}
                height={200}
            />  
        </div>
    )
}
