export const QueryStrings = {
    cart: `
    totalQuantity,
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
      lines(first:250){
        nodes{
          id,
          quantity,
          cost{
            subtotalAmount{
              amount
            }
            totalAmount{
              amount
            }
          },
          merchandise {
            ... on ProductVariant {
              id,
              title,
              quantityAvailable,
              product {
                featuredImage {
                  url
                },
                title,
                handle
              }
            }
          }
        }
      }
    `,
    checkout: `
    checkout{
      createdAt,
      id,
      totalPrice{
        amount
      },
      subtotalPrice{
        amount
      },
      totalTax{
        amount
      }
    },
    checkoutUserErrors{
      code,
      field,
      message
    }
    `,
}
