import Shopify from '@shopify/shopify-api'
import { CustomerUserError, ShopifyDataProductHandles } from '../types/api'
import { ShopifyDataFrontPage } from '../types/frontPageAPI'
import { APIRes } from '../types/misc'
import { ShopifyDataSingleProduct } from '../types/singleProductAPI'
import { Constants } from './Constants'
import { Utils } from './Utils'

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
      customerUserErrors?: {
        code?: string
        field?: string
        message?: string
      }[]
    }
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

export interface ShopifyAddress {
  address1?: string
  address2?: string
  city?: string
  company?: string
  firstName?: string
  lastName?: string
  id?: string
  phone?: string
  zip?: string
  provinceCode?: string
}

export interface GetProfileParams {
  customerAccessToken: string
}

export interface GetProfileRes {
  errors?: { message?: string }[]
  data?: {
    customer?: {
      acceptsMarketing?: boolean | null
      createdAt?: string | null
      defaultAddress?: {
        id?: string
      }
      email?: string | null
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
      lastIncompleteCheckout?: {
        id?: string | null
      }
      orders?: {
        nodes: ShopifyOrder[]
      }
      addresses?: {
        nodes:ShopifyAddress[]
      }
    }
  }
}

export interface ShopifyOrder {
  fufillmentStatus?: string | null
  cancelReason?: string | null
  canceledAt?: string | null
  shippingAddress?: {
    id?: string | null
  }
  orderNumber?: number | null
  totalPrice?: {
    amount?: string | null
  }
  totalShippingPrice?: {
    amount?: string | null
  }
  totalTax?: {
    amount?: string | null
  }
  processedAt?: string | null
}

const getProfile = ({ customerAccessToken }: GetProfileParams) =>
  callShopify<GetProfileRes>(
    `
    {
      customer(customerAccessToken:"${customerAccessToken}"){
        acceptsMarketing,
        createdAt,
        defaultAddress {
          id
        },
        email,
        firstName,
        lastName,
        phone,
        lastIncompleteCheckout{
            id
        },
        orders(first:250){
          nodes{
            fulfillmentStatus,
            cancelReason,
            canceledAt,
            shippingAddress{
              id
            },
            currentTotalTax{
              amount
            },
            orderNumber,
            totalPrice{
              amount
            },
            totalShippingPrice{
              amount
            },
            totalTax{
              amount
            },
            processedAt
          }
        }
        addresses(first:250){
        nodes{
          address1,
          address2,
          city,
          firstName,
          lastName,
          provinceCode,
          zip,
          id,
          
        }
      }
      }
    }  
  `
  )

export interface UpdateCustomerParams {
  customerAccessToken: string
  customer: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
    acceptsMarketing?: boolean
  }
}

export interface UpdateCustomerRes {
  errors?: { message?: string }[]
  data?: {
    customerUpdate?: {
      customerUserErrors?: { message?: string; field?: string; code?: string }[]
    }
  }
}

const updateCustomer = ({ customer, customerAccessToken }: UpdateCustomerParams) =>
  callShopify<UpdateCustomerRes>(
    `
  mutation{
    customerUpdate(customerAccessToken:"${customerAccessToken}",customer:{${Utils.inject(customer)}}){
      customerUserErrors{
        message,
        field,
        code
     }
    }
  }
  `
  )

export interface GetAccountDetailsParams {
  customerAccessToken: string
}

export interface GetAccountDetailsRes {
  data?: {
    customer?: {
      acceptsMarketing?: boolean
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
    }
  }
  errors?: { message: string }[]
}

const getAccountDetails = ({ customerAccessToken }: GetAccountDetailsParams) =>
  callShopify<GetAccountDetailsRes>(`
{
  customer(customerAccessToken:"${customerAccessToken}"){
    acceptsMarketing,
    firstName,
    lastName,
    email,
    phone
	}
}
`)

export interface RecoverCustomerParams {
  email: string
}

export interface RecoverCustomerRes {
  data?: {
    customerRecover?: {
      customerUserErrors?: CustomerUserError[]
    }
  }
  errors?: { message: string }[]
}

const recoverAccount = ({ email }: RecoverCustomerParams) => callShopify<RecoverCustomerRes>(`
mutation {
  customerRecover(email:"${email}"){
    customerUserErrors{
      code,
      field,
      message
    }
  }
}
`)

export interface ResetPasswordParams {
  password: string
  id: string
  resetToken: string
}

export interface ResetPasswordRes {
  data?: {
    customerReset?: {
      customerAccessToken?: {
        accessToken?: string
        expiresAt?: string
      }
      customerUserErrors?: CustomerUserError[]
    }
  }
  errors?: { message: string }[]
}

const resetPassword = ({ password, id, resetToken }: ResetPasswordParams) => callShopify<ResetPasswordRes>(`
mutation {
  customerReset(id:"${id}",input:{resetToken:"${resetToken}",password:"${password}"}){
    customerAccessToken{
      accessToken,
      expiresAt
		}
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
  getProfile,
  updateCustomer,
  getAccountDetails,
  recoverAccount,
  resetPassword
}
