import React, { useContext,useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import { CardList } from '../components/CardList'
import { OrderCard } from '../components/OrderCard'
import { Constants } from '../utils/Constants'
import { CartContext } from '../contexts/CartContext'
import { Colors } from '../utils/Colors'
import Link from 'next/link'
import styles from '../styles/components/OrderCard.module.css'
import { LineItemCard } from '../components/LineItemCard'
import Button from '@mui/material/Button'
import { Utils } from '../utils/Utils'

export default function Cart() {
    const { cart,Cart } = useContext(CartContext)
    const items = cart?.lines?.nodes || []
    useEffect(()=>{
        Cart.get()
    },[])
    return (
        <>
            <Head>
                <title>Your Cart - All Nice Clothing</title>
                <meta name="description" content={`Here's your cart full of items from All Nice Clothing`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: Constants.screenWidthsm }}>
                    <Typography variant="h2" color="primary" fontSize={'1.6em'} fontWeight="bold">
                        Your cart
                    </Typography>
                    <Link href={'/'}>
                        <Typography variant="h2" color="primary" fontSize={'1em'} style={{ color: Colors.light,paddingBottom:5 }} className={styles.link}>
                            Continue shopping
                        </Typography>
                    </Link>
                    <div style={{width:'100%',minHeight:500}}>
                    <CardList
                        cards={items.map((line) => (
                            <LineItemCard item={line} key={line.id} />
                        ))}
                        loadState={'success'}
                        pageLimit={4}
                    />
                    </div>
                    <div style={{width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',paddingBottom:5,paddingTop:10}}>
                <Typography variant="h4" color="primary" fontSize={'1.4em'} style={{ color: Colors.light }}>
                    Subtotal
                </Typography>
                <Typography variant="h4" color="primary" fontSize={'1.4em'} style={{ justifySelf: 'right' }}>
                    {Utils.displayPrice(cart?.cost?.subtotalAmount?.amount)}
                </Typography>
                </div>
                <Typography variant="h2" color="primary" fontSize={'1em'} style={{ color: Colors.light,paddingBottom:10 }}>
                    Taxes and shipping calculated at checkout
                </Typography>
                <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                    <Link href={'/checkout'}>
                    <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: Constants.stdButtonSize,marginBottom:5 }}
                >
                    Checkout
                </Button>
                    </Link>
               
                </div>
                
                </div>
            </div>
        </>
    )
}
