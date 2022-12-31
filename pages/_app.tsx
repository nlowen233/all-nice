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
import { Footer } from '../components/Footer'
import { useWindowSize } from '../hooks/useWindowSize'
import { Constants } from '../utils/Constants'
import { useCart } from '../hooks/useCart'
import { CartContext } from '../contexts/CartContext'

export default function App({ Component, pageProps }: AppProps) {
    const [auth, setAuth] = useState<Partial<AuthContextVars>>({})
    const { Cart, cart, isCartUpdating } = useCart()
    const [checkedLocalStorage, setCheckedLocalStorage] = useState(false)
    const [menu, setMenu] = useState(false)
    const [loadingOverlay, setLoadingOverlay] = useState(false)
    const [bannerMessageStack, setBannerMessageStack] = useState<BannerMessage[]>([])
    const currentMessage = !!bannerMessageStack.length ? bannerMessageStack[0] : undefined
    const router = useRouter()
    const pushBannerMessage = (msg: BannerMessage) => setBannerMessageStack((stack) => [msg, ...stack])
    const popBannerMessage = () => setBannerMessageStack((stack) => [...stack.slice(1)])
    const [width, height] = useWindowSize()
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
                            <CartContext.Provider value={{ Cart, cart, isCartUpdating }}>
                                <MessageBanner bannerMessage={currentMessage} close={popBannerMessage} />
                                <MenuBar cartAlerts={cart?.totalQuantity} menuIsOpen={menu} toggleMenu={() => setMenu((b) => !b)} />
                                <SideMenuWrapper
                                    links={[
                                        { link: '/', title: 'Home' },
                                        { link: '/', title: 'Log Out', onClick: logOut },
                                    ]}
                                    open={menu}
                                    closeMenu={() => setMenu(false)}
                                >
                                    <>
                                        <div style={{ minHeight: height - Constants.menuBarHeight - Constants.footerHeight(width) }}>
                                            <Component {...pageProps} />
                                        </div>

                                        <Footer screenWidth={width} />
                                    </>
                                </SideMenuWrapper>
                            </CartContext.Provider>
                        </LoadingOverlayWrapper>
                    </MessageBannerContext.Provider>
                </ThemeProvider>
            </AuthContext.Provider>
        </>
    )
}
