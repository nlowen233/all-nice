import { Typography } from '@mui/material'
import React, { useRef, useState, useContext } from 'react'
import { ShopifyAddress, ShopifyCartLine, ShopifyLineItem, ShopifyOrder } from '../utils/API'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/OrderCard.module.css'
import { Utils } from '../utils/Utils'
import Link from 'next/link'
import Image from 'next/image'
import { CartContext } from '../contexts/CartContext'
import { useMountlessEffect } from '../hooks/useMountlessEffect'
import { CircularProgress } from '@mui/material'
import Badge from '@mui/material/Badge'

type Props = {
    item?: ShopifyCartLine
    width?: number
}

const BOTTOM_MARGIN = 5

export const CheckoutLineItem = ({ item, width }: Props) => {
    const { Cart, cartDeletionID } = useContext(CartContext)
    const [quantity, setQuantity] = useState(item?.quantity || 0)
    const [mutateQuantity, setMutateQuantity] = useState(false)
    const imBeingDeleted = !!cartDeletionID && cartDeletionID === item?.id
    useMountlessEffect(() => {
        const id = item?.id
        if (!id || !mutateQuantity) {
            return
        }
        Cart.update({ params: { lineID: id, quantity }, silent: true })
        setMutateQuantity(false)
    }, [mutateQuantity])
    return (
        <div
            style={{
                width: width || '100%',
                borderTop: `1px solid ${Colors.lightest}`,
                display: 'grid',
                position: 'relative',
                backgroundColor: 'white',
                paddingTop: 5,
                paddingBottom: 5,
                marginBottom: BOTTOM_MARGIN,
                gridTemplateColumns: '1fr 1fr',
            }}
        >
            <div style={{ width: 50, height: 50, paddingTop: 10 }}>
                <Badge badgeContent={item?.quantity || 0} color="primary">
                    <Image
                        src={item?.merchandise?.product?.featuredImage?.url || ''}
                        width={50}
                        height={50}
                        alt="Product Image"
                        style={{ borderRadius: 10 }}
                    />
                </Badge>
            </div>

            <div>
                <Link href={`/products/${item?.merchandise?.product?.handle}`}>
                    <Typography variant="h3" fontSize={'1em'} color="primary" className={styles.link}>
                        {item?.merchandise?.product?.title}
                    </Typography>
                </Link>
                <Typography variant="subtitle1" fontSize={'.8em'} color="primary" style={{ color: Colors.mid }}>
                    {item?.merchandise?.title}
                </Typography>
                <Typography variant="subtitle1" fontSize={'.8em'} color="primary" style={{ color: Colors.mid }}>
                    {Utils.displayPrice(item?.cost?.totalAmount?.amount)}
                </Typography>
            </div>
        </div>
    )
}
