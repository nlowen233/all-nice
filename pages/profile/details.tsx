import React, { useState, useContext, useCallback, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Head from 'next/head'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Colors } from '../../utils/Colors'
import { Constants } from '../../utils/Constants'
import Link from 'next/link'
import { LoadingOverlayContext } from '../../contexts/LoadingOverlayContext'
import { API, GetAccountDetailsRes } from '../../utils/API'
import { MessageBannerContext } from '../../contexts/MessageBannerContext'
import { Validate } from '../../utils/Validate'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { AuthContext } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'
import { Utils } from '../../utils/Utils'
import { GetStaticProps } from 'next'

interface Validations {
    first: boolean
    last: boolean
    email: boolean
    password: boolean
    phone: boolean
}

const INIT_VALIDS = (): Validations => ({
    email: true,
    first: true,
    last: true,
    password: true,
    phone: true,
})

export default function AccountDetails() {
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [pass2, setPass2] = useState('')
    const [phone, setPhone] = useState('')
    const [emailMarketing, toggleEmailMarketing] = useState(false)
    const [validations, setValidations] = useState<Validations>(INIT_VALIDS())
    const { on, toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const { token, setAuth } = useContext(AuthContext)
    const router = useRouter()

    const update = useCallback(async () => {
        let invalid = false
        if (!Validate.notEmpty(first)) {
            setValidations((vals) => ({ ...vals, first: false }))
            invalid = true
        } else {
            setValidations((vals) => ({ ...vals, first: true }))
        }
        if (!Validate.notEmpty(last)) {
            setValidations((vals) => ({ ...vals, last: false }))
            invalid = true
        } else {
            setValidations((vals) => ({ ...vals, last: true }))
        }
        if (!Validate.notEmpty(email)) {
            setValidations((vals) => ({ ...vals, email: false }))
            invalid = true
        } else {
            setValidations((vals) => ({ ...vals, email: true }))
        }
        if (Validate.notEmpty(phone) && !Validate.phoneNumber(phone)) {
            setValidations((vals) => ({ ...vals, phone: false }))
            invalid = true
        } else {
            setValidations((vals) => ({ ...vals, phone: true }))
        }
        if (!!pass && pass !== pass2) {
            setValidations((vals) => ({ ...vals, password: false }))
            invalid = true
        } else {
            setValidations((vals) => ({ ...vals, password: true }))
        }
        if (invalid) {
            return pushBannerMessage({
                title: 'Invalid fields, please double check',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.error },
            })
        }
        toggle(true)
        const attemptedPasswordChange = !!pass
        const res = await API.updateCustomer({
            customer: {
                acceptsMarketing: emailMarketing,
                email,
                firstName: first,
                lastName: last,
                password: pass,
                phone: Utils.standardizePhone(phone),
            },
            customerAccessToken: token as string,
        })
        let newRoute = '/profile'
        const errors = res.res?.errors || []
        const userErrors = res.res?.data?.customerUpdate?.customerUserErrors || []
        if (res.err) {
            pushBannerMessage({
                title: res.message || 'Unknown error occured updating your account',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (!!errors.length) {
            pushBannerMessage({
                title: errors[0].message || 'Unknown error accessing server',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (!!userErrors.length) {
            pushBannerMessage({
                title: userErrors[0].message || 'Unknown error accessing server',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else {
            pushBannerMessage({
                title: 'Successfully updated your information!',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.success },
            })
            if (attemptedPasswordChange) {
                const loginRes = await API.login({ email, password: pass })
                const newTokenRes = loginRes.res?.data?.customerAccessTokenCreate?.customerAccessToken
                if (newTokenRes) {
                    setAuth({ expiresAt: newTokenRes.expiresAt, token: newTokenRes.accessToken })
                    Utils.storeToken(newTokenRes.accessToken, newTokenRes.expiresAt)
                } else {
                    newRoute = '/profile/login'
                    pushBannerMessage({
                        title: 'Please log in with your new password',
                        autoClose: Constants.stdAutoCloseInterval,
                    })
                }
            }
            router.push(newRoute)
        }
        toggle(false)
    }, [setValidations, first, last, email, pass, toggle, pushBannerMessage, emailMarketing, phone, router, pass2])

    useEffect(() => {
        if (!token) {
            return
        }
        toggle(true)
        API.getAccountDetails({ customerAccessToken: token }).then((res) => {
            const errors = res.res?.errors || []
            if (res.err) {
                pushBannerMessage({
                    title: res.message || 'Unknown server issue occured',
                    autoClose: Constants.stdAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
                router.push('/profile')
            } else if (errors.length) {
                const firstError = errors[0]
                pushBannerMessage({
                    title: firstError.message || 'Unknown issue with server request',
                    autoClose: Constants.stdAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
            } else {
                const customer = res.res?.data?.customer
                setFirst(customer?.firstName || '')
                setLast(customer?.lastName || '')
                setPhone(customer?.phone || '')
                setEmail(customer?.email || '')
                toggleEmailMarketing(customer?.acceptsMarketing || false)
            }
            toggle(false)
        })
    }, [token])

    return (
        <>
            <Head>
                <title>Edit Details</title>
                <meta name="description" content="Home page for All Nice Clothing" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 40,
                }}
            >
                <Typography variant="h2" fontSize={'1.8em'} style={{ color: Colors.dark, fontWeight: 'bold' }}>
                    Edit Account Details
                </Typography>
                <TextField
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    placeholder="Erin"
                    style={{ marginTop: 20 }}
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    autoComplete="given-name"
                    error={!validations.first}
                    onFocus={() => setValidations((vals) => ({ ...vals, first: true }))}
                />
                <TextField
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    placeholder="Jaeger"
                    style={{ marginTop: 20 }}
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    autoComplete="family-name"
                    error={!validations.last}
                    onFocus={() => setValidations((vals) => ({ ...vals, last: true }))}
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
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    placeholder="allniceclothing@gmail.com"
                    style={{ marginTop: 20 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    error={!validations.email}
                    onFocus={() => setValidations((vals) => ({ ...vals, email: true }))}
                />
                <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    placeholder="******"
                    style={{ marginTop: 20 }}
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    autoComplete="new-password"
                    error={!validations.password}
                    onFocus={() => setValidations((vals) => ({ ...vals, password: true }))}
                />
                <TextField
                    id="outlined-basic"
                    label="Confirm Password"
                    variant="outlined"
                    placeholder="******"
                    style={{ marginTop: 20 }}
                    type="password"
                    value={pass2}
                    onChange={(e) => setPass2(e.target.value)}
                    autoComplete="new-password"
                    error={!validations.password}
                    disabled={!pass}
                    onFocus={() => setValidations((vals) => ({ ...vals, password: true }))}
                />
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={emailMarketing} onClick={() => toggleEmailMarketing((b) => !b)} />}
                        label={emailMarketing ? 'Turn off email marketing?' : 'Turn on email marketing?'}
                    />
                </FormGroup>
                <Button variant="contained" style={{ marginTop: 40 }} onClick={update}>
                    Update
                </Button>
                <Link href={'/profile'}>
                    <Typography
                        variant="subtitle1"
                        fontSize={'.8em'}
                        style={{ color: Colors.light, fontWeight: 'bold', textDecoration: 'underline', marginTop: 10 }}
                    >
                        Take me back to my account
                    </Typography>
                </Link>
            </div>
        </>
    )
}
