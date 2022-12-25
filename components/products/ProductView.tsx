import { ProductViewData } from "@lib/types/product";
import Image from "next/image";
import { ReactComponent as SaleIcon } from "../../public/sale_sticker.svg";

export default function ProductView({ product }: { product: ProductViewData }) {
  // Get image, name, price, and description
  const name = product.title;
  // TODO: Add image blur
  const image = "https://bilder.ngdata.no/" + product.ean + "/meny/medium.jpg";
  function menyRedirect() {
    const url = "https://meny.no/varer" + product.slugifiedUrl;
    window.open(url, "_blank")?.focus();
  }
  return (
    <div className="flex my-8">
      <div className="sm:mr-24 mr-2 relative w-64 h-64">
        {product.isLoweredPrice && (
          <span className="fill-red-500 absolute right-0 z-10 flex rotate-12">
            <span className="absolute left-0 right-0 text-center top-1/4 text-white">
              {(
                ((product.pricePerUnit - product.pricePerUnitOriginal) /
                  product.pricePerUnitOriginal) *
                100
              ).toFixed(0)}
              %
            </span>
            <SaleIcon width={48} height={48} />
          </span>
        )}
        <Image src={image} alt={name} layout="fill" objectFit="contain" />
      </div>
      <div>
        <h1 className="text-3xl">{name}</h1>
        <p>{product.subtitle}</p>
        <p className="mb-12 max-w-2xl">{product.description}</p>
        {/* TODO: Show promotionDisplayName */}
        {product.isLoweredPrice && (
          <p className="text-gray-400">
            <s>
              kr {product.pricePerUnitOriginal.toFixed(2).replace(".", ",")}
            </s>
          </p>
        )}
        <p className="text-2xl">
          kr {product.pricePerUnit.toFixed(2).replace(".", ",")}
        </p>
        {product.comparePricePerUnit && (
          <p className="text-sm text-gray-500">
            kr {product.comparePricePerUnit.toFixed(2).replace(".", ",")}/
            {product.compareUnit}
          </p>
        )}
        <div className="flex mt-8 items-center">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={menyRedirect}
          >
            Se produktet på Meny.no
          </button>
          <a
            className="px-4 text-red-500 hover:underline"
            href={`mailto:meny@ringstad.dev?subject=[Meny Tracker] Prisfeil på ${product.title} (${product.ean})`}
            target="_blank"
            rel="noreferrer"
          >
            Feil pris?
          </a>
        </div>
      </div>
    </div>
  );
}
