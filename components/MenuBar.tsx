import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import { Colors } from '../utils/Colors'
import styles from '../styles/components/MenuBar.module.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Badge from '@mui/material/Badge'
import CloseIcon from '@mui/icons-material/Close'
import { Constants } from '../utils/Constants'
import Link from 'next/link'
import { ZIndex } from '../types/ZIndex'
import { AuthContext } from '../contexts/AuthContext'

type Props = {
    toggleMenu?: () => void
    toggleProfile?: () => void
    toggleCart?: () => void
    profileAlerts?: number
    cartAlerts?: number
    menuIsOpen?: boolean
}

export const MenuBar = ({ cartAlerts, toggleCart, toggleMenu, toggleProfile, profileAlerts, menuIsOpen }: Props) => {
    const { token } = useContext(AuthContext)
    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    backgroundColor: Colors.dark,
                    width: '100%',
                    height: Constants.menuBarHeight,
                    zIndex: ZIndex.sideMenu,
                }}
                className={styles.menu}
            >
                <div>
                    <IconButton color="secondary" onClick={toggleMenu}>
                        {menuIsOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Link href={'/'}>
                        <Typography color="secondary">The Logo</Typography>
                    </Link>
                </div>
                <div className={styles.iconGroup}>
                    <Link href={!!token ? `/profile` : '/profile/login'}>
                        <IconButton color="secondary" onClick={toggleProfile}>
                            <Badge badgeContent={profileAlerts} color="error">
                                <AccountCircleIcon />
                            </Badge>
                        </IconButton>
                    </Link>
                    <Link href={'/cart'}>
                        <IconButton color="secondary" onClick={toggleCart}>
                            <Badge badgeContent={cartAlerts} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Link>
                </div>
            </div>
            <div style={{ height: Constants.menuBarHeight }} />
        </>
    )
}
