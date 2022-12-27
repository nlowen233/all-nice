import React, { useEffect, useRef, useState } from 'react'
import { Utils } from '../utils/Utils'

export const useWindowHeight = (init?: number) => {
    const [height, setHeight] = useState<false | number>(false)
    const lastHeight = useRef<number>()

    useEffect(() => {
        const val = window.innerHeight || init
        if (val) {
            setHeight(val)
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

    return height || 0
}
