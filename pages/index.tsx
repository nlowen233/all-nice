import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/pages/Home.module.css'
import Button from '@mui/material/Button'
import { MenuBar } from '../components/MenuBar'
import { GetStaticProps } from 'next'
import { useEffect } from 'react'
import { Constants } from '../utils/Constants'
import { APIRes } from '../types/misc'
import { API, GetFrontPageRes } from '../utils/API'
import Typography from '@mui/material/Typography'
import { ProductCard } from '../components/ProductCard'

const inter = Inter({ subsets: ['latin'] })

type Props = {
    res: APIRes<GetFrontPageRes>
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
    const res = await API.getFrontPage()
    return {
        props: {
            res,
        },
    }
}

export default function Home({ res }: Props) {
    const products = res.res?.data?.collection?.products?.nodes
    const errorGettingProducts = res.err || !products
    return (
        <>
            <Head>
                <title>All Nice Clothing</title>
                <meta name="description" content="Home page for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main} style={{ paddingTop: 10 }}>
                {errorGettingProducts ? (
                    <>
                        <Typography color="error" variant="h5" sx={{ paddingTop: 5 }}>
                            Sorry, we couldn't not load products...
                        </Typography>
                        <Typography color="error" variant="subtitle1">
                            Either you f**d up or we did
                        </Typography>
                    </>
                ) : (
                    products.map((product) => <ProductCard product={product} key={product.id} />)
                )}
            </div>
        </>
    )
}
