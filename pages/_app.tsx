import '../styles/globals.css'
import Layout from '@components/Layout'
import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  // TODO: Add SEO
  // TODO: Add footer
  return (
    <>
      <Head>
        <title>Meny Tracker</title>
        <meta
          name="description"
          content="Spor prisene på Meny sine butikker, og få varslinger når ditt
          favorittprodukt er på tilbud!"
        />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <Layout>
        <div className="container mx-auto max-w-5xl">
          <Component {...pageProps} />
        </div>
      </Layout>
    </>
  );
}

export default MyApp
