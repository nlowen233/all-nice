import React from 'react'
import { LoadState } from '../types/misc'
import { ClockLoader } from 'react-spinners'
import { Typography } from '@mui/material'
import { Colors } from '../utils/Colors'

type Props = {
    loadState: LoadState
    children?: React.ReactNode
    items?: any[]
}

export const LoaderWrapper = ({ loadState, children, items }: Props) => {
    return (loadState === 'loading' || loadState === 'init') && !items?.length ? (
        <Typography variant="h4" fontSize={'1em'} style={{ color: Colors.dark }}>
            Loading...
        </Typography>
    ) : (
        <>{children}</>
    )
}
