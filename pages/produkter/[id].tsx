import { useRouter } from 'next/router';
import clientPromise from '@lib/mongodb';
import dynamic from 'next/dynamic';
import pino from 'pino';
import { CartesianGrid, LineChart, XAxis, YAxis, Area, ResponsiveContainer, AreaChart, Tooltip } from 'recharts';
import moment from 'moment';

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
    
    { priceChanges && 
        priceChanges.map((change: Change, index) => {
            change_items.push(
                <pre className="border-8 border-red-400" key={index}>
                    <strong>{new Date(change.timestamp).toLocaleString("no-NB", { timeZone: "Europe/Oslo" })}</strong>
                    <br/>
                    <BrowserReactJsonView src={change} collapsed={2} theme={"monokai"} name={false} collapseStringsAfterLength={100} />
                </pre>
            );
        });
    }

    

    let changes_test: Change[] = [];

    // Generate 1000 fake datapoints
    for (let i = 0; i < 50; i++) {
        let price;
        if (changes_test.length > 0) {
            price = changes_test[i-1]["pricePerUnit"] + (Math.random() * 5 - 1);
        } else {
            price = Math.random() * 10;
        }
        changes_test.push({
            timestamp: moment().add(i, 'days').toDate(),
            pricePerUnit: price
        })
    }

    return (
        <>
        {changes_test &&
            <ResponsiveContainer width="100%" height={300} className="py-2">
                <AreaChart
                data={changes_test}
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
            <h1 className="text-2xl">Produkt navn: {product ? product.title : "Ingen produkt funnet" }</h1>
            <div>
                <pre>
                    <BrowserReactJsonView src={product} collapsed={2} theme={"monokai"} name={false} collapseStringsAfterLength={100} />
                </pre>
            </div>
        { priceChanges && (
            <div>
                <h1 className="text-2xl">{change_items.length} Totale Endringer (nyest til eldst):</h1>
                {change_items}
            </div>
        )}  
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
    
    // Go through the list of price changes
    let priceChanges: Change[] = [];
    for await (const item of prices_cursor) {
        priceChanges.push({
            timestamp: item.timestamp.getTime(),
            pricePerUnit: item.pricePerUnit
        });
    }
    // console.log(await changes_cursor.count());
    // console.log(changes_arr.length);
    //produkt.timestamp = produkt.timestamp.getTime();
    return {
        props: { 
            product,
            priceChanges
        },
        // TODO: Change this to a longer time
        revalidate: 5000
    }
}

export async function getStaticPaths() {
    const client = await clientPromise;
    const products = client.db("meny")
                           .collection("products")
                           .find({}, {"projection": {"_id": 0}});

    let paths = [];
    for await (const item of products) {
        paths.push({params: {id: item.ean}});
    }
    return {
        paths,
        // Fallback blocking makes Next.js generate the page if product was added to database after build
        fallback: "blocking"
    }
}