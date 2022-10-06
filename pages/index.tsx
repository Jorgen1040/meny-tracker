import clientPromise from "@lib/mongodb";
import ProductTile from "@components/products/ProductTile";
import { randomizeArray } from "@lib/utils";
import type { NextPageWithLayout } from "./_app";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { ReactElement } from "react";
import Link from "next/link";

const Home = ({
  offers,
  offerCount,
}: {
  offers: any[];
  offerCount: number;
}) => {
  return (
    <>
      <div>
        <h1 className="text-3xl my-3 font-semibold">
          På tilbud nå (totalt {offerCount})
        </h1>
        {/* TODO: Add a "carousel" here, and stop using flex for product tiles */}
        <div className="flex justify-center w-full overflow-hidden gap-4 p-8">
          {offers.map((offer: any, index: number) => (
            <ProductTile key={index} product={offer} />
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/tilbud">
            <a>
              <button className="hover:cursor-pointer text-center stroke-black hover:stroke-gray-600 hover:text-gray-600 font-semibold flex flex-col items-center">
                <span>Se alle tilbud</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 stroke-inherit"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </a>
          </Link>
        </div>
      </div>
      <div>
        <h1 className="text-3xl my-3 font-semibold">Nye produkter</h1>
        {/*
          promotionDisplayName: "Nyhet!"
          (isNew is never true)
          Make a new database with products added/removed (timeseries?), then use that to find the newest products (say 1 week)
        */}
      </div>
      <div>
        <h1 className="text-3xl my-3 font-semibold">Endringer</h1>
        {/*
          This would be a list of changes (think diff) with + and - symbols for products
          Use the new database to find the changes (timeseries?)
        */}
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Navbar />
      {page}
      <Footer fixedPlacement />
    </>
  );
};

export async function getStaticProps() {
  const client = await clientPromise;
  const offersCursor = await client
    .db("meny")
    .collection("products")
    .find({ isOffer: true }, { projection: { _id: 0 } })
    .limit(5)
    .toArray();

  let offers = offersCursor.map((offer: any) => {
    return offer;
  });

  const offerCount = await client
    .db("meny")
    .collection("products")
    .find({ isOffer: true })
    .count();
  offers = randomizeArray(offers);

  return {
    props: {
      offers,
      offerCount,
    },
    // Revalidate after 10 minutes
    revalidate: 600,
  };
}

export default Home;