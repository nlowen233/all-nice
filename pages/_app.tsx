import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import { Theme } from '../utils/Theme'
import { MenuBar } from '../components/MenuBar'
import { SideMenuWrapper } from '../components/SideMenuWrapper'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
    const [menu, setMenu] = useState(false)
    return (
        <>
            <ThemeProvider theme={Theme}>
                <MenuBar profileAlerts={3} menuIsOpen={menu} toggleMenu={() => setMenu((b) => !b)} />
                <SideMenuWrapper links={[{ link: '', title: 'Some Title' }]} open={menu} closeMenu={() => setMenu(false)}>
                    <Component {...pageProps} />
                </SideMenuWrapper>
            </ThemeProvider>
        </>
    )
}
