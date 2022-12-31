import { ShopifyDataProductHandles, ShopifyUserError } from '../types/api'
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
                nodes: ShopifyAddress[]
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
    id?: string
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
            id,
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
            customerUserErrors?: ShopifyUserError[]
        }
    }
    errors?: { message: string }[]
}

const recoverAccount = ({ email }: RecoverCustomerParams) =>
    callShopify<RecoverCustomerRes>(`
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
            customerUserErrors?: ShopifyUserError[]
        }
    }
    errors?: { message: string }[]
}

const resetPassword = ({ password, id, resetToken }: ResetPasswordParams) =>
    callShopify<ResetPasswordRes>(`
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

export interface ChangeDefaultAddressParams {
    customerAccessToken: string
    addressID: string
}

export interface ChangeDefaultAddressRes {
    data?: {
        customerDefaultAddressUpdate?: {
            customerUserErrors?: ShopifyUserError[]
        }
    }
    errors?: { message: string }[]
}

const changeDefaultAddress = ({ addressID, customerAccessToken }: ChangeDefaultAddressParams) =>
    callShopify<ChangeDefaultAddressRes>(
        `
mutation{
  customerDefaultAddressUpdate(customerAccessToken:"${customerAccessToken}",addressId:"${addressID}"){
    customerUserErrors{
      code,
      field,
      message
		}
	}
}
`
    )

export interface DeleteAddressParams {
    customerAccessToken: string
    addressID: string
}

export interface DeleteAddressRes {
    data?: {
        customerAddressDelete?: {
            deletedCustomerAddressId?: string
        }
    }
    errors?: { message: string }[]
}

const deleteAddress = ({ addressID, customerAccessToken }: DeleteAddressParams) =>
    callShopify<DeleteAddressRes>(
        `
mutation{
  customerAddressDelete(id:"${addressID}",customerAccessToken:"${customerAccessToken}"){
    deletedCustomerAddressId
	}
}
`
    )

export interface UpdateAddressParams {
    customerAccessToken: string
    addressID: string
    address: {
        address1?: string
        address2?: string
        city?: string
        company?: string
        firstName?: string
        lastName?: string
        phone?: string
        zip?: string
        province?: string
    }
}

export interface UpdateAddressRes {
    data?: {
        customerAddressUpdate?: {
            customerUserErrors?: ShopifyUserError[]
        }
    }
    errors?: { message: string }[]
}

const updateAddress = ({ address, addressID, customerAccessToken }: UpdateAddressParams) =>
    callShopify<UpdateAddressRes>(`
mutation{
  customerAddressUpdate(customerAccessToken:"${customerAccessToken}",id:"${addressID}",address:{${Utils.inject(address)}}){
    customerUserErrors{
      code,
      field,
      message
    }
  }
}
`)

export interface CreateAddressParams {
    customerAccessToken: string
    address: {
        address1?: string
        address2?: string
        city?: string
        company?: string
        firstName?: string
        lastName?: string
        phone?: string
        zip?: string
        province?: string
    }
}

export interface UpdateCreateAddressReq {
    address1?: string
    address2?: string
    city?: string
    company?: string
    firstName?: string
    lastName?: string
    phone?: string
    zip?: string
    province?: string
    markDefault?: boolean
    id?: string
}

export interface CreateAddressRes {
    data?: {
        customerAddressCreate?: {
            customerAddress?: {
                id?: string
            }
            customerUserErrors?: ShopifyUserError[]
        }
    }
    errors?: { message: string }[]
}

const createAddress = ({ address, customerAccessToken }: CreateAddressParams) =>
    callShopify<CreateAddressRes>(
        `
mutation{
  customerAddressCreate(customerAccessToken:"${customerAccessToken}",address:{${Utils.inject({
            ...address,
            country: Constants.defaultCountry,
        })}}){
    customerAddress{
      id
    }
    customerUserErrors{
      code,
      field,
      message
    }
  }
}
`
    )

export interface GetOrderParams {
    customerAccessToken: string
    orderID: string
}
export interface ShopifyMoney {
    amount?: string
}
export interface ShopifyOrderDetail extends ShopifyOrder {
    fufillmentStatus?: string
    financialStatus?: string
    cancelReason?: string
    canceledAt?: string
    orderNumber?: number
    totalPrice?: ShopifyMoney
    totalShippingPrice?: ShopifyMoney
    totalTax?: ShopifyMoney
    processedAt?: string
    shippingAddress?: ShopifyAddress
    id?: string
    subtotalPrice?: ShopifyMoney
    lineItems?: {
        nodes?: ShopifyLineItem[]
    }
}

export interface ShopifyLineItem {
    quantity?: number
    title?: string
    originalTotalPrice?: ShopifyMoney
    discountedTotalPrice?: ShopifyMoney
    variant?: {
        sku?: string
        price?: ShopifyMoney
    }
}

export interface GetOrderRes {
    data?: {
        customer?: {
            orders?: {
                nodes?: ShopifyOrderDetail[]
            }
        }
    }
    errors?: { message: string }[]
}

const getOrder = async ({ customerAccessToken, orderID }: GetOrderParams) => {
    const res = await callShopify<GetOrderRes>(`
{
    customer(customerAccessToken: "${customerAccessToken}") {
      orders(first: 250) {
        nodes {
          id
          orderNumber
          processedAt
          fulfillmentStatus
          financialStatus
          shippingAddress {
            address1
            address2
            city
            company
            firstName
            lastName
            id
            provinceCode
            zip
          }
          totalPrice {
            amount
          }
          totalTax {
            amount
          }
          totalShippingPrice {
            amount
          }
          subtotalPrice {
            amount
          }
          lineItems(first:250) {
            nodes {
              quantity
              title
              originalTotalPrice {
                amount
              }
              discountedTotalPrice {
                amount
              }
              variant {
                sku,
                price{
                    amount
                  }
              }
            }
          }
        }
      }
    }
  }
`)
    return res.res?.data?.customer?.orders?.nodes?.find((node) => Utils.getIDFromShopifyGid(node.id) === orderID)
}

export interface CreateOrAddCartLineParams {
    isNewCart?: boolean
    lines: {
        merchandiseId: string
        quantity: number
    }[]
}

export interface CreateCartParams {
    customerAccessToken?: string
    lines: {
        quantity: number
        merchandiseId: string
    }[]
}

export interface MutateCartRes {
    data?: {
        cartCreate?: {
            cart?: CartRes
            userErrors?: ShopifyUserError[]
        }
    }
    errors?: { message: string }[]
}

const createCart = ({ customerAccessToken, lines }: CreateCartParams) =>
    callShopify<MutateCartRes>(`
mutation {
  cartCreate(input: {${!!customerAccessToken ? `buyerIdentity: {customerAccessToken: "${customerAccessToken}"},` : ``}lines:[${lines
        .map((line) => `{${Utils.inject(line)}}`)
        .join(',')}]}) {
    cart {
      buyerIdentity{
        customer{
          id
        }
      }
      cost{
        subtotalAmount{
          amount
        }
        totalAmount{
          amount
        }
        totalTaxAmount{
          amount
        } 
      }
      createdAt,
      id,
      lines{
        nodes{
          cost{
            subtotalAmount{
              amount
            }
            totalAmount{
              amount
            }
          },
          merchandise{
            __typename
          },
        }
      }
    }
    userErrors {
      code
      field
      message
    }
  }
}

`)

export interface CartRes {
    totalQuantity?: number
    buyerIdentity?: {
        customer?: {
            id?: string
        }
    }
    cost?: {
        subtotalAmount?: ShopifyMoney
        totalAmount?: ShopifyMoney
        totalTaxAmount?: ShopifyMoney
    }
    createdAt?: string
    id?: string
    lines?: {
        nodes?: ShopifyCartLine[]
    }
}

export interface GetCartParams {
    id: string
}

export interface GetCartRes {
    data?: {
        cart?: CartRes
    }
    errors?: { message: string }[]
}

export interface ShopifyCartLine {
    cost?: {
        subtotalAmount?: ShopifyMoney
        totalAmount?: ShopifyMoney
    }
    merchandise?: any
}

const getCart = ({ id }: GetCartParams) =>
    callShopify<GetCartRes>(`
{
  cart(id:"${id}"){
    buyerIdentity{
      customer{
        id
      }
    }
    cost{
      subtotalAmount{
        amount
      }
      totalAmount{
        amount
      }
      totalTaxAmount{
        amount
      } 
    }
    createdAt,
    id,
    lines{
      nodes{
        cost{
          subtotalAmount{
            amount
          }
          totalAmount{
            amount
          }
        },
        merchandise{
          __typename
        },
      }
    }
	}
}
`)

export interface AddCartLineParams {
    cartID: string
    lines: {
        merchandiseId: string
        quantity: number
    }[]
}

const addCartLines = ({ lines, cartID }: AddCartLineParams) =>
    callShopify<MutateCartRes>(`
mutation {
  cartLinesAdd(cartId:"${cartID}",lines:[${lines.map((line) => `{${Utils.inject(line)}}`).join(',')}]){
    cart{
      buyerIdentity{
        customer{
          id
        }
      }
      cost{
        subtotalAmount{
          amount
        }
        totalAmount{
          amount
        }
        totalTaxAmount{
          amount
        } 
      }
      createdAt,
      id,
      lines{
        nodes{
          cost{
            subtotalAmount{
              amount
            }
            totalAmount{
              amount
            }
          },
          merchandise{
            __typename
          },
        }
      }
    }
    userErrors{
      code,
      field,
      message
    }
  }
}
`)

export interface ReomveCartLineParams {
    cartID: string
    lines: string[]
}

const removeCartLines = ({ cartID, lines }: ReomveCartLineParams) =>
    callShopify<MutateCartRes>(`
mutation{
  cartLinesRemove(cartId:"${cartID}",lineIds:[${lines.map((line) => `"${line}"`).join(',')}]){
    cart{
      buyerIdentity{
        customer{
          id
        }
      }
      cost{
        subtotalAmount{
          amount
        }
        totalAmount{
          amount
        }
        totalTaxAmount{
          amount
        } 
      }
      createdAt,
      id,
      lines{
        nodes{
          cost{
            subtotalAmount{
              amount
            }
            totalAmount{
              amount
            }
          },
          merchandise{
            __typename
          },
        }
      }
    }
    userErrors{
      code,
      field,
      message
    }
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
    resetPassword,
    changeDefaultAddress,
    deleteAddress,
    updateAddress,
    createAddress,
    getOrder,
    createCart,
    getCart,
    addCartLines,
    removeCartLines,
}
