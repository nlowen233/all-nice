import Typography from '@mui/material/Typography'
import React, { useContext, useState } from 'react'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/OrderCard.module.css'
import { Utils } from '../utils/Utils'
import { CartContext } from '../contexts/CartContext'
import { CheckoutLineItem } from './CheckoutLineItem'
import { Constants } from '../utils/Constants'

export const CheckoutOrderSummary = () => {
    const { cart } = useContext(CartContext)
    const [orderHistoryOpen, setOrderHistoryOpen] = useState(false)
    const lines = cart?.lines?.nodes || []
    return (
        <>
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 10, alignItems: 'center' }}>
                <Typography
                    variant="h2"
                    color="primary"
                    fontSize={'.8em'}
                    style={{ color: Colors.light }}
                    className={styles.link}
                    onClick={() => setOrderHistoryOpen((b) => !b)}
                >
                    {orderHistoryOpen ? 'Hide' : 'Show'} Order Summary
                </Typography>
                <div style={{ justifySelf: 'right' }}>
                    <Typography variant="h2" color="primary" fontSize={'1.2em'} fontWeight={'bold'} style={{ color: Colors.dark }}>
                        Total: {Utils.displayPrice(cart?.cost?.totalAmount?.amount)}
                    </Typography>
                </div>
            </div>
            <div
                style={{
                    height: orderHistoryOpen ? Constants.checkoutLineItemHeight * lines.length : 0,
                    overflowY: 'hidden',
                    transition: '300ms',
                }}
            >
                {lines.map((line) => (
                    <CheckoutLineItem item={line} key={line.id} />
                ))}
            </div>
        </>
    )
}
