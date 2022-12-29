import React, { useState, useContext, useCallback } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Head from 'next/head'
import { LoadingOverlayContext } from '../../../../contexts/LoadingOverlayContext'
import { MessageBannerContext } from '../../../../contexts/MessageBannerContext'
import { AuthContext } from '../../../../contexts/AuthContext'
import { useRouter } from 'next/router'
import { Colors } from '../../../../utils/Colors'
import { Constants } from '../../../../utils/Constants'
import { API } from '../../../../utils/API'
import { Utils } from '../../../../utils/Utils'


export default function Reset() {
    const [password,setPassword] = useState('')
    const [passInvalid,setPassInvalid] = useState(false)
    const { on, toggle } = useContext(LoadingOverlayContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const { setAuth, returnToRoute } = useContext(AuthContext)
    const router = useRouter()

    const recover = useCallback(async () => {
        const id = `gid://shopify/Customer/${router.query.user}`
        if(!password){
            setPassInvalid(true)
            return pushBannerMessage({
                title: 'Looks like your password might be invalid',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        }
        toggle(true)
        const res = await API.resetPassword({
            id,
            password,
            resetToken: router.query.resetToken as string
        })
        const errors = res.res?.errors||[]
        const userErrors = res.res?.data?.customerReset?.customerUserErrors||[]
        const tokenRes = res.res?.data?.customerReset?.customerAccessToken
        if (res.err) {
            pushBannerMessage({
                title: res.message || 'Unknown error occured, could not reset password',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if (errors.length) {
            pushBannerMessage({
                title: errors[0].message || 'Unknown error accessing server',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        }  else if (userErrors.length) {
            pushBannerMessage({
                title: userErrors[0].message || 'Unknown Error',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        } else if(tokenRes?.accessToken){
            pushBannerMessage({
                title: 'Successfully reset password',
                styling: { backgroundColor: Colors.success },
                autoClose: Constants.stdAutoCloseInterval,
            })
            setAuth({token:tokenRes.accessToken,expiresAt:tokenRes.expiresAt})
            Utils.storeToken(tokenRes.accessToken,tokenRes.expiresAt)
            router.push('/')
        } else{
            pushBannerMessage({
                title: 'Unknown Error',
                styling: { backgroundColor: Colors.error },
                autoClose: Constants.stdAutoCloseInterval,
            })
        }
        toggle(false)
    }, [toggle, pushBannerMessage, setAuth, router,password,passInvalid])

    return (
        <>
            <Head>
                <title>Recover Account</title>
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
                    Reset Password
                </Typography>
                <TextField
                    id="outlined-basic"
                    label="New Password"
                    variant="outlined"
                    placeholder="*******"
                    style={{ marginTop: 20 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    type="password"
                    error={passInvalid}
                    onFocus={() => setPassInvalid(false)}
                />
                <Button variant="contained" style={{ marginTop: 40 }} onClick={recover}>
                    Reset Password
                </Button>
            </div>
        </>
    )
}
