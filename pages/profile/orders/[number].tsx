import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Order() {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>All Nice Clothing</title>
                <meta name="description" content="Home page for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <p>Order</p>
        </>
    )
}
