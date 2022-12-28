import Shopify from '@shopify/shopify-api'
import { ShopifyDataProductHandles } from '../types/api'
import { ShopifyDataFrontPage } from '../types/frontPageAPI'
import { APIRes } from '../types/misc'
import { ShopifyDataSingleProduct } from '../types/singleProductAPI'
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
    data: ShopifyDataFrontPage
}

const getFrontPage = (p?: GetFrontPageParams) =>
    callShopify<GetFrontPageRes>(`
{
	collection(handle:"frontpage") {
    products(first:${p?.amount || 20},sortKey: BEST_SELLING) {
    	nodes {
        id,
        description,
        title,
        handle,
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

export interface GetSingleProductParams {
    amount?: number
    handle: string
}

export interface GetSingleProductRes {
    data: ShopifyDataSingleProduct
}

const getSingleProduct = (p: GetSingleProductParams) =>
    callShopify<GetSingleProductRes>(
        `
    {
        product(handle:"${p.handle}"){
        handle,
        id,
        title,
        images(first:${p?.amount || 20}){
          nodes{
            url
          }
        },
        description,
        featuredImage{
          id
        },
        options(first:20){
          id,
          name,
          values
        },
        totalInventory,
        variants(first:100) {
            nodes{
              availableForSale,
              quantityAvailable,
              price{
                amount
              }
              selectedOptions{
                name,
                value
              }
            }
          }
      }
    }
    `
    )

export interface GetProductHandlesRes {
    data: ShopifyDataProductHandles
}

const getProductHandles = () =>
    callShopify<GetProductHandlesRes>(`
{
    collection(handle:"frontpage"){
      products(first:100){
        nodes{
          handle
              }
      }
    }
  }
  
`)

export interface CreateCustomerParams {
    email: string
    password: string
    firstName: string
    lastName: string
    acceptsEmailMarketing?: boolean
}

export interface CreateCustomerRes {
    data?: {
        id?: string | null
    }
    errors?: { message?: string }[]
}

const createCustomer = ({ email, firstName, lastName, password, acceptsEmailMarketing }: CreateCustomerParams) =>
    callShopify<CreateCustomerRes>(`
    mutation {
      customerCreate(input:{email:"${email}",password:"${password}",firstName:"${firstName}",lastName:"${lastName}",acceptsMarketing:${!!acceptsEmailMarketing}}){
         customer{
          id,
        }
      }
    }
`)

export interface LoginParams {
    email: string
    password: string
}

export interface LoginRes {
    data?: {
        customerAccessTokenCreate?: {
            customerAccessToken?: {
                accessToken?: string
                expiresAt?: string
            }
        }
        customerUserErrors?: {
            code?: string
            field?: string
            message?: string
        }[]
    }
    errors?: { message?: string }[]
}

const login = ({ email, password }: LoginParams) =>
    callShopify<LoginRes>(`
    mutation {
      customerAccessTokenCreate(input:{email:"${email}",password:"${password}"}){
        customerAccessToken{
          accessToken,
          expiresAt
        },
        customerUserErrors{
          code,
          field,
          message
        }
      }
    }
`)

export const API = {
    getFrontPage,
    getSingleProduct,
    getProductHandles,
    createCustomer,
    login,
}
