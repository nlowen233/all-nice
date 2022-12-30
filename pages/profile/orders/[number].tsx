import React, { useState, useContext, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { APIRes, LoadState } from '../../../types/misc'
import { API, GetOrderRes, ShopifyOrderDetail } from '../../../utils/API'
import { AuthContext } from '../../../contexts/AuthContext'
import { LoadingOverlayContext } from '../../../contexts/LoadingOverlayContext'
import { MessageBannerContext } from '../../../contexts/MessageBannerContext'
import { Constants } from '../../../utils/Constants'
import { Colors } from '../../../utils/Colors'
import { Typography } from '@mui/material'
import Link from 'next/link'
import styles from '../../../styles/components/OrderCard.module.css'
import dayjs from 'dayjs'
import { Utils } from '../../../utils/Utils'
import { CardList } from '../../../components/CardList'
import { AddressCard } from '../../../components/AddressCard'

export default function Order() {
    const router = useRouter()
    const { token, checkedLocalStorage } = useContext(AuthContext)
    const { toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const [order, setOrder] = useState<undefined | ShopifyOrderDetail>(undefined)
    const [loadState, setLoadState] = useState<LoadState>('init')

    const getOrder = async () => {
        if (!token) { return }
        toggle(true)
        setLoadState('loading')
        const res = await API.getOrder({ customerAccessToken: token, orderID: router.query.number as string })
        if (!res) {
            setLoadState('failure')
            pushBannerMessage({
                title: 'Could not get order info',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error }
            })
        } else {
            setOrder(res)
            setLoadState('success')
        }
        toggle(false)
    }

    useEffect(() => {
        if (!checkedLocalStorage) {
            return
        }
        if (!token) {
            router.push('/profile/login')
        } else {
            getOrder()
        }
    }, [checkedLocalStorage, token])
    
    return (
        <>
            <Head>
                <title>All Nice Clothing</title>
                <meta name="description" content="Home page for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{ paddingLeft: 5,paddingRight:5, paddingTop: 10 }}>
                <Typography variant="h2" color="primary" fontSize={'1.6em'} fontWeight="bold" style={{ paddingTop: 10, paddingBottom: 10 }}>
                    Order #{order?.orderNumber || ''}
                </Typography>
                <Typography variant="h2" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                    Placed on {order?.processedAt ? dayjs(order.processedAt).format(Constants.dateTimeFmt) : ''}
                </Typography>
                <CardList
                    cards={(order?.lineItems?.nodes || []).map(item =>
                        <div key={item.variant?.sku} style={{ width: '96%', borderTop: `1px solid ${Colors.lightest}`, display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 5, paddingBottom: 5 }}>
                            <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                                Product
                            </Typography>
                            <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                                {item.title}
                            </Typography>
                            <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                                SKU
                            </Typography>
                            <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                                {item.variant?.sku}
                            </Typography>
                            <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                                Price
                            </Typography>
                            <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                                {Utils.displayPrice(item.variant?.price?.amount)}
                            </Typography>
                            <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                                Quantity
                            </Typography>
                            <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                                {item.quantity}
                            </Typography>
                            <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                                Total
                            </Typography>
                            <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                                {Utils.displayPrice(item.discountedTotalPrice?.amount)}
                            </Typography>
                        </div>
                    )}
                    pageLimit={6}
                    loadState={loadState}
                />
                <div style={{ width: '96%', borderTop: `1px solid ${Colors.lightest}`, display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 5, paddingBottom: 5 }}>
                    <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                        Subtotal
                    </Typography>
                    <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                        {Utils.displayPrice(order?.subtotalPrice?.amount)}
                    </Typography>
                    <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                        Shipping
                    </Typography>
                    <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                        {Utils.displayPrice(order?.totalShippingPrice?.amount)}
                    </Typography>
                    <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.light }}>
                        Tax
                    </Typography>
                    <Typography variant="h5" color="primary" fontSize={'1em'} style={{ justifySelf: 'right' }}>
                        {Utils.displayPrice(order?.totalTax?.amount)}
                    </Typography>
                </div>
                <div style={{ width: '96%', display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 25, paddingBottom: 5 }}>
                    <Typography variant="h3" color="primary" fontSize={'1.2em'} fontWeight='bold' style={{ color: Colors.light }}>
                        Total
                    </Typography>
                    <Typography variant="h3" color="primary" fontSize={'1.2em'} fontWeight='bold' style={{ justifySelf: 'right' }}>
                        {Utils.displayPrice(order?.totalPrice?.amount)}
                    </Typography>
                </div>
                <Typography variant="h2" color="primary" fontSize={'1.2em'} fontWeight="bold" style={{ paddingTop: 10, paddingBottom: 10,marginTop:10 }}>
                    Shipping Address
                </Typography>
                <AddressCard
                    address={order?.shippingAddress}
                />
                <div style={{display:'flex'}}>
                    <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.mid }}>
                        Payment Status: 
                    </Typography>
                    <Typography variant="h4" color="primary" fontSize={'1em'} fontWeight={'bold'} style={{paddingLeft:5}}>
                        {order?.financialStatus}
                    </Typography>
                </div>
                <div style={{display:'flex'}}>
                    <Typography variant="h4" color="primary" fontSize={'1em'} style={{ color: Colors.mid }}>
                        Fufillment Status:
                    </Typography>
                    <Typography variant="h4" color="primary" fontSize={'1em'} fontWeight={'bold'} style={{paddingLeft:5}}>
                    {order?.fufillmentStatus}
                    </Typography>
                </div>
                <div style={{marginTop:10}}/>
                <Link href={'/profile'}>
                    <Typography variant="h5" color="primary" fontSize={'1em'} style={{ color: Colors.light}} className={styles.link}>
                        Return to account
                    </Typography>
                </Link>
            </div>
        </>
    )
}
