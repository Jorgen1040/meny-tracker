import clientPromise from "@lib/mongodb";
import ProductTile from "@components/products/ProductTile";
import { randomizeArray } from "@lib/utils";

export default function Home({offers}: {offers: any[]}) {
  console.log(offers);

  return (
    <>
      <div>
        <h1 className="text-3xl my-3">På tilbud nå (totalt {offers.length})</h1>
        <div className="flex w-full overflow-hidden gap-4">
          {
            offers.map((offer: any, index: number) => (
              <ProductTile key={index} product={offer} />
            ))
          }
        </div>
      </div>
      <div>
        <h1 className="text-3xl my-3">Nye produkter</h1>
        {/* 
          promotionDisplayName: "Nyhet!" 
          (isNew is never true)
        */}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const client = await clientPromise;
  const offersCursor = await client.db("meny")
                             .collection("products")
                             .find(
                                { "isOffer": true },
                                { "projection": { "_id": 0 } }
                              )
                             .toArray();
  
  const offers = offersCursor.map((offer: any) => {
    return offer;
  });

  return {
      props: { 
          offers: randomizeArray(offers)
      },
      // Revalidate after 10 minutes
      revalidate: 600
  }
}