import { useRouter } from 'next/router';
import clientPromise from '@lib/mongodb';
import dynamic from 'next/dynamic';
import pino from 'pino';
import { CartesianGrid, LineChart, XAxis, YAxis, Area, ResponsiveContainer, AreaChart, Tooltip } from 'recharts';
// TODO: Use alternative for moment
import moment from 'moment';
import Loader from '@components/Loader';
import ProductView from '@components/products/ProductView';


const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        }
    }
});

// react-json-view only works without SSR
const BrowserReactJsonView = dynamic(() => import('react-json-view'), {
    ssr: false,
});

interface Change {
    timestamp: Date;
    pricePerUnit: number;
}

export default function Produkt({ product, priceChanges }: { product: any, priceChanges: Change[] }) {
    const router = useRouter();
    const { id } = router.query;
    let change_items: JSX.Element[] = [];
    
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
            <div className="grid place-items-center h-screen">
                <div>
                    <h1 className="text-center">Produktet finnes ikke</h1>
                    <h1 className="text-center">Leter du etter disse?</h1>
                    {/* TODO: Vis liste med produkter via Atlas Search med query */}
                </div>
            </div>
        )
    }

    // { priceChanges && 
    //     priceChanges.map((change: Change, index) => {
    //         change_items.push(
    //             <pre className="border-8 border-red-400" key={index}>
    //                 <strong>{new Date(change.timestamp).toLocaleString("no-NB", { timeZone: "Europe/Oslo" })}</strong>
    //                 <br/>
                    
    //                 <BrowserReactJsonView src={change} collapsed={2} theme={"monokai"} name={false} collapseStringsAfterLength={100} />
    //             </pre>
    //         );
    //     });
    // }
    console.log(product);
    console.log(priceChanges);

    // TODO: Make the graph look nicer (don't use stepAfter, fill in the gaps instead)
    return (
        <>
            { priceChanges &&
                <ResponsiveContainer width="100%" height={300} className="py-2">
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
            }
                <h1 className="text-2xl">Søker på produkt med EAN: {id}</h1>
                <h1 className="text-2xl">Produkt navn: {product.title}</h1>
                <ProductView name={product.title} image={"https://res.cloudinary.com/norgesgruppen/image/upload/f_auto,q_50,w_320,h_320,c_pad/" + product.imageName} description={product.subtitle} price={priceChanges[0].pricePerUnit} />

                {/* <div>
                    <pre>
                        <BrowserReactJsonView src={product} collapsed={2} theme={"monokai"} name={false} collapseStringsAfterLength={100} />
                    </pre>
                </div> */}
            {/* { priceChanges && (
                <div>
                    <h1 className="text-2xl">{change_items.length} Totale Endringer (nyest til eldst):</h1>
                    {change_items}
                </div>
            )} */}
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

    // Get all the price changes for the product
    const prices_cursor = client.db("meny")
                                .collection("prices")
                                .find(
                                    {
                                        "metadata.ean": id,
                                    },
                                    {"projection": {"_id": 0}, "sort": {"timestamp": -1}}
                                );

    // Generate priceChanges array
    const priceChanges: Change[] = await prices_cursor.map((item) => {
        return {
            timestamp: item.timestamp.getTime(),
            pricePerUnit: item.pricePerUnit
        };
    }).toArray();

    return {
        props: { 
            product,
            priceChanges
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