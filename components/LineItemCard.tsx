import { Typography } from '@mui/material'
import React, { useRef, useState, useContext } from 'react'
import { ShopifyAddress, ShopifyCartLine, ShopifyLineItem, ShopifyOrder } from '../utils/API'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/OrderCard.module.css'
import { Utils } from '../utils/Utils'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { Constants } from '../utils/Constants'
import Image from 'next/image'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { QuantityButton } from './QuantityButton'
import { useCart } from '../hooks/useCart'
import { CartContext } from '../contexts/CartContext'
import { useMountlessEffect } from '../hooks/useMountlessEffect'
import { CircularProgress } from '@mui/material'

type Props = {
    item?: ShopifyCartLine
    width?: number
}

const BOTTOM_MARGIN = 15

export const LineItemCard = ({ item, width }: Props) => {
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
                rowGap: 5,
                position: 'relative',
                backgroundColor: 'white',
                paddingTop: 10,
                paddingBottom: 10,
                marginBottom: BOTTOM_MARGIN,
                gridTemplateColumns: '1fr 1fr',
            }}
        >
            <div>
                <Link href={`/products/${item?.merchandise?.product?.handle}`}>
                    <Typography variant="h3" fontSize={'1.3em'} color="primary" className={styles.link}>
                        {item?.merchandise?.product?.title}
                    </Typography>
                </Link>
                <Typography variant="subtitle1" fontSize={'1em'} color="primary" style={{ color: Colors.mid }}>
                    {item?.merchandise?.title}
                </Typography>
                <Typography variant="subtitle1" fontSize={'1em'} color="primary" style={{ color: Colors.mid }}>
                    {Utils.displayPrice(item?.cost?.totalAmount?.amount)}
                </Typography>
            </div>
            <Image
                src={item?.merchandise?.product?.featuredImage?.url || ''}
                width={80}
                height={80}
                alt="Product Image"
                style={{ borderRadius: 10 }}
            />
            <div style={{ display: 'flex' }}>
                <QuantityButton
                    value={quantity}
                    onChange={(q) => {
                        setQuantity((prev) => prev + q)
                        setMutateQuantity(true)
                    }}
                    disabled={imBeingDeleted}
                    max={item?.merchandise?.quantityAvailable || undefined}
                />
                <div style={{ width: 30, height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {imBeingDeleted ? (
                        <CircularProgress size={20} />
                    ) : (
                        <IconButton onClick={() => Cart.remove({ params: { id: item?.id as string } })} disabled={!item?.id}>
                            <DeleteForeverIcon />
                        </IconButton>
                    )}
                </div>
            </div>
        </div>
    )
}
