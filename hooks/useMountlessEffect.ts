import React, { useEffect, useRef } from 'react'

export const useMountlessEffect = (callback: () => void, deps: React.DependencyList) => {
    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) {
            callback()
        } else {
            didMount.current = true
        }
    }, deps)
}
