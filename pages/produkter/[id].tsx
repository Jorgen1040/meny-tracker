import { useRouter } from 'next/router';
import clientPromise from '../../lib/mongodb';
import dynamic from 'next/dynamic';

// react-json-view only works without SSR
const BrowserReactJsonView = dynamic(() => import('react-json-view'), {
    ssr: false,
});

export default function Produkt({ produkt, changes }) {
    const json_settings = ""
    const router = useRouter();
    const { id } = router.query;
    let change_items = [];
    
    if (changes) {
        for (let [index, value] of changes.entries()) {
            change_items.push(
                <pre className="border-8 border-red-400" key={index}>
                    <strong>{new Date(value.timestamp).toLocaleString("no-NB", { timeZone: "Europe/Oslo" })}</strong>
                    <br/>
                    <BrowserReactJsonView src={value} collapsed={2} theme={"monokai"} name={false} collapseStringsAfterLength={100} />
                </pre>
            )
        }
    }

    return (
        <>
            <h1 className="text-2xl">Søker på produkt med EAN: {id}</h1>
            <h1 className="text-2xl">Produkt navn: {produkt ? produkt.title : "Ingen produkt funnet" }</h1>
            <div>
                <pre>
                    <BrowserReactJsonView src={produkt} collapsed={2} theme={"monokai"} name={false} collapseStringsAfterLength={100} />
                </pre>
            </div>
        { changes && (
            <div>
                <h1 className="text-2xl">{change_items.length} Totale Endringer (nyest til eldst):</h1>
                {change_items}
            </div>
        )}  
        </>
    );
}

export async function getServerSideProps({ params }) {
    const client = await clientPromise;
    // Get the first product with the provided EAN (this will be used to store all information except price in the future)
    const produkt = await client.db("meny")
                                .collection("products_diff")
                                .findOne(
                                    {"metadata.ean": params.id.toString()},
                                    {"projection": {"_id": 0}}
                                );
    // If no product was found, return nothing
    if (produkt === null) {
        return {
            props: {}
        }
    }
    // Get all the changes for the product
    const changes_cursor = client.db("meny")
                                .collection("products_diff")
                                .find(
                                    {
                                        "metadata.ean": params.id.toString(),
                                    },
                                    {"projection": {"_id": 0}, "sort": {"timestamp": -1}}
                                );
    
    // Go through the list of changes and change 
    let changes_arr = [];
    for await (const item of changes_cursor) {
        item.timestamp = item.timestamp.getTime();
        changes_arr.push(item);
    }
    // console.log(await changes_cursor.count());
    // console.log(changes_arr.length);
    produkt.timestamp = produkt.timestamp.getTime();
    return {
        props: { 
            produkt: produkt,
            changes: changes_arr
        },
    }
}