import React from 'react'
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

type Props = {
    toggleMenu?: () => void
    toggleProfile?: () => void
    toggleCart?: () => void
    profileAlerts?: number
    cartAlerts?: number
    menuIsOpen?: boolean
}

export const MenuBar = ({ cartAlerts, toggleCart, toggleMenu, toggleProfile, profileAlerts, menuIsOpen }: Props) => {
    return (
        <div
            style={{ position: 'static', backgroundColor: Colors.dark, width: '100vw', height: Constants.menuBarHeight }}
            className={styles.menu}
        >
            <div>
                <IconButton color="secondary" onClick={toggleMenu}>
                    {menuIsOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {' '}
                <Typography color="secondary">The Logo</Typography>{' '}
            </div>
            <div className={styles.iconGroup}>
                <IconButton color="secondary" onClick={toggleProfile}>
                    <Badge badgeContent={profileAlerts} color="error">
                        <AccountCircleIcon />
                    </Badge>
                </IconButton>
                <IconButton color="secondary" onClick={toggleCart}>
                    <Badge badgeContent={cartAlerts} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </div>
        </div>
    )
}
