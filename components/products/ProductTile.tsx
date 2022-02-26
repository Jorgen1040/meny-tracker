import clientPromise from "@lib/mongodb";
import Image from "next/image";
import Link from "next/link";

export default function ProductTile({ product }: { product: any }) {
    return (
        <div className="rounded-lg shadow-xl hover:shadow-2xl border border-gray-400 border-opacity-0 hover:border-opacity-20 flex flex-col transition-all">
            <div className="p-4 flex justify-center">
                <Link href={`${product.ean}`} prefetch={false}>
                    <a className="relative w-32 h-32">
                        <Image 
                            src={"https://bilder.ngdata.no/" + product.ean + "/meny/medium.jpg"}
                            alt={product.title}
                            layout="fill"
                            objectFit="contain"
                        />
                    </a>
                </Link>
            </div>
            <div className="p-2 flex-grow w-full">
                <Link href={`${product.ean}`}>
                    <a>
                        <h1 className="text-xl hover:underline">{product.title}</h1>
                    </a>
                </Link>
                <p className="text-sm">{product.subtitle}</p> 
            </div>
            <div className="relative p-2">
                {/* TODO: Add sale prices (and a little icon on the image to indicate sales) */}
                { product.isOffer &&
                    <p className="absolute -top-2 text-gray-400"><s>kr {product.pricePerUnitOriginal.toFixed(2)}</s></p>
                }
                <p className="text-xl">kr {product.pricePerUnit.toFixed(2)}</p>
                { product.comparePricePerUnit ?
                    <p className="text-sm text-gray-500">kr {product.comparePricePerUnit.toFixed(2)}/{product.compareUnit}</p>
                : <div className="h-5"></div>
                }
            </div>
        </div>
    )
}