import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthContext, AuthContextVars } from '../../contexts/AuthContext'
import { useMountlessEffect } from '../../hooks/useMountlessEffect'
import { API, GetProfileRes, UpdateCreateAddressReq } from '../../utils/API'
import { LoadingOverlayContext } from '../../contexts/LoadingOverlayContext'
import { MessageBannerContext } from '../../contexts/MessageBannerContext'
import { Constants } from '../../utils/Constants'
import { Colors } from '../../utils/Colors'
import Typography from '@mui/material/Typography'
import { OrderCard } from '../../components/OrderCard'
import Link from 'next/link'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import { AddressCard } from '../../components/AddressCard'
import AddIcon from '@mui/icons-material/Add'
import { AddressPopup } from '../../components/AddressPopup'
import { CardList } from '../../components/CardList'
import { ProfileContext } from '../../contexts/ProfileContext'

export default function You() {
    const { refresh, profile, profileLoading } = useContext(ProfileContext)
    const { token, checkedLocalStorage, setAuth } = useContext(AuthContext)
    const { toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const [editingAddressID, setEditingAddressID] = useState<undefined | string>(undefined)
    const [addressPopUp, setAddressPopUp] = useState(false)
    const router = useRouter()
    const [passedAuth, setPassedAuth] = useState<undefined | boolean>(undefined)
    const orders = profile?.orders?.nodes || []
    const addresses = profile?.addresses?.nodes || []
    const defaultAddressID = profile?.defaultAddress?.id
    const editingAddress = addresses.find((add) => add.id === editingAddressID)
    const sortedAddresses = [...addresses].sort((a, b) => {
        if (a.id === defaultAddressID) {
            return -1
        }
        if (b.id === defaultAddressID) {
            return 1
        }
        return 0
    })

    const markAddressAsDefault = async (addressID: string) => {
        const res = await API.changeDefaultAddress({ addressID, customerAccessToken: token as string })
        if (res.err || res.res?.errors?.length || res.res?.data?.customerDefaultAddressUpdate?.customerUserErrors?.length) {
            pushBannerMessage({
                title: 'Error marking address as default, please retry',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error },
            })
        } else {
            pushBannerMessage({
                title: 'Successfully changed your default address',
                autoClose: Constants.shortAutoCloseInterval,
                styling: { backgroundColor: Colors.success },
            })
            refresh()
        }
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
            refresh()
        }
    }, [passedAuth])

    return (
        <>
            <Head>
                <title>Profile - All Nice Clothing</title>
                <meta name="description" content="Check your shipping address, order history, and more for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    pointerEvents: addressPopUp ? 'none' : undefined,
                    flexDirection: 'column',
                }}
            >
                <div style={{ width: Constants.screenWidthsm }}>
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
                    <CardList
                        cards={orders.map((order) => (
                            <OrderCard order={order} key={order.orderNumber} />
                        ))}
                        loading={profileLoading}
                        emptyMessage={'You have no orders'}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h4" fontSize={'1.2em'} style={{ color: Colors.dark, fontWeight: 'bold', paddingTop: 5 }}>
                            Account Details
                        </Typography>
                        <Link href={'/profile/details'}>
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                        </Link>
                    </div>
                    <div style={{ paddingLeft: 10 }}>
                        <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                            {profile?.firstName} {profile?.lastName}
                        </Typography>
                        <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                            {profile?.email}
                        </Typography>
                        <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                            {profile?.phone}
                        </Typography>
                    </div>
                    <div style={{ paddingTop: 20 }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h4"
                            fontSize={'1.2em'}
                            style={{ color: Colors.dark, fontWeight: 'bold', paddingTop: 5, paddingBottom: 5 }}
                        >
                            Addresses
                        </Typography>
                        <IconButton
                            onClick={() => {
                                setEditingAddressID(undefined)
                                setAddressPopUp(true)
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                    <CardList
                        cards={sortedAddresses.map((add) => (
                            <AddressCard
                                width={280}
                                address={add}
                                key={add.id}
                                isDefault={add.id === defaultAddressID}
                                onClickEdit={() => {
                                    setEditingAddressID(add.id)
                                    setAddressPopUp(true)
                                }}
                                onToggleDefault={() => add.id && defaultAddressID !== add.id && markAddressAsDefault(add.id)}
                            />
                        ))}
                        loading={profileLoading}
                        emptyMessage="You have no known addresses"
                        pageLimit={4}
                    />
                </div>
            </div>
            <AddressPopup
                editingAddress={editingAddress}
                isDefaultAddress={defaultAddressID === editingAddressID}
                close={(e) => {
                    setAddressPopUp(false)
                    if (e?.shouldRefresh) {
                        refresh()
                    } else if (e?.shouldMakeDefaultAddress&&e.shouldMarkDefaultID) {
                        markAddressAsDefault(e.shouldMarkDefaultID)
                    }
                }}
                on={addressPopUp}
            />
        </>
    )
}
