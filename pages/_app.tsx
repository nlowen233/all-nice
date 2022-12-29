import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import { Theme } from '../utils/Theme'
import { MenuBar } from '../components/MenuBar'
import { SideMenuWrapper } from '../components/SideMenuWrapper'
import React, { useState, useEffect, useCallback } from 'react'
import { useMountlessEffect } from '../hooks/useMountlessEffect'
import { useRouter } from 'next/router'
import { LoadingOverlayWrapper } from '../components/LoadingOverlayWrapper'
import { BannerMessage, MessageBannerContext } from '../contexts/MessageBannerContext'
import { MessageBanner } from '../components/MessageBanner'
import { AuthContext, AuthContextVars } from '../contexts/AuthContext'
import { Utils } from '../utils/Utils'

export default function App({ Component, pageProps }: AppProps) {
    const [auth, setAuth] = useState<Partial<AuthContextVars>>({})
    const [checkedLocalStorage, setCheckedLocalStorage] = useState(false)
    const [menu, setMenu] = useState(false)
    const [loadingOverlay, setLoadingOverlay] = useState(false)
    const [bannerMessageStack, setBannerMessageStack] = useState<BannerMessage[]>([])
    const currentMessage = !!bannerMessageStack.length ? bannerMessageStack[bannerMessageStack.length-1] : undefined
    const router = useRouter()
    const pushBannerMessage = (msg: BannerMessage) => setBannerMessageStack((stack) => [...stack, msg])
    const popBannerMessage = () => setBannerMessageStack((stack) => [...stack.slice(1)])
    const logOut = () => {
        setAuth((a) => ({ ...a, token: undefined, expiresAt: undefined }))
        Utils.clearToken()
    }
    useMountlessEffect(() => {
        if (menu) {
            setMenu(false)
        }
    }, [router.asPath])
    useEffect(() => {
        router.events.on('routeChangeStart', () => setLoadingOverlay(true))
        router.events.on('routeChangeComplete', () => setLoadingOverlay(false))
    }, [])
    useEffect(() => {
        const [token, expDate] = Utils.getToken()
        if (!auth.token && token && expDate) {
            setAuth((a) => ({ ...a, expiresAt: expDate, token }))
        }
        setCheckedLocalStorage(true)
    }, [])
    return (
        <>
            <AuthContext.Provider
                value={{ expiresAt: auth.expiresAt, token: auth.token, setAuth, returnToRoute: auth.returnToRoute, checkedLocalStorage }}
            >
                <ThemeProvider theme={Theme}>
                    <MessageBannerContext.Provider value={{ pushBannerMessage }}>
                        <LoadingOverlayWrapper on={loadingOverlay} toggle={setLoadingOverlay}>
                            <MessageBanner bannerMessage={currentMessage} close={popBannerMessage} />
                            <MenuBar profileAlerts={3} menuIsOpen={menu} toggleMenu={() => setMenu((b) => !b)} />
                            <SideMenuWrapper
                                links={[
                                    { link: '/', title: 'Home' },
                                    { link: '/', title: 'Log Out', onClick: logOut },
                                ]}
                                open={menu}
                                closeMenu={() => setMenu(false)}
                            >
                                <Component {...pageProps} />
                            </SideMenuWrapper>
                        </LoadingOverlayWrapper>
                    </MessageBannerContext.Provider>
                </ThemeProvider>
            </AuthContext.Provider>
        </>
    )
}
