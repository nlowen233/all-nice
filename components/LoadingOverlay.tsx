import { CircularProgress } from '@mui/material'
import React from 'react'
import { ClockLoader } from 'react-spinners'
import { ZIndex } from '../types/ZIndex'
import { Colors } from '../utils/Colors'

type Props = {
    loading?: boolean
}

export const LoadingOverlay = ({ loading }: Props) => {
    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    opacity: loading ? 0.6 : 0,
                    pointerEvents: 'none',
                    zIndex: ZIndex.loadingOverlay,
                    transition: '100ms',
                }}
            >
                <CircularProgress />
            </div>
        </div>
    )
}
