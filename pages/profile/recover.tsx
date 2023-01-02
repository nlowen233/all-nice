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
import { Utils } from '../../utils/Utils'

export default function CreateAccount() {
    const [email, setEmail] = useState('')
    const [emailInvalid, setEmailInvalid] = useState(false)
    const { on, toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const { setAuth, returnToRoute } = useContext(AuthContext)
    const router = useRouter()

    const recover = useCallback(async () => {
        if (!email) {
            setEmailInvalid(true)
            return pushBannerMessage({
                title: 'Looks like your email might be invalid',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        }
        toggle(true)
        const res = await API.recoverAccount({
            email,
        })
        const errors = res.res?.errors || []
        const userErrors = res.res?.data?.customerRecover?.customerUserErrors || []
        if (res.err) {
            pushBannerMessage({
                title: res.message || 'Unknown error occured, could not send recovery email',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (errors.length) {
            pushBannerMessage({
                title: errors[0].message || 'Unknown error accessing server',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (userErrors.length) {
            pushBannerMessage({
                title: userErrors[0].message || 'Unknown Error',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else {
            pushBannerMessage({
                title: 'Check your email for the reset link',
            })
        }
        toggle(false)
    }, [email, toggle, pushBannerMessage, setAuth, router, emailInvalid])

    return (
        <>
            <Head>
                <title>Recover Account - All Nice Clothing</title>
                <meta name="description" content="Recover your All Nice Clothing acount" />
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
                    Recover Your Account
                </Typography>
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
                    error={emailInvalid}
                    onFocus={() => setEmailInvalid(false)}
                />
                <Button variant="contained" style={{ marginTop: 40 }} onClick={recover}>
                    Send Recovery Email
                </Button>
                <Link href={'/profile/login'}>
                    <Typography
                        variant="subtitle1"
                        fontSize={'.8em'}
                        style={{ color: Colors.light, fontWeight: 'bold', textDecoration: 'underline', marginTop: 10 }}
                    >
                        Take me back to login
                    </Typography>
                </Link>
                <Link href={'/profile/createAccount'}>
                    <Typography
                        variant="subtitle1"
                        fontSize={'.8em'}
                        style={{ color: Colors.light, fontWeight: 'bold', textDecoration: 'underline', marginTop: 10 }}
                    >
                        or create an account
                    </Typography>
                </Link>
            </div>
        </>
    )
}
