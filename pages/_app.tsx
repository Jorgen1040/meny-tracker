import '../styles/globals.css'
import Layout from '@components/Layout'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { NextPage } from "next";
import Router from "next/router";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // TODO: Add SEO

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => setLoading(true));
    Router.events.on("routeChangeComplete", () => setLoading(false));
    Router.events.on("routeChangeError", () => setLoading(false));
    return () => {
      Router.events.off("routeChangeStart", () => setLoading(true));
      Router.events.off("routeChangeComplete", () => setLoading(false));
      Router.events.off("routeChangeError", () => setLoading(false));
    };
  });

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
      {loading ? (
        <>
          <Navbar />
          <div className="grid place-items-center mt-80">
            <Loader show />
          </div>
          <Footer fixedPlacement={true} />
        </>
      ) : (
        getLayout(
          <>
            <main className="container mx-auto max-w-5xl">
              <Component {...pageProps} />
            </main>
          </>
        )
      )}
    </>
  );
}

export default MyApp
