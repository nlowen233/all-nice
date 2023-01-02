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
import { PopUpContext, PopUpMessage, PopUpRes } from '../contexts/PopUpContext'
import { PopUpDialog } from '../components/PopUpDialog'
import { useProfile } from '../hooks/useProfile'
import { ProfileContext } from '../contexts/ProfileContext'
import { CheckoutContext } from '../contexts/CheckoutContext'
import { useCheckout } from '../hooks/useCheckout'

export default function App({ Component, pageProps }: AppProps) {
    const [auth, setAuth] = useState<Partial<AuthContextVars>>({})
    const [checkedLocalStorage, setCheckedLocalStorage] = useState(false)
    const [menu, setMenu] = useState(false)
    const [dialog, setDialog] = useState(false)

    const [popUpMessageStack, setPopUpMessageStack] = useState<PopUpMessage[]>([])
    const [popUpRes, setPopUpRes] = useState<PopUpRes | undefined>(undefined)
    const currentPopUpMessage = !!popUpMessageStack.length ? popUpMessageStack[0] : undefined
    const pushPopUpMessage = (msg: PopUpMessage) => setPopUpMessageStack((stack) => [msg, ...stack])
    const popPopUpMessage = () => setPopUpMessageStack((stack) => [...stack.slice(1)])

    const [loadingOverlay, setLoadingOverlay] = useState(false)
    const [bannerMessageStack, setBannerMessageStack] = useState<BannerMessage[]>([])
    const currentMessage = !!bannerMessageStack.length ? bannerMessageStack[0] : undefined
    const router = useRouter()
    const pushBannerMessage = (msg: BannerMessage) => setBannerMessageStack((stack) => [msg, ...stack])
    const popBannerMessage = () => setBannerMessageStack((stack) => [...stack.slice(1)])

    const { Cart, cart, isCartUpdating, cartDeletionID } = useCart({ pushBannerMessage, token: auth.token })
    const { profile, clear, profileLoading, refresh } = useProfile({ pushBannerMessage, token: auth.token })
    const {checkout,createCheckout,creatingCheckout} = useCheckout({pushBannerMessage,token:auth.token})
    
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
    useMountlessEffect(() => {
        if (popUpMessageStack.length) {
            setDialog(true)
        }
    }, [popUpMessageStack])
    useMountlessEffect(() => {
        if (popUpRes) {
            setPopUpRes(undefined)
        }
    }, [popUpRes])
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
                            <PopUpContext.Provider value={{ pushPopUpMessage, popUpRes }}>
                                <ProfileContext.Provider value={{ clear, profile, profileLoading, refresh }}>
                                    <CartContext.Provider value={{ Cart, cart, isCartUpdating, cartDeletionID }}>
                                        <CheckoutContext.Provider value={{checkout,createCheckout,creatingCheckout}}>
                                        <MessageBanner bannerMessage={currentMessage} close={popBannerMessage} />
                                        <MenuBar
                                            cartAlerts={cart?.lines?.nodes?.length || 0}
                                            menuIsOpen={menu}
                                            toggleMenu={() => setMenu((b) => !b)}
                                        />
                                        <SideMenuWrapper
                                            links={[
                                                { link: '/', title: 'Home' },
                                                { link: '/', title: 'Log Out', onClick: logOut },
                                            ]}
                                            open={menu}
                                            closeMenu={() => setMenu(false)}
                                        >
                                            <>
                                                <div
                                                    style={{ minHeight: height - Constants.menuBarHeight - Constants.footerHeight(width) }}
                                                >
                                                    <Component {...pageProps} />
                                                </div>

                                                <Footer screenWidth={width} />
                                            </>
                                        </SideMenuWrapper>
                                        <PopUpDialog
                                            close={(res) => {
                                                setDialog(false)
                                                setPopUpRes(res)
                                                setTimeout(popPopUpMessage, 1000)
                                            }}
                                            open={dialog}
                                            popUpMessage={currentPopUpMessage}
                                        />
                                        </CheckoutContext.Provider>
                                    </CartContext.Provider>
                                </ProfileContext.Provider>
                            </PopUpContext.Provider>
                        </LoadingOverlayWrapper>
                    </MessageBannerContext.Provider>
                </ThemeProvider>
            </AuthContext.Provider>
        </>
    )
}
