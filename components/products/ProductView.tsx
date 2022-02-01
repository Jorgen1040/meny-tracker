import Loader from "@components/Loader";
import { Product } from "@lib/types/product";
import Image from "next/image";


export default function ProductView({ product }: { product: any }) {
    // Get image, name, price, and description
    const name = product.title
    const image = "https://res.cloudinary.com/norgesgruppen/image/upload/f_auto,q_50,w_320,h_320,c_pad/" + product.imageName
    const description = product.subtitle 
    const price = product.pricePerUnit
    return (
        <div>
            <Image src={image} alt={name} height={320} width={320} />
            <h1>{name}</h1>
            <p>{description}</p>
            <p>{price} kr</p>
        </div>
    )
}