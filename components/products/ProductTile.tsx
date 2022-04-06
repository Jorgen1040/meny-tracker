import Image from "next/image";
import Link from "next/link";
import SaleIcon from "../../public/sale_sticker.svg";

export default function ProductTile({ product }: { product: any }) {
    // TODO: Add image blur
    return (
        <div className="rounded-lg shadow-xl hover:shadow-2xl border border-gray-400 border-opacity-0 hover:border-opacity-20 flex flex-col transition-all">
            <div className="p-4 flex justify-center">
                <Link href={`/produkter/${product.ean}`} prefetch={false}>
                    <a className="relative w-32 h-32">
                        {/* Percentage sticker */}
                        { product.isOffer &&
                            <span className="fill-red-500 absolute right-0 z-10 flex rotate-12">
                                <span className="absolute left-0 right-0 text-center top-1/4 text-white">
                                    {(((product.pricePerUnit-product.pricePerUnitOriginal)/product.pricePerUnitOriginal)*100).toFixed(0)}%
                                </span>
                                <SaleIcon width={48} height={48} />
                            </span>
                        }
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
                <Link href={`/produkter/${product.ean}`}>
                    <a>
                        <h1 className="text-xl hover:underline">{product.title}</h1>
                    </a>
                </Link>
                <p className="text-sm">{product.subtitle}</p> 
            </div>
            <div className="relative p-2">
                { product.isOffer &&
                    <p className="absolute -top-2 text-gray-400"><s>kr {product.pricePerUnitOriginal.toFixed(2).replace(".", ",")}</s></p>
                }
                <p className="text-xl">kr {product.pricePerUnit.toFixed(2).replace(".", ",")}</p>
                { product.comparePricePerUnit ?
                    <p className="text-sm text-gray-500">kr {product.comparePricePerUnit.toFixed(2).replace(".", ",")}/{product.compareUnit}</p>
                : <div className="h-5"></div>
                }
            </div>
        </div>
    )
}