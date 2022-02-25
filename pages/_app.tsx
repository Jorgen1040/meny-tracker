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
      <div className="container mx-auto w-3/4">
        <Component {...pageProps} />  
      </div>
    </>
  )
}

export default MyApp
