import dayjs from 'dayjs'
import Dinero from 'dinero.js'
import { Primitive } from '../types/misc'

const windowExists = () => typeof window === 'object' && window !== null
const displayPriceRange = (min?: string, max?: string) => {
    const [nmin, nmax] = [Number(min) * 100, Number(max) * 100]
    if (nmax === nmin) {
        return Dinero({ amount: nmax, precision: 2 }).toFormat('$0,0.00')
    } else {
        return `${Dinero({ amount: nmin }).toFormat('$0,0.00')} - ${Dinero({ amount: nmax }).toFormat('$0,0.00')}`
    }
}
const displayPrice = (price?: string, quantity?: number) => {
    const numberPrice = Number(price)
    if (Number.isNaN(numberPrice)) {
        return ''
    }
    return Dinero({ amount: numberPrice * 100, precision: 2 })
        .multiply(quantity || 1)
        .toFormat('$0,0.00')
}

const storeToken = (value?: string, expDate?: string) => {
    if (!value || !expDate) {
        return
    }
    localStorage.setItem('TOKEN', value)
    localStorage.setItem('EXPDATE', expDate)
}

const getToken = () => {
    const token = localStorage.getItem('TOKEN')
    const expDate = localStorage.getItem('EXPDATE')
    if (!!expDate && dayjs(expDate).isBefore(dayjs())) {
        clearToken()
        return [undefined, undefined]
    }
    return [token || undefined, expDate || undefined]
}

const clearToken = () => {
    localStorage.removeItem('EXPDATE')
    localStorage.removeItem('TOKEN')
}

export interface DisplayAddressParams {
    city?: string | null
    zip?: string | null
    stateCode?: string | null
}

const displayAddress = ({ city, stateCode, zip }: DisplayAddressParams) =>
    city || zip || stateCode ? `${city || 'Unknown City'} ${stateCode || '??'} ${zip || 'Unknown Zip'}` : ``

export interface InjectOptions {
    allowEmptyStrings: boolean
}

const inject = (r: Record<string, Primitive>, p?: InjectOptions) => {
    const keys = Object.keys(r)
    return keys
        .filter((key) => {
            let rawVal = r[key]
            return !!p?.allowEmptyStrings ? rawVal !== null && rawVal !== undefined : !!rawVal || rawVal === false
        })
        .map((key) => {
            let rawVal = r[key]
            if (typeof rawVal === 'string') {
                rawVal = `"${rawVal}"`
            }
            return `${key}:${rawVal}`
        })
        .join(',')
}

const standardizePhone = (s?: string) => {
    if (!s) {
        return ''
    }
    if (s.includes('+')) {
        return s
    } else {
        return `+${s}`
    }
}

const getIDFromShopifyGid = (gid?: string) => {
    if (!gid) {
        return undefined
    }
    const index = gid.lastIndexOf('/')
    const qindex = gid.indexOf('?')
    return gid.substring(index + 1, qindex !== -1 ? qindex : undefined)
}

const genid = () => Math.floor(Math.random() * 10000000)

const creatAPIMessageFunc = (title: string, fallbackMessage?: string) => (error?: string) =>
    `${title}:${error || fallbackMessage || 'Unknown Error'}`

export const Utils = {
    windowExists,
    displayPriceRange,
    displayPrice,
    getToken,
    storeToken,
    clearToken,
    displayAddress,
    inject,
    standardizePhone,
    getIDFromShopifyGid,
    genid,
    creatAPIMessageFunc,
}
