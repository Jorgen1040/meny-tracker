import Layout from '../components/layout'
import Navbar from '../components/navbar'

export default function Test() {
    return (
        <section>
            <p>Does this work?</p>
        </section>
    )
}

Test.getLayout = function getLayout(page) {
    return (
        <Layout>
            <Navbar />
            {page}
        </Layout>
    )
}