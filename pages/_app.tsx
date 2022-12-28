import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import { Theme } from '../utils/Theme'
import { MenuBar } from '../components/MenuBar'
import { SideMenuWrapper } from '../components/SideMenuWrapper'
import React, { useState, useEffect, useCallback } from 'react'
import { useMountlessEffect } from '../hooks/useMountlessEffect'
import { useRouter } from 'next/router'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { AuthWrapper } from '../components/AuthWrapper'
import { LoadingOverlayWrapper } from '../components/LoadingOverlayWrapper'
import { BannerMessage, MessageBannerContext } from '../contexts/MessageBannerContext'
import { MessageBanner } from '../components/MessageBanner'

export default function App({ Component, pageProps }: AppProps) {
    const [menu, setMenu] = useState(false)
    const [loadingOverlay, setLoadingOverlay] = useState(false)
    const [bannerMessageStack, setBannerMessageStack] = useState<BannerMessage[]>([])
    const currentMessage = !!bannerMessageStack.length ? bannerMessageStack[0] : undefined
    const router = useRouter()
    const pushBannerMessage = (msg: BannerMessage) => setBannerMessageStack((stack) => [...stack, msg])
    const popBannerMessage = () => setBannerMessageStack((stack) => [...stack.slice(1)])
    useMountlessEffect(() => {
        if (menu) {
            setMenu(false)
        }
    }, [router.asPath])
    useEffect(() => {
        router.events.on('routeChangeStart', () => setLoadingOverlay(true))
        router.events.on('routeChangeComplete', () => setLoadingOverlay(false))
    }, [])
    return (
        <>
            <AuthWrapper>
                <ThemeProvider theme={Theme}>
                    <MessageBannerContext.Provider value={{ pushBannerMessage }}>
                        <LoadingOverlayWrapper on={loadingOverlay} toggle={setLoadingOverlay}>
                            <MessageBanner bannerMessage={currentMessage} close={popBannerMessage} />
                            <MenuBar profileAlerts={3} menuIsOpen={menu} toggleMenu={() => setMenu((b) => !b)} />
                            <SideMenuWrapper links={[{ link: '/', title: 'Some Title' }]} open={menu} closeMenu={() => setMenu(false)}>
                                <Component {...pageProps} />
                            </SideMenuWrapper>
                        </LoadingOverlayWrapper>
                    </MessageBannerContext.Provider>
                </ThemeProvider>
            </AuthWrapper>
        </>
    )
}
