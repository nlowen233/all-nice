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
import { LoadState } from '../../types/misc'
import { Utils } from '../../utils/Utils'
import Link from 'next/link'
import styles from '../../styles/pages/Profile.module.css'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import { AddressCard } from '../../components/AddressCard'
import AddIcon from '@mui/icons-material/Add'
import { AddressPopup } from '../../components/AddressPopup'
import { deepEqual } from 'assert'
import { LoaderWrapper } from '../../components/LoaderWrapper'
import { CardList } from '../../components/CardList'

export default function You() {
    const { token, checkedLocalStorage, setAuth } = useContext(AuthContext)
    const { toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const [profile, setProfile] = useState<GetProfileRes>({})
    const [editingAddressID, setEditingAddressID] = useState<undefined | string>(undefined)
    const [addressPopUp, setAddressPopUp] = useState(false)
    const [triggerRefresh, setTriggerRefresh] = useState(false)
    const router = useRouter()
    const [passedAuth, setPassedAuth] = useState<undefined | boolean>(undefined)
    const [loadState, setLoadState] = useState<LoadState>('init')
    const customer = profile.data?.customer
    const orders = customer?.orders?.nodes || []
    const addresses = customer?.addresses?.nodes || []
    const defaultAddressID = customer?.defaultAddress?.id
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
    const logOut = () => {
        setAuth((a) => ({ ...a, expiresAt: undefined, token: undefined }))
        Utils.clearToken()
        router.push('/')
    }
    const deleteAddress = async (addressID: string) => {
        toggle(true)
        const res = await API.deleteAddress({ addressID, customerAccessToken: token as string })
        if (res.res?.data?.customerAddressDelete?.deletedCustomerAddressId) {
            pushBannerMessage({
                title: 'Successfully deleted address',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.success },
            })
            setAddressPopUp(false)
            setTriggerRefresh(true)
        } else {
            pushBannerMessage({
                title: 'Error deleting address',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error },
            })
        }
        toggle(false)
    }
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
            setTriggerRefresh(true)
        }
    }
    const updateAddress = async ({
        address1,
        address2,
        city,
        company,
        firstName,
        id,
        lastName,
        markDefault,
        phone,
        province,
        zip,
    }: UpdateCreateAddressReq) => {
        if (!id) {
            return
        }
        toggle(true)
        const res = await API.updateAddress({
            addressID: id,
            customerAccessToken: token as string,
            address: {
                address1,
                address2,
                city,
                company,
                firstName,
                lastName,
                phone,
                province,
                zip,
            },
        })
        if (res.res?.data?.customerAddressUpdate?.customerUserErrors?.length || res.err || res.res?.errors?.length) {
            pushBannerMessage({
                title: 'Error updating address, please retry',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error },
            })
        } else {
            pushBannerMessage({
                title: 'Successfully updated address',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.success },
            })
            setAddressPopUp(false)
            if (markDefault && id !== defaultAddressID) {
                markAddressAsDefault(id)
            } else {
                setTriggerRefresh(true)
            }
        }
        toggle(false)
    }
    const createAddress = async ({
        address1,
        address2,
        city,
        company,
        firstName,
        id,
        lastName,
        markDefault,
        phone,
        province,
        zip,
    }: UpdateCreateAddressReq) => {
        toggle(true)
        const res = await API.createAddress({
            customerAccessToken: token as string,
            address: {
                address1,
                address2,
                city,
                company,
                firstName,
                lastName,
                phone,
                province,
                zip,
            },
        })
        const newID = res.res?.data?.customerAddressCreate?.customerAddress?.id
        if (newID) {
            pushBannerMessage({
                title: 'Successfully created address',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.success },
            })
            setAddressPopUp(false)
            if (markDefault && id !== defaultAddressID) {
                markAddressAsDefault(newID)
            } else {
                setTriggerRefresh(true)
            }
        } else {
            pushBannerMessage({
                title: 'Error creating address, please retry',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error },
            })
        }
        toggle(false)
    }
    const getProfile = (noOverlay?: boolean) => {
        setLoadState('loading')
        !noOverlay && toggle(true)
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
            !noOverlay && toggle(false)
        })
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
            getProfile()
        }
    }, [passedAuth])

    useMountlessEffect(() => {
        if (!triggerRefresh) {
            return
        } else {
            getProfile(true)
            setTriggerRefresh(false)
        }
    }, [triggerRefresh])

    return (
        <>
            <Head>
                <title>Profile - All Nice</title>
                <meta name="description" content="Home page for All Nice Clothing" />
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
                        loadState={loadState}
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
                            {profile.data?.customer?.firstName} {profile.data?.customer?.lastName}
                        </Typography>
                        <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                            {profile.data?.customer?.email}
                        </Typography>
                        <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light }}>
                            {profile.data?.customer?.phone}
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
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', minHeight: 200 }}>
                        <LoaderWrapper loadState={loadState} items={addresses}>
                            {!!orders.length ? (
                                sortedAddresses.map((add) => (
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
                                ))
                            ) : (
                                <Typography variant="h5" fontSize={'1em'} style={{ color: Colors.dark, fontWeight: 'bold' }}>
                                    You don't have any known addresses
                                </Typography>
                            )}
                        </LoaderWrapper>
                    </div>

                    <Typography
                        variant="subtitle1"
                        fontSize={'1em'}
                        style={{ color: Colors.mid, textDecorationColor: Colors.mid }}
                        className={styles.link}
                        onClick={logOut}
                    >
                        Log out
                    </Typography>
                </div>
            </div>
            <AddressPopup
                editingAddress={editingAddress}
                isDefaultAddress={defaultAddressID === editingAddressID}
                close={() => setAddressPopUp(false)}
                onDeleteAddress={deleteAddress}
                onUpdateAddress={editingAddressID ? updateAddress : createAddress}
                on={addressPopUp}
            />
        </>
    )
}
