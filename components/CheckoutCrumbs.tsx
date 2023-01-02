import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/OrderCard.module.css'

type Props = {
    pathName: string
}

export const CheckoutCrumbs = ({ pathName }: Props) => {
    const forInfo = getStyle(pathName, '/checkout')
    const forShipping = getStyle(pathName, '/checkout/shipping')
    const forPayment = getStyle(pathName, '/checkout/payment')
    return (
        <div role="presentation" style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link href={'/checkout'} style={{ pointerEvents: forInfo.disableLink ? 'none' : undefined }}>
                    <Typography variant="h2" color="primary" fontSize={'1em'} {...forInfo}>
                        Info
                    </Typography>
                </Link>
                <Link href={'/checkout/shipping'} style={{ pointerEvents: forShipping.disableLink ? 'none' : undefined }}>
                    <Typography variant="h2" color="primary" fontSize={'1em'} {...forShipping}>
                        Shipping
                    </Typography>
                </Link>
                <Link href={'/checkout/payment'} style={{ pointerEvents: forPayment.disableLink ? 'none' : undefined }}>
                    <Typography variant="h2" color="primary" fontSize={'1em'} {...forPayment}>
                        Payment
                    </Typography>
                </Link>
            </Breadcrumbs>
        </div>
    )
}

type CheckoutPath = '/checkout' | '/checkout/shipping' | '/checkout/payment'

type GetStyleRes = {
    style: React.CSSProperties
    className: string | undefined
    disableLink?: boolean
}
const activeRes: GetStyleRes = {
    className: styles.link,
    style: {
        color: Colors.dark,
    },
}
const prevRes: GetStyleRes = {
    className: styles.link,
    style: {
        color: Colors.light,
    },
}
const nextRes: GetStyleRes = {
    className: undefined,
    style: {
        color: Colors.disabled,
        cursor: 'default',
        pointerEvents: 'none',
    },
    disableLink: true,
}
const getStyle = (cur: string, path: CheckoutPath): GetStyleRes => {
    const pivot = getSeq(cur as CheckoutPath) - getSeq(path)
    if (pivot === 0) {
        return activeRes
    } else if (pivot < 1) {
        return nextRes
    } else {
        return prevRes
    }
}

const getSeq = (path: CheckoutPath) => {
    switch (path) {
        case '/checkout':
            return 1
        case '/checkout/shipping':
            return 2
        case '/checkout/payment':
            return 3
        default:
            return 1
    }
}
