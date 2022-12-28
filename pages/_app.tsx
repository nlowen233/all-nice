import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import { Theme } from '../utils/Theme'
import { MenuBar } from '../components/MenuBar'
import { SideMenuWrapper } from '../components/SideMenuWrapper'
import React, { useState, useEffect } from 'react'
import { useMountlessEffect } from '../hooks/useMountlessEffect'
import { useRouter } from 'next/router'
import { LoadingOverlay } from '../components/LoadingOverlay'

export default function App({ Component, pageProps }: AppProps) {
    const [menu, setMenu] = useState(false)
    const [loadingOverlay, setLoadingOverlay] = useState(false)
    const router = useRouter()
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
            <ThemeProvider theme={Theme}>
                <LoadingOverlay loading={loadingOverlay}/>
                <MenuBar profileAlerts={3} menuIsOpen={menu} toggleMenu={() => setMenu((b) => !b)} />
                <SideMenuWrapper links={[{ link: '/', title: 'Some Title' }]} open={menu} closeMenu={() => setMenu(false)}>
                    <Component {...pageProps} />
                </SideMenuWrapper>
            </ThemeProvider>
        </>
    )
}
