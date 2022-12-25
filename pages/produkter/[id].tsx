import { useRouter } from 'next/router';
import clientPromise from "@lib/mongodb";
import pino from 'pino';
// TODO: Swap recharts with own implementation (3.js?) Maybe not?
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  ResponsiveContainer,
  AreaChart,
  Tooltip,
  ReferenceArea,
  Label,
} from "recharts";
import Loader from "@components/Loader";
import ProductView from "@components/products/ProductView";
import ProductTile from "@components/products/ProductTile";
import {
  ProductData,
  ProductViewData,
  ProductTileData,
} from "@lib/types/product";
import Head from "next/head";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      level: "debug",
    },
  },
});

function unixToDate(unix: number): string {
  return new Date(unix).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

interface Change {
  timestamp: number;
  pricePerUnit: number;
  isOffer: boolean;
  isLoweredPrice: boolean;
}

interface SaleRange {
  start: number;
  end?: number;
}

export default function Produkt({
  product,
  priceChanges,
  associated,
  saleRanges,
}: {
  product: ProductViewData;
  priceChanges: Change[];
  associated: ProductTileData[];
  saleRanges: SaleRange[];
}) {
  const router = useRouter();

  // Handle loading page
  if (router.isFallback) {
    return (
      <div className="grid place-items-center mt-80">
        <Loader show />
      </div>
    );
  }

  // Iterate over priceChanges and add missing values
  // If there is a change loop over the entire array again
  // TODO: Move all this logic over to the server
  for (let i = 0; i < priceChanges.length; i++) {
    const change = priceChanges[i];
    const nextChange = priceChanges[i + 1];
    if (nextChange && nextChange.timestamp - change.timestamp > 86400000) {
      priceChanges.splice(i + 1, 0, {
        timestamp: change.timestamp + 86400000,
        pricePerUnit: change.pricePerUnit,
        isOffer: change.isOffer,
        isLoweredPrice: change.isLoweredPrice,
      });
    }
    // Fill in data up to current date
    if (!nextChange && Date.now() - change.timestamp > 86400000) {
      priceChanges.splice(i + 1, 0, {
        timestamp: change.timestamp + 86400000,
        pricePerUnit: change.pricePerUnit,
        isOffer: change.isOffer,
        isLoweredPrice: change.isLoweredPrice,
      });
    }
  }
  // Dedupe
  priceChanges.forEach((change, index) => {
    const prevChange = priceChanges[index - 1];
    const nextChange = priceChanges[index + 1];
    if (
      prevChange &&
      nextChange &&
      unixToDate(change.timestamp) === unixToDate(nextChange.timestamp)
    ) {
      // Remove the price that didn't change
      if (
        prevChange.pricePerUnit === change.pricePerUnit &&
        nextChange.pricePerUnit !== change.pricePerUnit
      ) {
        priceChanges.splice(index, 1);
      }
    }
  });
  // TODO: Show important times in graph (highlight areas with sales)
  return (
    <>
      <Head>
        <title>Priser for {product.title} - Meny Tracker</title>
      </Head>
      <ProductView product={product} />
      <div>
        <h1 className="text-2xl my-3">Prishistorikk</h1>
        {/* TODO: Identify graphical issue (ex. id: 7037610008532) */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={priceChanges}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timeStr) => unixToDate(timeStr)}
              // TODO: Figure out a way to make axis dates more readable (smaller intervals)
              // interval="preserveEnd"
              // TODO: Maybe calculate this somehow to fit future sales?
              // padding={{ left: 0, right: 30 }}
            />
            <YAxis dataKey="pricePerUnit" />
            <Tooltip
              separator=": "
              formatter={(value: string) => `${value.replace(".", ",")}`}
              labelFormatter={(timeStr) => unixToDate(timeStr)}
            />
            {/* linear or monotone? */}
            <Area
              type="linear"
              dataKey="pricePerUnit"
              stroke="#8884d8"
              name="Pris"
              unit=" kr"
            />
            {saleRanges.map((saleRange) => (
              // console.log(saleRange),
              // TODO: Make sure sale area doesn't overlap price increase after sale end
              <ReferenceArea
                key={saleRange.start}
                x1={saleRange.start}
                x2={saleRange.end ? saleRange.end : undefined}
                fill="orange"
                fillOpacity={0.3}
              >
                <Label value="Salg" position="insideBottomLeft" opacity={0.6} />
              </ReferenceArea>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-12">
        <h1 className="text-2xl my-3">Lignende produkter</h1>
        {/* TODO: Find our own associated products in case they don't exist in database */}
        {associated.length > 0 ? (
          <div className="sm:flex justify-center px-8 md:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5 max-w-none sm:max-w-2xl lg:max-w-none">
              {associated.map((product: any, index: number) => (
                <ProductTile key={index} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <h1 className="text-xl text-red-400 mb-[4.5rem]">
            Fant ingen lignende produkter
          </h1>
        )}
      </div>
    </>
  );
}

interface Params {
  params: {
    id: string;
  };
}

export async function getStaticProps({ params }: Params) {
  const { id } = params;
  logger.info("Getting produkt with EAN: " + id);
  const client = await clientPromise;
  // Get the product with the provided EAN
  const product = await client
    .db("meny")
    .collection("products")
    .findOne<ProductData>(
      { ean: id },
      {
        projection: {
          _id: 0,
          ean: 1,
          title: 1,
          subtitle: 1,
          description: 1,
          slugifiedUrl: 1,
          pricePerUnit: 1,
          pricePerUnitOriginal: 1,
          comparePricePerUnit: 1,
          compareUnit: 1,
          isOffer: 1,
          isLoweredPrice: 1,
          associated: 1,
        },
      }
    );
  // logger.info(product);

  // If no product was found, return nothing
  if (!product) return { notFound: true };

  // Get all associated product documents
  const associatedList: ProductTileData[] = [];
  // ? not all products have an associated list for some reason (newly added products?)
  if (product.associated) {
    const associated_ids = product.associated.products.slice(0, 10);
    const associatedProducts = await client
      .db("meny")
      .collection("products")
      .find<ProductTileData>(
        { ean: { $in: associated_ids } },
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
            isLoweredPrice: 1,
          },
        }
      )
      .toArray();
    associatedList.push(...associatedProducts);
  }

  // Get all the price changes for the product
  const prices_cursor = client
    .db("meny")
    .collection("prices")
    .find({ "metadata.ean": id }, { projection: { _id: 0 } })
    .sort({ timestamp: 1 });

  // Generate priceChanges array
  // TODO: Optimize this
  let priceChanges: Change[] = await prices_cursor
    .map((item) => {
      return {
        timestamp: item.timestamp.getTime(),
        pricePerUnit: item.pricePerUnit.toFixed(2),
        isOffer: item.isOffer?.toString() === "true",
        isLoweredPrice: item.isLoweredPrice?.toString() === "true",
      };
    })
    .toArray();

  let saleRanges: SaleRange[] = [];
  // Go through priceChanges and find timestamps between isOffer
  // TODO: Calculate isLoweredPrice for the items with only isOffer
  for (let i = 0; i < priceChanges.length; i++) {
    const change = priceChanges[i];
    if (change.isOffer) {
      // Calculate if price is lowered from the previous change
      const previousChange = priceChanges[i - 1];
      if (previousChange) {
        if (change.pricePerUnit < previousChange.pricePerUnit) {
          change.isLoweredPrice = true;
        }
      }
    }
    if (change.isLoweredPrice) {
      // Only display sale if after fixing database script
      if (change.timestamp > 1654394419000) {
        for (let j = i; j < priceChanges.length; j++) {
          const nextChange = priceChanges[j];
          if (!nextChange.isLoweredPrice) {
            saleRanges.push({
              start: change.timestamp,
              end: nextChange.timestamp,
            });
            i = j;
            break;
          }
          if (j === priceChanges.length - 1) {
            // TODO: Display future sale end date (if included in product.promotions[n].to)
            // ? Can be checked by finding item in promotions that's promotions[n].isMarketed
            // ? Might have to set up a blacklist of certain promotion IDs that don't affect price (ex. Jacobs utvalgte)
            // ? Add a dotted line up until end of sale (expected price)
            saleRanges.push({
              start: change.timestamp,
            });
          }
        }
      }
    }
  }
  // console.log(saleRanges);

  // Remove associated from the final product output to the usr since it's no longer needed
  const { associated, ...finalProduct } = product;

  return {
    props: {
      product: finalProduct as ProductViewData,
      priceChanges,
      associated: associatedList,
      saleRanges,
    },
    // Revalidate after 10 minutes
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  // const client = await clientPromise;
  // const products = client.db("meny")
  //                        .collection("products")
  //                        .find({}, { "projection": { "_id": 0, "ean": 1 }});

  // logger.info("Got database response")
  // let paths = [];
  // for await (const item of products) {
  //     paths.push({params: {id: item.ean}});
  // }
  // logger.info("finished getting paths")
  const paths = [{ params: { id: "2000467100006" } }];

  return {
    paths,
    // Fallback true allows for a loading page while page gets generated
    fallback: true,
  };
}