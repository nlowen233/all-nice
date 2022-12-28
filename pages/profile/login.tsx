import React, { useState, useCallback,useContext,useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Head from 'next/head'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Colors } from '../../utils/Colors'
import { Constants } from '../../utils/Constants'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { API } from '../../utils/API'
import { MessageBannerContext } from '../../contexts/MessageBannerContext'
import { AuthContext } from '../../contexts/AuthContext'
import { LoadingOverlayContext } from '../../contexts/LoadingOverlayContext'
import dayjs from 'dayjs'

export default function Login() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const router = useRouter()
    const {toggle} = useContext(LoadingOverlayContext)
    const {pushBannerMessage} = useContext(MessageBannerContext)
    const {setAuth,returnToRoute,token,expiresAt} = useContext(AuthContext)
    const login = useCallback(async () => {
        toggle(true)
        const loginRes = await API.login({ email, password: pass })
        if (loginRes.err) {
            pushBannerMessage({
                title: loginRes.message || 'Failed to login',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (!!loginRes.res?.errors?.length) {
            pushBannerMessage({
                title: loginRes.res.errors[0].message || 'Unknown error accessing server',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if(!!loginRes.res?.data?.customerUserErrors?.length) {
            const userError = loginRes.res?.data?.customerUserErrors[0]
            pushBannerMessage({
                title: userError.message||'Looks like you may have entered incorrect info',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        }else if (!!loginRes.res?.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
            pushBannerMessage({
                title: `Success!! (You're in baby)`,
                styling: { backgroundColor: Colors.success },
                autoClose: Constants.stdAutoCloseInterval,
            })
            const tokenRes = loginRes.res?.data?.customerAccessTokenCreate.customerAccessToken
            setAuth({ expiresAt: tokenRes.expiresAt, token: tokenRes.accessToken })
            router.push(returnToRoute || '/')
        } else{
            pushBannerMessage({
                title: `Unknown Login error occured...`,
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        }
        toggle(false)
    }, [email,pass,pushBannerMessage,setAuth,router])

    useEffect(()=>{
        if(!!token&&dayjs(expiresAt).isBefore(dayjs())){
            router.push('/profile/home')
        }
    },[])

    return (
        <>
            <Head>
                <title>All Nice Clothing</title>
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
                    Login
                </Typography>
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    placeholder="allniceclothing@gmail.com"
                    style={{ marginTop: 40 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
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
                    autoComplete="current-password"
                />
                <Link href={'/profile/recover'}>
                    <Typography
                        variant="subtitle1"
                        fontSize={'.8em'}
                        style={{ color: Colors.light, fontWeight: 'bold', textDecoration: 'underline', marginTop: 5 }}
                    >
                        Forgot Password
                    </Typography>
                </Link>
                <Button variant="contained" style={{ marginTop: 40 }} onClick={login}>
                    Log In
                </Button>
                <Link href={'/profile/createAccount'}>
                    <Typography
                        variant="subtitle1"
                        fontSize={'.8em'}
                        style={{ color: Colors.light, fontWeight: 'bold', textDecoration: 'underline', marginTop: 10 }}
                    >
                        Create Account
                    </Typography>
                </Link>
            </div>
        </>
    )
}
