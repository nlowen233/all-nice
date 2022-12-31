import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { MessageBannerContext } from '../contexts/MessageBannerContext'
import { LoadState } from '../types/misc'
import { AddCartLineParams, API, CartRes, CreateCartParams, CreateOrAddCartLineParams, ReomveCartLineParams } from '../utils/API'
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
        remove: ({ params, silent }: CartHookReq<ReomveCartLineParams>) => Promise<void>
    }
    isCartUpdating: boolean
}

export const useCart = (): UseCartSig => {
    const { token } = useContext(AuthContext)
    const { pushBannerMessage } = useContext(MessageBannerContext)
    const [mutateReqList, setMutateReqList] = useState<LoadStateNode[]>([])
    const [cart, setCart] = useState<undefined | CartRes>(undefined)
    const addReqToList = () => {
        const id = Utils.genid()
        setMutateReqList((arr) => [...arr, { id, loadState: 'loading' }])
        return id
    }
    const updateReqInList = (node: LoadStateNode) => {
        const index = mutateReqList.findIndex((n) => n.id === node.id)
        if (index === -1) {
            return
        }
        setMutateReqList((arr) => [...arr.slice(0, index), node, ...arr.slice(index + 1)])
    }
    const removeReqFromList = (id: number) => {
        const index = mutateReqList.findIndex((n) => n.id === id)
        if (index === -1) {
            return
        }
        setMutateReqList((arr) => [...arr.slice(0, index), ...arr.slice(index + 1)])
    }
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
        const reqid = addReqToList()
        const res = needCreation
            ? await API.createCart({ lines: params.lines, customerAccessToken: token })
            : await API.addCartLines({ lines: params.lines, cartID: derivedID as string })
        const errors = res.res?.errors || []
        const userErrors = res.res?.data?.cartCreate?.userErrors || []
        if (res.err || errors.length || userErrors.length) {
            !silent &&
                pushBannerMessage({
                    title: Constants.cartError(res.message || errors[0].message || userErrors[0]?.message),
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
            updateReqInList({ id: reqid, loadState: 'failure' })
        } else {
            setCart(res.res?.data?.cartCreate?.cart)
            !silent &&
                pushBannerMessage({
                    title: 'Successfully added item(s) to cart',
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.success },
                })
            updateReqInList({ id: reqid, loadState: 'success' })
            needCreation && subscribeToCart(res.res?.data?.cartCreate?.cart?.id)
        }
        removeReqFromList(reqid)
    }
    const remove = async ({ params, silent }: CartHookReq<ReomveCartLineParams>) => {
        const reqid = addReqToList()
        const { cartID, lines } = params
        const res = await API.removeCartLines({ lines, cartID })
        const errors = res.res?.errors || []
        const userErrors = res.res?.data?.cartCreate?.userErrors || []
        if (res.err || errors.length || userErrors.length) {
            !silent &&
                pushBannerMessage({
                    title: Constants.cartError(res.message || errors[0].message || userErrors[0]?.message),
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.error },
                })
            updateReqInList({ id: reqid, loadState: 'failure' })
        } else {
            setCart(res.res?.data?.cartCreate?.cart)
            !silent &&
                pushBannerMessage({
                    title: 'Successfully removed item(s) from cart',
                    autoClose: Constants.shortAutoCloseInterval,
                    styling: { backgroundColor: Colors.success },
                })
            updateReqInList({ id: reqid, loadState: 'success' })
        }
        removeReqFromList(reqid)
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
    const isCartUpdating = useMemo(() => !!mutateReqList.find((req) => req.loadState === 'loading'), [mutateReqList])
    const Cart = {
        add,
        remove,
    }
    useEffect(() => {
        get()
    }, [])
    return {
        cart,
        Cart,
        isCartUpdating,
    }
}
