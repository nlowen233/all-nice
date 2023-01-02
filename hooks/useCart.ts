import _, { DebouncedFunc } from 'lodash'
import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { BannerMessage, MessageBannerContext } from '../contexts/MessageBannerContext'
import { LoadState } from '../types/misc'
import {
    AddCartLineParams,
    API,
    CartRes,
    CreateCartParams,
    CreateOrAddCartLineParams,
    RemoveCartLine,
    ReomveCartLineParams,
    UpdateCartLine,
    UpdateCartLineParams,
} from '../utils/API'
import { Colors } from '../utils/Colors'
import { Constants } from '../utils/Constants'
import { Utils } from '../utils/Utils'

interface LoadStateNode {
    id: number
    loadState: LoadState
}

export interface CartHookReq<T> {
    params: T
    silent?: boolean
}

export interface UseCartSig {
    cart: CartRes | undefined
    Cart: {
        add: ({ params, silent }: CartHookReq<CreateOrAddCartLineParams>) => Promise<void>
        remove: ({ params, silent }: CartHookReq<RemoveCartLine>) => Promise<void>
        update: ({ params, silent }: CartHookReq<UpdateCartLine>) => Promise<void>
        get: ()=>Promise<void>
    }
    isCartUpdating: boolean
    cartDeletionID: string | undefined
}

export interface UseCartParams {
    pushBannerMessage: (msg: BannerMessage) => void
    token: string | undefined
}

export const useCart = ({ pushBannerMessage, token }: UseCartParams): UseCartSig => {
    const [isUpdatingCart, setIsUpdatingCart] = useState(false)
    const [cart, setCart] = useState<undefined | CartRes>(undefined)
    const [cartDeletionID, setCartDeletionID] = useState<string | undefined>(undefined)
    const subscribeToCart = (cartID?: string) => {
        if (cartID) {
            localStorage.setItem(Constants.ls_cartID, cartID)
            return true
        } else {
            return false
        }
    }
    const unsubscribeFromCart = () => {
        localStorage.removeItem(Constants.ls_cartID)
    }

    const add = async ({ params, silent }: CartHookReq<CreateOrAddCartLineParams>) => {
        if (params.isNewCart) {
            unsubscribeFromCart()
        }
        const derivedID = localStorage.getItem(Constants.ls_cartID) || cart?.id
        const needCreation = params.isNewCart || !derivedID
        setIsUpdatingCart(true)
        const res = needCreation
            ? await API.createCart({ line: params.item, customerAccessToken: token })
            : await API.addCartLine({ line: params.item, cartID: derivedID as string })
        const errors = res.res?.errors || []
        //@ts-ignore
        const userErrors = (needCreation ? res.res?.data?.cartCreate?.userErrors : res.res?.data?.cartLinesAdd?.userErrors) || []
        if (res.err || errors.length || userErrors.length) {
            !silent &&
                pushBannerMessage({
                    title: Constants.cartError(res.message || errors[0].message || userErrors[0]?.message),
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
        } else {
            //@ts-ignore
            setCart(needCreation ? res.res?.data?.cartCreate?.cart : res.res?.data?.cartLinesAdd?.cart)
            !silent &&
                pushBannerMessage({
                    title: 'Successfully added item(s) to cart',
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.success },
                })
            //@ts-ignore
            const newCartID = res.res?.data?.cartCreate?.cart?.id
            needCreation && subscribeToCart(newCartID)
        }
        setIsUpdatingCart(false)
    }
    const remove = async ({ params, silent }: CartHookReq<RemoveCartLine>) => {
        const cartID = cart?.id
        if (!cartID) {
            return
        }
        const { id } = params
        setIsUpdatingCart(true)
        setCartDeletionID(id)
        const res = await API.removeCartLine({ id, cartID })
        const errors = res.res?.errors || []
        const userErrors = res.res?.data?.cartLinesRemove?.userErrors || []
        if (res.err || errors.length || userErrors.length) {
            !silent &&
                pushBannerMessage({
                    title: Constants.cartError(res.message || errors[0].message || userErrors[0]?.message),
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
        } else {
            setCart(res.res?.data?.cartLinesRemove?.cart)
            !silent &&
                pushBannerMessage({
                    title: 'Successfully removed item(s) from cart',
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.success },
                })
        }
        setIsUpdatingCart(false)
        setCartDeletionID(undefined)
    }
    const update = async ({ params, silent }: CartHookReq<UpdateCartLine>) => {
        const cartID = cart?.id
        if (!cartID) {
            return
        }
        const { lineID, quantity } = params
        setIsUpdatingCart(true)
        const res = await API.updateCartLine({ cartID, lineID, quantity })
        const errors = res.res?.errors || []
        const userErrors = res.res?.data?.cartLinesUpdate?.userErrors || []
        if (res.err || errors.length || userErrors.length) {
            !silent &&
                pushBannerMessage({
                    title: Constants.cartError(res.message || errors[0].message || userErrors[0]?.message),
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
        } else {
            setCart(res.res?.data?.cartLinesUpdate?.cart)
            !silent &&
                pushBannerMessage({
                    title: 'Successfully updated quantity',
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.success },
                })
        }
        setIsUpdatingCart(false)
    }
    const get = async () => {
        const cartID = cart?.id || localStorage.getItem(Constants.ls_cartID)
        if (!cartID) {
            return
        }
        const res = await API.getCart({ id: cartID })
        const errors = res.res?.errors || []
        if (res.err || errors.length) {
            //on a specific error, we need to clear cart id from local storage and react
        } else {
            setCart(res.res?.data?.cart)
        }
    }
    const Cart = {
        add,
        remove,
        update,
        get
    }
    useEffect(() => {
        get()
    }, [])
    return {
        cart,
        Cart,
        isCartUpdating: isUpdatingCart,
        cartDeletionID,
    }
}
