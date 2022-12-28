import React, { useEffect, useRef, useState } from 'react'
import { Utils } from '../utils/Utils'

type Params = {
    initWidth?: number
    initHeight?: number
}

export const useWindowSize = (p?: Params) => {
    const [height, setHeight] = useState<false | number>(false)
    const [width, setWidth] = useState<false | number>(false)
    const lastHeight = useRef<number>()
    const lastWidth = useRef<number>()

    useEffect(() => {
        const hval = window.innerHeight || p?.initHeight
        const wval = window.innerWidth || p?.initWidth
        if (hval) {
            setHeight(hval)
        }
        if (wval) {
            setWidth(wval)
        }
    }, [])

    useEffect(() => {
        if (!Utils.windowExists()) {
            return
        }
        const handleResize = () => {
            const curHeight = window.innerHeight
            if (!!curHeight && curHeight !== lastHeight.current) {
                lastHeight.current = curHeight
                setHeight(curHeight)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!Utils.windowExists()) {
            return
        }
        const handleResize = () => {
            const curHeight = window.innerHeight
            const curWidth = window.innerWidth
            if (!!curHeight && curHeight !== lastHeight.current) {
                lastHeight.current = curHeight
                setHeight(curHeight)
            }
            if (!!curWidth && curWidth !== lastWidth.current) {
                lastWidth.current = curWidth
                setWidth(curWidth)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return [width || 0, height || 0]
}
