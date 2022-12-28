import Image from 'next/image'
import React, { useRef } from 'react'
import { ShopifyProductNodeFrontPage } from '../types/frontPageAPI'
import styles from '../styles/components/ProductCard.module.css'
import Typography from '@mui/material/Typography'
import { Utils } from '../utils/Utils'
import { Colors } from '../utils/Colors'
import Link from 'next/link'
import { useHover } from 'usehooks-ts'

type Props = {
    product: Partial<ShopifyProductNodeFrontPage>
}

export const ProductCard = ({ product }: Props) => {
    const imgUrl = !!product.images?.nodes ? product.images?.nodes[0].url || undefined : undefined
    const minAmount = product.priceRange?.minVariantPrice?.amount || undefined
    const maxAmount = product.priceRange?.maxVariantPrice?.amount || undefined
    const cardRef = useRef<HTMLDivElement>()
    const isHovering = useHover(cardRef as React.MutableRefObject<HTMLDivElement>)
    return (
        <div style={{ marginBottom: 10 }} className={styles.card} ref={cardRef as React.MutableRefObject<HTMLDivElement>}>
            <Link href={`products/${product.handle}`}>
                <Image
                    src={imgUrl || ''}
                    alt={'image of product'}
                    width={130}
                    height={130}
                    style={{
                        borderRadius: 10,
                    }}
                    className={styles.cardImg}
                />

                <div style={{ marginTop: 5 }}>
                    <Typography
                        variant="h6"
                        style={{
                            fontWeight: 'bold',
                            transition: '100ms',
                            color: isHovering ? Colors.mid : Colors.dark,
                            textDecoration: isHovering ? 'underline' : undefined,
                        }}
                    >
                        {product.title || 'Unknown Product'}
                    </Typography>
                </div>
                <div>
                    <Typography variant="subtitle1" color="primary" sx={{ color: Colors.mid }}>
                        {Utils.displayPriceRange(minAmount, maxAmount)}
                    </Typography>
                </div>
            </Link>
        </div>
    )
}
