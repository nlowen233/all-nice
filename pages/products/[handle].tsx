import Typography from '@mui/material/Typography'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Carousel } from '../../components/Carousel'
import { OptionSwiper } from '../../components/OptionSwiper'
import { QuantityButton } from '../../components/QuantityButton'
import { APIRes } from '../../types/misc'
import { API, GetSingleProductRes } from '../../utils/API'
import { Colors } from '../../utils/Colors'
import { Utils } from '../../utils/Utils'
import Button from '@mui/material/Button'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

const SIZE_KEY = 'Size'
const COLOR_KEY = 'Color'

type Props = {
    res: APIRes<GetSingleProductRes>
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
    const res = await API.getSingleProduct({ handle: context?.params?.handle as string })
    return {
        props: {
            res,
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const res = await API.getProductHandles()
    const paths = res.res?.data.collection?.products?.nodes?.map((p) => ({ params: { handle: p.handle || '' } })) || []
    return {
        paths,
        fallback: false,
    }
}

export default function Product({ res }: Props) {
    const product = res.res?.data.product
    const sizes = product?.options?.find((o) => o.name === SIZE_KEY)?.values || []
    const colors = product?.options?.find((o) => o.name === COLOR_KEY)?.values || []
    const variants = product?.variants?.nodes
    const router = useRouter()
    const [index, setIndex] = useState(0)
    const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0])
    const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[Math.floor(sizes.length / 2)])
    const [quantity, setQuantity] = useState(1)
    const selectedVariant = variants?.find((variant) => {
        const sizeVal = variant.selectedOptions?.find((o) => o.name === SIZE_KEY)?.value
        const colorVal = variant.selectedOptions?.find((o) => o.name === COLOR_KEY)?.value
        return sizeVal === selectedSize && colorVal === selectedColor
    })
    const selectedVariantPrice = selectedVariant?.price?.amount || undefined
    return (
        <>
            <Head>
                <title>{product?.title || 'All Nice Clothing Product'}</title>
                <meta name="description" content={`Images, description, purchasing for ${product?.title}`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    type="text/css"
                    charSet="UTF-8"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                />
            </Head>
            <Carousel
                items={product?.images?.nodes?.map((n) => ({ id: n.url || '', imgURL: n.url || '' })) || []}
                activeIndex={index}
                setActiveIndex={setIndex}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ paddingLeft: 10 }}>
                    <Typography variant="h2" color="primary" fontSize={'1.6em'} fontWeight="bold">
                        {product?.title || 'Unknown Product'}
                    </Typography>
                    <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.light, paddingLeft: 10 }}>
                        All Nice Clothing
                    </Typography>
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                    <Typography variant="h3" fontSize={'1.3em'} style={{ color: Colors.light, paddingRight: 10, paddingTop: 6 }}>
                        {!!selectedVariantPrice && Utils.displayPrice(selectedVariantPrice, quantity)}
                    </Typography>
                </div>
            </div>
            <Typography variant="h5" fontSize={'1.2em'} style={{ color: Colors.dark, fontWeight: 'bold', paddingLeft: 10 }}>
                Size
            </Typography>
            <OptionSwiper onClickOption={setSelectedSize} options={sizes} selectedOption={selectedSize} />
            <Typography variant="h5" fontSize={'1.2em'} style={{ color: Colors.dark, fontWeight: 'bold', paddingLeft: 10 }}>
                Color
            </Typography>
            <OptionSwiper onClickOption={setSelectedColor} options={colors} selectedOption={selectedColor} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <QuantityButton onChange={(n) => setQuantity((q) => q + n)} value={quantity} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button variant="contained" endIcon={<AddShoppingCartIcon />} color="primary" sx={{ width: 200 }}>
                    Add to Cart
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <Button variant="contained" color="primary" sx={{ width: 200 }}>
                    Buy Now
                </Button>
            </div>
            <div>
                <Typography
                    variant="h5"
                    fontSize={'1.2em'}
                    style={{ color: Colors.dark, fontWeight: 'bold', paddingLeft: 10, marginTop: 10 }}
                >
                    Product Description
                </Typography>
                <Typography variant="subtitle1" fontSize={'1em'} style={{ color: Colors.mid, paddingLeft: 15, paddingRight: 15 }}>
                    {product?.description}
                </Typography>
            </div>
        </>
    )
}
