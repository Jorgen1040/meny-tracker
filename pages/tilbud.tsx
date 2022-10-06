import Loader from "@components/Loader";
import ProductTile from "@components/products/ProductTile";
import clientPromise from "@lib/mongodb";
import { useRouter } from "next/router";

export default function Home({ offers }: { offers: any[] }) {
  const router = useRouter();
  // Handle loading page
  if (router.isFallback) {
    return (
      <div className="grid place-items-center mt-80">
        <Loader show />
      </div>
    );
  }

  // TODO: Add sorting options, allergens
  return (
    <div>
      <h1 className="text-4xl font-semibold mt-12 text-center">Alle tilbud</h1>
      <div className="grid grid-cols-5 gap-4 p-8">
        {offers.map((offer: any, index: number) => (
          <ProductTile key={index} product={offer} />
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const client = await clientPromise;
  const offers = await client
    .db("meny")
    .collection("products")
    .find(
      { isOffer: true },
      {
        projection: {
          _id: 0,
          ean: 1,
          title: 1,
          subtitle: 1,
          pricePerUnit: 1,
          pricePerUnitOriginal: 1,
          comparePricePerUnit: 1,
          compareUnit: 1,
          isOffer: 1,
        },
      }
    )
    // .sort({ timestamp: 1 })
    .toArray();

  return {
    props: {
      offers,
    },
    // Revalidate after 10 minutes
    revalidate: 600,
  };
}
