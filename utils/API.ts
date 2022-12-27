import { ShopifyCollection, ShopifyData } from '../types/api'
import { APIRes } from '../types/misc'
import { Constants } from './Constants'

async function callShopify<Res, Vars = {}>(query: string): Promise<APIRes<Res>> {
    if (!Constants.endPoint) {
        return {
            err: true,
            message: 'Missing API end point env variable',
        }
    }
    if (!Constants.token) {
        return {
            err: true,
            message: 'Missing API access token env variable',
        }
    }
    let raw: Response | undefined
    let error: string | undefined
    try {
        raw = await fetch(Constants.endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': Constants.token,
            },
            body: JSON.stringify({ query }),
        })
    } catch (err) {
        error = err as string
    }
    if (!!error) {
        return {
            err: true,
            message: error,
        }
    }
    let res: undefined | Res
    try {
        res = await raw?.json()
    } catch (err) {
        error = 'Could not parse JSON response'
    }
    if (!!error) {
        return {
            err: true,
            message: error,
        }
    }
    return {
        err: false,
        res,
    }
}

export interface GetFrontPageParams {
    amount?: number
}

export interface GetFrontPageRes {
    data: ShopifyData
}

const getFrontPage = (p?: GetFrontPageParams) =>
    callShopify<GetFrontPageRes>(`
{
	collection(handle:"frontpage") {
    products(first:${p?.amount||20},sortKey: BEST_SELLING) {
    	nodes {
        id,
        description,
        title,
        onlineStoreUrl,
        priceRange {
          maxVariantPrice {
            amount
          },
          minVariantPrice,{
			amount
          }
        }
        images(first:1) {
          nodes{
            url
          }
        }
      }
  	}
  }
}
`)

export const API = {
    getFrontPage,
}
