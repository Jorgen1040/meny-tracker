export default function Home() {
  return (
    // <Head>
    //   <title>Meny Tracker</title>
    //   <meta name="description" content="Se prisene på Meny" />
    //   <link rel="icon" href="/favicon-32x32.png" />
    // </Head>
    <>
      <div>
        <h1 className="text-3xl my-3">På tilbud nå</h1>
      </div>
      <div>
        <h1 className="text-3xl my-3">Nye produkter</h1>
        {/* 
          promotionDisplayName: "Nyhet!" 
          (isNew is never true)
        */}
      </div>
    </>
  )
}
