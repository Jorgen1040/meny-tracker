import { useRouter } from 'next/router';
import clientPromise from '@lib/mongodb';
import dynamic from 'next/dynamic';
import pino from 'pino';
// TODO: Swap recharts with own implementation (3.js?)
import { CartesianGrid, LineChart, XAxis, YAxis, Area, ResponsiveContainer, AreaChart, Tooltip } from 'recharts';
// TODO: Use alternative for moment
import moment from 'moment';
import Loader from '@components/Loader';
import ProductView from '@components/products/ProductView';
import ProductTile from '@components/products/ProductTile';


const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            level: "debug",
        }
    }
});

interface Change {
    timestamp: number;
    pricePerUnit: number;
}

export default function Produkt({ product, priceChanges, associated }: { product: any, priceChanges: Change[], associated: any }) {
    const router = useRouter();
    const { id } = router.query;
    
    // Handle loading page
    if (router.isFallback) {
        return (
            <div className="grid place-items-center h-screen">
                <Loader show />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="grid h-screen">
                <div>
                    <h1 className="text-center text-5xl text-red-400 my-32">Produktet finnes ikke</h1>
                    {/* <h1 className="text-center">Leter du etter disse?</h1> */}
                    {/* TODO: Vis liste med produkter via Atlas Search med query */}
                </div>
            </div>
        )
    }

    // console.log(product);
    // console.log(priceChanges);
    // Add missing values to priceChanges
    // Compare timestamp and if it's not changed in a day, add same price inbetween
    // priceChanges.forEach((change, index, priceChanges) => {
    //     const nextChange = priceChanges[index + 1];
    //     if (!nextChange) {
    //         return;
    //     }
    //     const diff = nextChange.timestamp - change.timestamp;
    //     if (diff > 86400000) {
    //         const newChange = {
    //             timestamp: change.timestamp + 86400000,
    //             pricePerUnit: change.pricePerUnit
    //         }
    //         priceChanges.splice(index + 1, 0, newChange);
    //         console.log(priceChanges)
    //     }
    // });
    // associated.map((product: any, index: number) => (
    //     // <ProductTile key={index} product={product} />
    //     console.log(`${index} ${product.title} ${product.pricePerUnit.toFixed(2)} ${product.comparePricePerUnit.toFixed(2)}`)
    // ))
    // TODO: Make the graph look nicer (don't use stepAfter, fill in the gaps instead)
    return (
        <>
            <div className="container mx-auto w-3/4">
                <ProductView product={product} />
                <div>
                    <h1 className="text-2xl my-3">Prishistorikk</h1>
                    <ResponsiveContainer width="100%" height={300} >
                        <AreaChart
                        data={priceChanges.reverse()}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" tickFormatter={timeStr => moment(timeStr).format('DD.MM.YY')} />
                            <YAxis dataKey="pricePerUnit" />
                            <Tooltip />
                            <Area type="stepAfter" connectNulls={true} dataKey="pricePerUnit" stroke="#8884d8" name="Pris" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h1 className="text-2xl my-3">Lignende produkter</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                        {
                            //console.log(product.associated.products)
                    
                            associated.map((product: any, index: number) => (
                                <ProductTile key={index} product={product} />
                            ))
                            
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

interface Params {
    params: {
        id: string;
    }
}

export async function getStaticProps({ params }: Params) {
    const { id } = params;
    logger.info("Getting produkt with EAN: " + id);
    const client = await clientPromise;
    // Get the first product with the provided EAN (this will be used to store all information except price in the future)
    const product = await client.db("meny")
                                .collection("products")
                                .findOne(
                                    {"ean": id},
                                    {"projection": {"_id": 0}}
                                );
    
    // If no product was found, return nothing
    if (!product) {
        return {
            props: {}
        }
    }

    // Get all associated product documents
    const associated: any[] = [];
    product.associated.products.forEach(async (id: string, index: number) => {
        const product = await client.db("meny")
                                    .collection("products")
                                    .findOne(
                                        {"ean": id},
                                        {"projection": {"_id": 0}}
                                    );
        if (!product) return;
        //console.log(product.title)
        associated.push(product);
    });

    

    // Get all the price changes for the product
    const prices_cursor = client.db("meny")
                                .collection("prices")
                                .find(
                                    {"metadata.ean": id},
                                    {
                                        "projection": {"_id": 0},
                                        "sort": {"timestamp": -1}
                                    }
                                );

    // Generate priceChanges array
    let priceChanges: Change[] = await prices_cursor.map((item) => {
        return {
            timestamp: item.timestamp.getTime(),
            pricePerUnit: item.pricePerUnit
        };
    }).toArray();

    // Add missing values to priceChanges between days
    

    return {
        props: { 
            product,
            priceChanges,
            associated: associated.slice(0, 10)
        },
        // Revalidate after 10 minutes
        revalidate: 600
    }
}

export async function getStaticPaths() {
    logger.info("getStaticPaths ran")
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
    const paths = [{ params: { id: "2000467100006" }}]

    return {
        paths,
        // Fallback true allows for a loading page while page gets generated
        fallback: true
    }
}