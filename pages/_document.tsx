import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link crossOrigin="anonymous" rel="preload" as="font" href="/fonts/Raleway-Bold.ttf" />
                <link crossOrigin="anonymous" rel="preload" as="font" href="/fonts/Raleway-Regular.ttf" />
                <link crossOrigin="anonymous" rel="preload" as="font" href="/fonts/Raleway-Thin.ttf" />
                <link crossOrigin="anonymous" rel="preload" as="font" href="/fonts/Raleway-SemiBold.ttf" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
