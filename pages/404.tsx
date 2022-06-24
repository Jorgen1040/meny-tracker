import Link from "next/link";

export default function Custom404() {
  return (
    <div className="grid mb-[37.5rem]">
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
}
