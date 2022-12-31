import { Typography } from '@mui/material'
import React from 'react'
import { ShopifyOrder } from '../utils/API'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/OrderCard.module.css'
import dayjs from 'dayjs'
import { Constants } from '../utils/Constants'
import { Utils } from '../utils/Utils'
import Link from 'next/link'

type Props = {
    order: ShopifyOrder
    width?: number
}

export const OrderCard = ({ order, width }: Props) => {
    return (
        <div
            style={{
                width: width || '100%',
                borderTop: `1px solid ${Colors.lightest}`,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                rowGap: 5,
            }}
        >
            <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                Order
            </Typography>
            <Link href={`/profile/orders/${Utils.getIDFromShopifyGid(order.id)}`} className={styles.link} style={{ justifySelf: 'right' }}>
                <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark }}>
                    #{order.orderNumber}
                </Typography>
            </Link>
            <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                Date:
            </Typography>
            <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark, justifySelf: 'right' }}>
                {!!order.processedAt ? dayjs(order.processedAt).format(Constants.dateFmt) : ''}
            </Typography>
            <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                Total
            </Typography>
            <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark, justifySelf: 'right' }}>
                {!!order.totalPrice?.amount ? Utils.displayPrice(order.totalPrice.amount) : ''}
            </Typography>
            <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                Fulfillment Status
            </Typography>
            <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark, justifySelf: 'right' }}>
                {order.fufillmentStatus || 'Unknown'}
            </Typography>
        </div>
    )
}
