import Loader from "@components/Loader";
import { Product } from "@lib/types/product";
import Image from "next/image";

export default function ProductView({ name, image, description, price }: { name: string, image: string, description: string, price: number }) {
    // Get image, name, price, and description
    return (
        <div>
            <Image src={image} alt={name} height={320} width={320} />
            <h1>{name}</h1>
            <p>{description}</p>
            <p>{price} kr</p>
        </div>
    )
}