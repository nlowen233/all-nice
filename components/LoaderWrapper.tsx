import React from 'react'
import { LoadState } from '../types/misc'
import { ClockLoader } from 'react-spinners'

type Props = {
    loadState: LoadState
    children?: React.ReactNode
}

export const LoaderWrapper = ({loadState,children}:Props) => {
  return (
    loadState==='loading'||loadState==='init' ? <ClockLoader/> : <>{children}</>
  )
}
