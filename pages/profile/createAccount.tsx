import React, { useState, useContext, useCallback } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Head from 'next/head'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Colors } from '../../utils/Colors'
import { Constants } from '../../utils/Constants'
import Link from 'next/link'
import { LoadingOverlayContext } from '../../contexts/LoadingOverlayContext'
import { API } from '../../utils/API'
import { MessageBannerContext } from '../../contexts/MessageBannerContext'
import { Validate } from '../../utils/Validate'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { AuthContext } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'

interface Validations {
    first: boolean
    last: boolean
    email: boolean
    password: boolean
}

const INIT_VALIDS = (): Validations => ({
    email: true,
    first: true,
    last: true,
    password: true,
})

export default function Login() {
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [emailMarketing, toggleEmailMarketing] = useState(false)
    const [validations, setValidations] = useState<Validations>(INIT_VALIDS())
    const { on, toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const { setAuth, returnToRoute } = useContext(AuthContext)
    const router = useRouter()

    const createAccount = useCallback(async () => {
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
        if (!Validate.notEmpty(pass)) {
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
        let shouldAttemptLogin = false
        const res = await API.createCustomer({
            email,
            firstName: first,
            lastName: last,
            password: pass,
            acceptsEmailMarketing: emailMarketing,
        })
        if (res.err) {
            pushBannerMessage({
                title: res.message || 'Unknown account creation error occurred',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (!!res.res?.errors?.length) {
            pushBannerMessage({
                title: res.res.errors[0].message || 'Unknown error accessing server',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (!res.res?.data?.id) {
            shouldAttemptLogin = true
        } else if (!!res.res.data.id) {
            pushBannerMessage({
                title: 'Account created! Congrats!',
                autoClose: Constants.stdAutoCloseInterval,
                styling: { backgroundColor: Colors.success },
            })
            shouldAttemptLogin = true
        }
        if (shouldAttemptLogin) {
            const loginRes = await API.login({ email, password: pass })
            if (loginRes.err) {
                pushBannerMessage({
                    title: loginRes.message || 'Failed to login newly created account',
                    styling: { backgroundColor: Colors.error },
                    autoClose: Constants.stdAutoCloseInterval,
                })
            } else if (!!loginRes.res?.errors?.length) {
                pushBannerMessage({
                    title: loginRes.res.errors[0].message || 'Unknown error accessing server',
                    styling: { backgroundColor: Colors.error },
                    autoClose: Constants.stdAutoCloseInterval,
                })
            } else if (!!loginRes.res?.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
                const tokenRes = loginRes.res?.data?.customerAccessTokenCreate.customerAccessToken
                setAuth({ expiresAt: tokenRes.expiresAt, token: tokenRes.accessToken })
                router.push(returnToRoute || '/')
            } else {
                pushBannerMessage({
                    title: 'Failed to auto-login',
                    styling: { backgroundColor: Colors.error },
                    autoClose: Constants.stdAutoCloseInterval,
                })
            }
        }
        toggle(false)
    }, [setValidations, first, last, email, pass, toggle, pushBannerMessage, emailMarketing, setAuth, router])

    return (
        <>
            <Head>
                <title>Create an Account</title>
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
                    Create an Account
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
                    required
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
                    required
                    error={!validations.last}
                    onFocus={() => setValidations((vals) => ({ ...vals, last: true }))}
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
                    required
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
                    required
                    error={!validations.password}
                    onFocus={() => setValidations((vals) => ({ ...vals, password: true }))}
                />
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox value={emailMarketing} onClick={() => toggleEmailMarketing((b) => !b)} />}
                        label="Sign up for our email marketing?"
                    />
                </FormGroup>
                <Button variant="contained" style={{ marginTop: 40 }} onClick={createAccount}>
                    Create
                </Button>
                <Link href={'/profile/login'}>
                    <Typography
                        variant="subtitle1"
                        fontSize={'.8em'}
                        style={{ color: Colors.light, fontWeight: 'bold', textDecoration: 'underline', marginTop: 10 }}
                    >
                        or Login
                    </Typography>
                </Link>
            </div>
        </>
    )
}
