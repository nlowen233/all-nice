import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/pages/Home.module.css'
import { GetStaticProps } from 'next'
import { APIRes } from '../types/misc'
import { API, GetFrontPageRes } from '../utils/API'
import Typography from '@mui/material/Typography'
import { ProductCard } from '../components/ProductCard'

export default function Checkout() {
    return (
        <>
            <Head>
                <title>Checkout - All Nice Clothing</title>
                <meta name="description" content={`Ready for checkout? Purchase your All Nice Clothing here`}/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                Checkout
            </div>
        </>
    )
}
