import Loader from "@components/Loader";
import { Product } from "@lib/types/product";
import Image from "next/image";


export default function ProductView({ product }: { product: any }) {
    // Get image, name, price, and description
    const name = product.title
    //const image = "https://res.cloudinary.com/norgesgruppen/image/upload/f_auto,q_50,w_320,h_320,c_pad/" + product.imageName
    // TODO: Update to new image hosting (and deal with the Image tag resizing weirdness)
    const image = "https://bilder.ngdata.no/" + product.ean + "/meny/medium.jpg"
    const price = product.pricePerUnit.toFixed(2)
    function menyRedirect() {
        const url = "https://meny.no/varer" + product.slugifiedUrl
        window.open(url, "_blank")?.focus();
    }
    return (
        <div className="flex my-8">
            <div className="sm:mr-24 mr-2 relative w-64 h-64">
                <Image src={image} alt={name} layout="fill" objectFit="contain" />
            </div>
            <div>
                <h1 className="text-3xl">{name}</h1>
                <p>{product.subtitle}</p>
                <p className="mb-12">{product.description}</p>
                { product.isOffer &&
                    // TODO: Show sale percentage, and add an icon to the product image
                    <p className="text-gray-400"><s>kr {product.pricePerUnitOriginal.toFixed(2)}</s></p>
                }
                <p className="text-2xl">kr {price}</p>
                { product.comparePricePerUnit &&
                    <p className="text-sm text-gray-500">kr {product.comparePricePerUnit.toFixed(2)}/{product.compareUnit}</p>
                }
                <button 
                    className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={menyRedirect}>Se produktet på Meny.no</button>
            </div>
        </div>
    )
}