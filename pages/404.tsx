import Navbar from "@components/Navbar";
import Link from "next/link";
import { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import Footer from "@components/Footer";

const Custom404: NextPageWithLayout = () => {
  return (
    <div className="grid">
      <div>
        <h1 className="text-center text-5xl text-red-400 mt-32">
          Du er på villspor
        </h1>
        <h2 className="text-center text-2xl mt-3">
          <Link href="/">
            <a className="hover:underline">Gå til forsiden</a>
          </Link>
        </h2>
      </div>
    </div>
  );
};

Custom404.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Navbar />
      {page}
      <Footer fixedPlacement />
    </>
  );
};

export default Custom404;
