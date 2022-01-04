import { useRouter } from 'next/router'


export default function Produkt() {
    const router = useRouter();
    const { id } = router.query;
    
    return <h1>{id}</h1>
}

export async function getServerSideProps({ params }) {

    const request = await fetch(`/api/produkt/${params.id}`);
    const data = request.json();

    return {
        props: { produkt: data },
    }

}