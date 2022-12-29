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
}

export const OrderCard = ({ order }: Props) => {
    return (
        <Link href={`/profile/orders/${order.orderNumber}`}>
            <div
                style={{
                    borderRadius: 10,
                    width: 300,
                    border: `1px solid ${Colors.light}`,
                    padding: 10,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    rowGap: 10,
                    marginBottom:15
                }}
                className={styles.card}
            >
                <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                    Order
                </Typography>
                <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark }}>
                    #{order.orderNumber}
                </Typography>
                <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                    Date:
                </Typography>
                <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark }}>
                    {!!order.processedAt ? dayjs(order.processedAt).format(Constants.dateFmt) : ''}
                </Typography>
                <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                    Total
                </Typography>
                <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark }}>
                    {!!order.totalPrice?.amount ? Utils.displayPrice(order.totalPrice.amount) : ''}
                </Typography>
                <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.light }}>
                    Fulfillment Status
                </Typography>
                <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.dark }}>
                    {order.fufillmentStatus || 'Unknown'}
                </Typography>
            </div>
        </Link>
    )
}
