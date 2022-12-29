import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthContext, AuthContextVars } from '../../contexts/AuthContext'
import { useMountlessEffect } from '../../hooks/useMountlessEffect'
import { API, GetProfileRes } from '../../utils/API'
import { LoadingOverlayContext } from '../../contexts/LoadingOverlayContext'
import { MessageBannerContext } from '../../contexts/MessageBannerContext'
import { Constants } from '../../utils/Constants'
import { Colors } from '../../utils/Colors'
import Typography from '@mui/material/Typography'
import { OrderCard } from '../../components/OrderCard'
import { LoadState } from '../../types/misc'
import { LoaderWrapper } from '../../components/LoaderWrapper'
import { Utils } from '../../utils/Utils'
import Link from 'next/link'
import styles from '../../styles/pages/Profile.module.css'
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton'

export default function You() {
    const { token, checkedLocalStorage,setAuth } = useContext(AuthContext)
    const { toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const [profile, setProfile] = useState<GetProfileRes>({})
    const router = useRouter()
    const [passedAuth, setPassedAuth] = useState<undefined | boolean>(undefined)
    const [loadState, setLoadState] = useState<LoadState>('init')
    const orders = profile.data?.customer?.orders?.nodes || []
    const address = profile.data?.customer?.defaultAddress
    const logOut = () => {
        setAuth(a=>({...a,expiresAt:undefined,token:undefined}))
        Utils.clearToken()
        router.push('/')
    }
    useEffect(() => {
        if (!checkedLocalStorage) {
            return
        }
        if (!token) {
            router.push('/profile/login')
        } else {
            setPassedAuth(true)
        }
    }, [checkedLocalStorage])

    useMountlessEffect(() => {
        if (passedAuth) {
            setLoadState('loading')
            toggle(true)
            API.getProfile({ customerAccessToken: token as string }).then((res) => {
                const shopifyErrors = res.res?.errors || []
                if (res.err || !!shopifyErrors?.length) {
                    pushBannerMessage({
                        title: res.message || shopifyErrors[0].message || 'Unknown error occured while loading profile data',
                        autoClose: Constants.stdAutoCloseInterval,
                        styling: { backgroundColor: Colors.error },
                    })
                    setLoadState('failure')
                } else {
                    setProfile(res.res || {})
                    setLoadState('success')
                }
                toggle(false)
            })
        }
    }, [passedAuth])

    return (
        <>
            <Head>
                <title>All Nice User</title>
                <meta name="description" content="Home page for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 320, paddingTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: 10, flexDirection: 'column' }}>
                        <Typography variant="h2" fontSize={'1.8em'} style={{ color: Colors.dark, fontWeight: 'bold' }}>
                            Account
                        </Typography>
                    </div>
                    <Typography
                        variant="h4"
                        fontSize={'1.2em'}
                        style={{ color: Colors.dark, fontWeight: 'bold', paddingTop: 5, paddingBottom: 5 }}
                    >
                        Orders
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', minHeight: 200 }}>
                        <LoaderWrapper loadState={loadState}>
                            {!!orders.length ? orders.map((order) => (
                                <OrderCard order={order} key={order.orderNumber} />
                            ))
                                :
                                <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.dark, fontWeight: 'bold' }}>
                                    You haven't ordered anything :{`(`}
                                </Typography>
                            }
                        </LoaderWrapper>
                    </div>
                    <div style={{display:'flex',alignItems:'center'}}>
                        <Typography
                            variant="h4"
                            fontSize={'1.2em'}
                            style={{ color: Colors.dark, fontWeight: 'bold', paddingTop: 5, paddingBottom: 5,paddingRight:5 }}
                        >
                            Account Details
                        </Typography>
                        <Link href={'/profile/details'}>
                        <IconButton>
                            <EditIcon/>
                        </IconButton>
                        </Link>
                    </div>
                    <div style={{ paddingLeft: 10 }}>
                        <Typography
                            variant="subtitle1"
                            fontSize={'1em'}
                            style={{ color: Colors.light }}
                        >
                            {profile.data?.customer?.firstName} {profile.data?.customer?.lastName}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            fontSize={'1em'}
                            style={{ color: Colors.light }}
                        >
                            {address?.address1}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            fontSize={'1em'}
                            style={{ color: Colors.light }}
                        >
                            {Utils.displayAddress({ city: address?.city, stateCode: address?.provinceCode, zip: address?.zip })}
                        </Typography>
                    </div>
                    <div style={{paddingTop:20}}/>
                    <Link href={'/profile/address'} className={styles.link}>
                            <Typography
                                variant="subtitle1"
                                fontSize={'1em'}
                                style={{ color: Colors.mid,textDecorationColor:Colors.mid }}
                            >
                                View all addresses
                            </Typography>
                        </Link>
                        <Typography
                            variant="subtitle1"
                            fontSize={'1em'}
                            style={{ color: Colors.mid,textDecorationColor:Colors.mid }}
                            className={styles.link}
                            onClick={logOut}
                        >
                            Log out
                        </Typography>
                </div>
            </div>
        </>
    )
}
