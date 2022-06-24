import clientPromise from "@lib/mongodb";

export default function Home({ saleItems }: { saleItems: any[] }) {
  return (
    <div>
      <h1 className="text-4xl font-semibold mt-12 text-center">Alle tilbud</h1>
      {/* <div className="flex w-full overflow-hidden gap-4 p-8">
          {offers.map((offer: any, index: number) => (
            <ProductTile key={index} product={offer} />
          ))}
        </div> */}
    </div>
  );
}

export async function getStaticProps() {
  const client = await clientPromise;
  const saleItems = await client
    .db("meny")
    .collection("products")
    .find({ isOffer: true }, { projection: { _id: 0 } })
    // .sort({ timestamp: 1 })
    .toArray();

  return {
    props: {
      saleItems,
    },
    // Revalidate after 10 minutes
    revalidate: 600,
  };
}
