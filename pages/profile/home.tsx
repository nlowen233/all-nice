import React, { useContext, useEffect } from 'react'
import Head from 'next/head'
import { AuthContext } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'

export default function ProfileHome() {
    const { token } = useContext(AuthContext)
    const router = useRouter()
    useEffect(() => {
        if (!token) {
            router.push('/profile/login')
        }
    }, [])
    return (
        <>
            <Head>
                <title>All Nice User</title>
                <meta name="description" content="Home page for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <p>Profile</p>
        </>
    )
}
