import React from 'react'
import { LoadState } from '../types/misc'
import { ClockLoader } from 'react-spinners'
import { Typography } from '@mui/material'
import { Colors } from '../utils/Colors'
import { CircularProgress } from '@mui/material'

type Props = {
    loading: boolean
    children?: React.ReactNode
    items?: any[]
}

export const LoaderWrapper = ({ loading, children, items }: Props) => {
    return loading && !items?.length ? <CircularProgress /> : <>{children}</>
}
