import clientPromise from "@lib/mongodb";
import ProductTile from "@components/products/ProductTile";
import { randomizeArray } from "@lib/utils";

export default function Home({
  offers,
  offerCount,
}: {
  offers: any[];
  offerCount: number;
}) {
  return (
    <>
      <div>
        <h1 className="text-3xl my-3">På tilbud nå (totalt {offerCount})</h1>
        <div className="flex w-full overflow-hidden gap-4">
          {offers.map((offer: any, index: number) => (
            <ProductTile key={index} product={offer} />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-3xl my-3">Nye produkter</h1>
        {/*
          promotionDisplayName: "Nyhet!"
          (isNew is never true)
        */}
      </div>
      <div>
        <h1 className="text-3xl my-3">Endringer</h1>
        {/* This would be a list of changes (think diff) with + and - symbols for products */}
      </div>
    </>
  );
}

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