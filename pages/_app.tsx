import '../styles/globals.css'
import Layout from '@components/Layout'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // TODO: Add SEO

  // Get page layout, or default to normal layout
  const getLayout =
    Component.getLayout ??
    (() => (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    ));

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
      {getLayout(
        <>
          <main className="container mx-auto max-w-5xl">
            <Component {...pageProps} />
          </main>
        </>
      )}
    </>
  );
}

export default MyApp
