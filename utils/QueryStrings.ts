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
}
