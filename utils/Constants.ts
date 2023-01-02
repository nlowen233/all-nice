import { Utils } from './Utils'

export const Constants = {
    menuBarHeight: 60,
    endPoint: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API,
    token: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    stdAutoCloseInterval: 7500,
    shortAutoCloseInterval: 3000,
    dateFmt: 'MM/DD/YYYY',
    dateTimeFmt: 'MM/DD/YYYY [at] HH:mm A',
    defaultCountry: 'United States',
    footerHeight: (screenWidth?: number) => {
        const width = screenWidth || 600
        if (width < 400) {
            return 200
        } else if (width < 800) {
            return 150
        } else {
            return 100
        }
    },
    screenWidthsm: 280,
    cartError: Utils.creatAPIMessageFunc('Cart update error'),
    ls_cartID: 'CART_ID',
    stdButtonSize: 200
}
