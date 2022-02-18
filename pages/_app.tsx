import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Meny Tracker</title>
        <meta name="description" content="Se prisene på Meny" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
