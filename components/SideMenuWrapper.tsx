import React, { MutableRefObject, ReactNode, Ref, useEffect, useRef, useState } from 'react'
import { SiteLink } from '../types/misc'
import styles from '../styles/components/SideMenuWrapper.module.css'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { Colors } from '../utils/Colors'
import { ZIndex } from '../types/ZIndex'
import { Constants } from '../utils/Constants'
import MUILink from '@mui/material/Link'
import { useWindowSize } from '../hooks/useWindowSize'
import { useOnClickOutside } from 'usehooks-ts'

const LINK_CONTAINER_HEIGHT = 600

type Props = {
    links: SiteLink[]
    children?: ReactNode
    open?: boolean
    closeMenu: () => void
}

export const SideMenuWrapper = ({ links, children, open, closeMenu }: Props) => {
    const [_, height] = useWindowSize()
    const menuHeight = height - Constants.menuBarHeight
    const menuRef = useRef<HTMLDivElement>()
    useOnClickOutside(menuRef as MutableRefObject<HTMLDivElement>, closeMenu)
    return (
        <div style={{ width: '100vw', height: menuHeight, position: 'relative' }}>
            <div
                className={styles.main}
                style={{ zIndex: ZIndex.sideMenu, left: !!open ? 0 : -320, backgroundColor: Colors.dark }}
                ref={menuRef as MutableRefObject<HTMLDivElement>}
            >
                <div style={{ paddingLeft: 10, height: LINK_CONTAINER_HEIGHT }}>
                    {links.map((link) => (
                        <div style={{ paddingTop: 5 }} key={link.title}>
                            <Link
                                href={link.link}
                                onClick={() => {
                                    link.onClick && link.onClick()
                                    closeMenu()
                                }}
                            >
                                <Typography color="secondary">{link.title}</Typography>
                            </Link>
                        </div>
                    ))}
                </div>
                <div style={{ backgroundColor: Colors.mid, height: menuHeight - LINK_CONTAINER_HEIGHT }}>
                    PROFILE HERE ON LOGIN, SOCIALS HERE ON NOT LOGGED IN
                </div>
            </div>
            <div
                className={styles.overlay}
                style={{ height: '100%', width: '100%', opacity: !!open ? 0.3 : 0, zIndex: ZIndex.sideMenuOverlay }}
            />
            {children}
        </div>
    )
}
