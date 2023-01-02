import React, { useContext, useState } from 'react'
import Head from 'next/head'
import { Constants } from '../../utils/Constants'
import { CartContext } from '../../contexts/CartContext'
import { CheckoutOrderSummary } from '../../components/CheckoutOrderSummary'
import { CheckoutCrumbs } from '../../components/CheckoutCrumbs'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import { Colors } from '../../utils/Colors'
import { AuthContext } from '../../contexts/AuthContext'
import styles from '../../styles/components/OrderCard.module.css'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import { Button } from '@mui/material'
import { ProfileContext } from '../../contexts/ProfileContext'
import { CardList } from '../../components/CardList'
import { CheckoutAddressCard } from '../../components/CheckoutAddressCard'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import { AddressPopup } from '../../components/AddressPopup'
import { API } from '../../utils/API'
import { MessageBannerContext } from '../../contexts/MessageBannerContext'
import { useMountlessEffect } from '../../hooks/useMountlessEffect'


interface Validations {
    firstName: boolean
    lastName: boolean
    address1: boolean
    address2: boolean
    city: boolean
    stateCode: boolean
    phone: boolean
    zip: boolean
    company: boolean
    email: boolean
}

const INIT_VALIDS = (): Validations => ({
    address1: true,
    address2: true,
    city: true,
    firstName: true,
    lastName: true,
    phone: true,
    stateCode: true,
    zip: true,
    company: true,
    email: true,
})
export default function Checkout() {
    const { token } = useContext(AuthContext)
    const { profile, profileLoading, refresh } = useContext(ProfileContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const router = useRouter()
    const [email, setEmail] = useState(profile?.email || '')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [city, setCity] = useState('')
    const [stateCode, setStateCode] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [company, setCompany] = useState('')
    const [phone, setPhone] = useState('')
    const [zip, setZip] = useState('')
    const [validations, setValidations] = useState(INIT_VALIDS())
    const [selectedAddressID, setSelectedAddressID] = useState<string | undefined>(profile?.defaultAddress?.id)
    const [addressPopUp, setAddressPopUp] = useState(false)
    const addresses = profile?.addresses?.nodes || []
    const sortedAddresses = [...addresses].sort((a, b) => {
        if (a.id === selectedAddressID) {
            return -1
        }
        if (b.id === selectedAddressID) {
            return 1
        }
        return 0
    })
    const requiredAddressFieldsEmpty =
        address1.trim().length < 1 ||
        city.trim().length < 1 ||
        stateCode.trim().length < 1 ||
        lastName.trim().length < 1 ||
        zip.trim().length < 1
    const canProceed = !!email&&addresses.length ? true : !requiredAddressFieldsEmpty
    const proceed = () => {
        router.push('/checkout/shipping')
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
            refresh()
        }
    }
    useMountlessEffect(()=>{
        if(!selectedAddressID&&profile?.defaultAddress){
            setSelectedAddressID(profile.defaultAddress.id)
        }
        if(!email&&profile?.email){
            setEmail(profile.email)
        }
    },[profile])
   
    return (
        <>
            <Head>
                <title>Checkout - All Nice Clothing</title>
                <meta name="description" content={`Ready for checkout? Purchase your All Nice Clothing here`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column',pointerEvents: addressPopUp ? 'none' : undefined }}>
                <div style={{ width: Constants.screenWidthsm }}>
                    <CheckoutOrderSummary />
                    <CheckoutCrumbs pathName={router.pathname} />
                    <Typography
                        variant="h2"
                        color="primary"
                        fontSize={'1em'}
                        fontWeight={'bold'}
                        style={{ color: Colors.dark, paddingTop: 10 }}
                    >
                        Contact Information
                    </Typography>
                    {!token && (
                        <Link href={'/profile/login'}>
                            <Typography
                                variant="h2"
                                color="primary"
                                fontSize={'1em'}
                                style={{ color: Colors.light, paddingBottom: 5 }}
                                className={styles.link}
                            >
                                Have an account? Login
                            </Typography>
                        </Link>
                    )}
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        placeholder="allniceclothing@gmail.com"
                        style={{ marginTop: 10 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        error={!validations.email}
                        onFocus={() => setValidations((vals) => ({ ...vals, email: true }))}
                    />
                    <div style={{ display: 'flex',alignItems:'center',paddingTop:10,paddingBottom:5 }}>
                        <Typography
                            variant="h2"
                            color="primary"
                            fontSize={'1em'}
                            fontWeight={'bold'}
                            style={{ color: Colors.dark,}}
                        >
                            Shipping Address
                        </Typography>
                    </div>

                    {!addresses.length ? (
                        <>
                            <TextField
                                id="outlined-basic"
                                label="First Name"
                                variant="outlined"
                                placeholder="Erin"
                                style={{ marginTop: 10 }}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                autoComplete="given-name"
                                error={!validations.firstName}
                                onFocus={() => setValidations((vals) => ({ ...vals, firstName: true }))}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Last Name"
                                required
                                variant="outlined"
                                placeholder="Jaeger"
                                style={{ marginTop: 10 }}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                autoComplete="family-name"
                                error={!validations.lastName}
                                onFocus={() => setValidations((vals) => ({ ...vals, lastName: true }))}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Address"
                                variant="outlined"
                                placeholder="1 Main St"
                                style={{ marginTop: 10 }}
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                                autoComplete="street-address"
                                error={!validations.address1}
                                onFocus={() => setValidations((vals) => ({ ...vals, address1: true }))}
                                required
                            />
                            <TextField
                                id="outlined-basic"
                                label="Apartment, suite, etc"
                                variant="outlined"
                                placeholder="Apt 300"
                                style={{ marginTop: 10 }}
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                                error={!validations.address2}
                                onFocus={() => setValidations((vals) => ({ ...vals, address2: true }))}
                            />
                            <TextField
                                id="outlined-basic"
                                label="City"
                                variant="outlined"
                                placeholder="Boston"
                                style={{ marginTop: 10 }}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                autoComplete="address-level2"
                                error={!validations.city}
                                onFocus={() => setValidations((vals) => ({ ...vals, city: true }))}
                                required
                            />
                            <TextField
                                id="outlined-basic"
                                label="State"
                                variant="outlined"
                                placeholder="Jaeger"
                                style={{ marginTop: 10 }}
                                value={stateCode}
                                onChange={(e) => setStateCode(e.target.value)}
                                autoComplete="address-level1"
                                error={!validations.stateCode}
                                onFocus={() => setValidations((vals) => ({ ...vals, stateCode: true }))}
                                required
                            />
                            <TextField
                                id="outlined-basic"
                                label="Zip Code/Postal Code"
                                variant="outlined"
                                placeholder="01810"
                                style={{ marginTop: 10 }}
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                autoComplete="postal-code"
                                error={!validations.zip}
                                onFocus={() => setValidations((vals) => ({ ...vals, zip: true }))}
                                required
                            />
                            <TextField
                                id="outlined-basic"
                                label="Company/Organization"
                                variant="outlined"
                                placeholder="All Nice"
                                style={{ marginTop: 10 }}
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                autoComplete="organization"
                                error={!validations.company}
                                onFocus={() => setValidations((vals) => ({ ...vals, company: true }))}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Phone"
                                variant="outlined"
                                placeholder="1-800"
                                style={{ marginTop: 10 }}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                autoComplete="tel"
                                error={!validations.phone}
                                onFocus={() => setValidations((vals) => ({ ...vals, phone: true }))}
                            />
                        </>
                    ) : (
                        <>
                            <CardList
                                cards={sortedAddresses.map((add) => (
                                    <CheckoutAddressCard
                                        address={add}
                                        key={add.id}
                                        onSelect={() => setSelectedAddressID(add.id)}
                                        selectedID={selectedAddressID}
                                    />
                                ))}
                                loading={profileLoading}
                                pageLimit={4}
                            />
                            <Typography
                            variant="h2"
                            color="primary"
                            fontSize={'1em'}
                            style={{ color: Colors.light, paddingBottom: 5 }}
                            className={styles.link}
                            onClick={()=>setAddressPopUp(true)}
                        >
                            Add an address
                        </Typography>
                        </>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: Constants.stdButtonSize, marginBottom: 5, marginTop: 5 }}
                        disabled={!canProceed}
                        onClick={proceed}
                    >
                        Continue to Shipping
                    </Button>
                </div>
            </div>
            <AddressPopup
                close={(e) => {
                    setAddressPopUp(false)
                    if (e?.shouldRefresh) {
                        refresh()
                    } else if (e?.newDefaultID) {
                        markAddressAsDefault(e.newDefaultID)
                    }
                }}
                on={addressPopUp}
            />
        </>
    )
}
