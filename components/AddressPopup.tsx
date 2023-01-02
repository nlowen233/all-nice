import React, { useState, useRef, useEffect, useContext } from 'react'
import { API, ShopifyAddress, UpdateCreateAddressReq } from '../utils/API'
import styles from '../styles/components/AddressPopUp.module.css'
import { Colors } from '../utils/Colors'
import { Button, Checkbox, Drawer, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material'
import { ZIndex } from '../types/ZIndex'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { useOnClickOutside } from 'usehooks-ts'
import { Poppins } from '@next/font/google'
import { useWindowSize } from '../hooks/useWindowSize'
import { Constants } from '../utils/Constants'
import { ProfileContext } from '../contexts/ProfileContext'
import { AuthContext } from '../contexts/AuthContext'
import { LoadingOverlayContext } from '../contexts/LoadingOverlayContext'
import { MessageBannerContext } from '../contexts/MessageBannerContext'

export interface AddressPopUpCloseEvent {
    shouldRefresh?: boolean
    newCreatedID?: string
    shouldMakeDefaultAddress?: boolean
    shouldMarkDefaultID?: string
}

type Props = {
    editingAddress?: ShopifyAddress
    isDefaultAddress?: boolean
    on?: boolean
    close: (p?: AddressPopUpCloseEvent) => void
}

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
})

export const AddressPopup = ({ editingAddress, isDefaultAddress, close, on }: Props) => {
    const [address1, setAddress1] = useState(editingAddress?.address1)
    const [address2, setAddress2] = useState(editingAddress?.address2)
    const [city, setCity] = useState(editingAddress?.city)
    const [stateCode, setStateCode] = useState(editingAddress?.provinceCode)
    const [firstName, setFirstName] = useState(editingAddress?.firstName)
    const [lastName, setLastName] = useState(editingAddress?.lastName)
    const [company, setCompany] = useState(editingAddress?.company)
    const [phone, setPhone] = useState(editingAddress?.phone)
    const [zip, setZip] = useState(editingAddress?.zip)
    const [shouldMarkDefault, setShouldMarkDefault] = useState(!!isDefaultAddress)
    const [validations, setValidations] = useState<Validations>(INIT_VALIDS())
    const { token, checkedLocalStorage, setAuth } = useContext(AuthContext)
    const { toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)

    const cleanUp = () => {
        setAddress1('')
        setAddress2('')
        setCity('')
        setStateCode('')
        setFirstName('')
        setLastName('')
        setCompany('')
        setPhone('')
        setZip('')
        setShouldMarkDefault(false)
        setValidations(INIT_VALIDS())
    }

    const populate = () => {
        if (!editingAddress) {
            return
        }
        setAddress1(editingAddress?.address1)
        setAddress2(editingAddress?.address2)
        setCity(editingAddress?.city)
        setStateCode(editingAddress?.provinceCode)
        setFirstName(editingAddress?.firstName)
        setLastName(editingAddress?.lastName)
        setCompany(editingAddress?.company)
        setPhone(editingAddress?.phone)
        setZip(editingAddress?.zip)
        setShouldMarkDefault(!!isDefaultAddress)
    }

    const deleteAddress = async () => {
        const id = editingAddress?.id
        if (!id) {
            return
        }
        toggle(true)
        const res = await API.deleteAddress({ addressID: id, customerAccessToken: token as string })
        if (res.res?.data?.customerAddressDelete?.deletedCustomerAddressId) {
            pushBannerMessage({
                title: 'Successfully deleted address',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.success },
            })
            close({ shouldRefresh: true })
        } else {
            pushBannerMessage({
                title: 'Error deleting address',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error },
            })
        }
        toggle(false)
    }
    const updateAddress = async () => {
        const id = editingAddress?.id
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
                province: stateCode,
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
            close({ shouldRefresh: true, shouldMakeDefaultAddress:shouldMarkDefault,shouldMarkDefaultID:editingAddress.id })
        }
        toggle(false)
    }
    const createAddress = async () => {
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
                province: stateCode,
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
            close({ shouldRefresh: true, newCreatedID: newID,shouldMakeDefaultAddress:shouldMarkDefault,shouldMarkDefaultID:newID})
        } else {
            pushBannerMessage({
                title: 'Error creating address, please retry',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error },
            })
        }
        toggle(false)
    }

    useEffect(() => {
        if (on) {
            populate()
        }
        if (!on) {
            cleanUp()
        }
    }, [on])

    return (
        <>
            <Drawer anchor={'bottom'} open={!!on} onClose={close} className={styles.popUp}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', }}>
                    <IconButton onClick={() => close()}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: '100%',
                        height: '80%',
                        minHeight: 300,
                        overflowY: 'auto',
                        paddingBottom: 20,
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="First Name"
                        variant="outlined"
                        placeholder="Erin"
                        style={{ marginTop: 20 }}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        error={!validations.firstName}
                        onFocus={() => setValidations((vals) => ({ ...vals, firstName: true }))}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Last Name"
                        variant="outlined"
                        placeholder="Jaeger"
                        style={{ marginTop: 20 }}
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
                        style={{ marginTop: 20 }}
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        autoComplete="street-address"
                        error={!validations.address1}
                        onFocus={() => setValidations((vals) => ({ ...vals, address1: true }))}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Apartment, suite, etc"
                        variant="outlined"
                        placeholder="Apt 300"
                        style={{ marginTop: 20 }}
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
                        style={{ marginTop: 20 }}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        autoComplete="address-level2"
                        error={!validations.city}
                        onFocus={() => setValidations((vals) => ({ ...vals, city: true }))}
                    />
                    <TextField
                        id="outlined-basic"
                        label="State"
                        variant="outlined"
                        placeholder="Jaeger"
                        style={{ marginTop: 20 }}
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value)}
                        autoComplete="address-level1"
                        error={!validations.stateCode}
                        onFocus={() => setValidations((vals) => ({ ...vals, stateCode: true }))}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Zip Code/Postal Code"
                        variant="outlined"
                        placeholder="01810"
                        style={{ marginTop: 20 }}
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        autoComplete="postal-code"
                        error={!validations.zip}
                        onFocus={() => setValidations((vals) => ({ ...vals, zip: true }))}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Company/Organization"
                        variant="outlined"
                        placeholder="All Nice"
                        style={{ marginTop: 20 }}
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
                        style={{ marginTop: 20 }}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        error={!validations.phone}
                        onFocus={() => setValidations((vals) => ({ ...vals, phone: true }))}
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={shouldMarkDefault}
                                    onClick={() => setShouldMarkDefault((b) => !b)}
                                    disabled={isDefaultAddress}
                                />
                            }
                            label="Mark this address as default?"
                        />
                    </FormGroup>
                    <Button variant="contained" style={{ marginTop: 10 }} onClick={editingAddress?.id ? updateAddress : createAddress}>
                        {!!editingAddress ? 'Update' : 'Create'}
                    </Button>
                    {!!editingAddress && (
                        <Typography
                            variant="subtitle1"
                            fontSize={'.8em'}
                            style={{
                                color: Colors.light,
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                marginTop: 10,
                                cursor: 'pointer',
                            }}
                            onClick={deleteAddress}
                        >
                            Delete this address
                        </Typography>
                    )}
                </div>
            </Drawer>
        </>
    )
}
