import Head from 'next/head'
import { CardList } from '../components/CardList'
import { OrderCard } from '../components/OrderCard'

export default function Cart() {
    return (
        <>
            <Head>
                <title>All Nice Clothing</title>
                <meta name="description" content="Home page for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CardList
                cards={[
                    <OrderCard
                        order={{
                            orderNumber: 992837,
                            processedAt: '12/10/1999',
                            totalPrice: { amount: '654.0' },
                            fufillmentStatus: 'Hello',
                        }}
                    />,
                    <OrderCard
                        order={{
                            orderNumber: 992837,
                            processedAt: '12/10/1999',
                            totalPrice: { amount: '654.0' },
                            fufillmentStatus: 'Hello',
                        }}
                    />,
                    <OrderCard
                        order={{
                            orderNumber: 992837,
                            processedAt: '12/10/1999',
                            totalPrice: { amount: '654.0' },
                            fufillmentStatus: 'Hello',
                        }}
                    />,
                    <OrderCard
                        order={{
                            orderNumber: 992837,
                            processedAt: '12/10/1999',
                            totalPrice: { amount: '654.0' },
                            fufillmentStatus: 'Hello',
                        }}
                    />,
                    <OrderCard
                        order={{
                            orderNumber: 992837,
                            processedAt: '12/10/1999',
                            totalPrice: { amount: '654.0' },
                            fufillmentStatus: 'Hello',
                        }}
                    />,
                    <OrderCard
                        order={{
                            orderNumber: 992837,
                            processedAt: '12/10/1999',
                            totalPrice: { amount: '654.0' },
                            fufillmentStatus: 'Hello',
                        }}
                    />,
                    <OrderCard
                        order={{
                            orderNumber: 992837,
                            processedAt: '12/10/1999',
                            totalPrice: { amount: '654.0' },
                            fufillmentStatus: 'Hello',
                        }}
                    />,
                ]}
                loadState="success"
                pageLimit={3}
            />
        </>
    )
}
