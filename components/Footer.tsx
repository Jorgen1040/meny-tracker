import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export default function Footer({
  fixedPlacement = false,
}: {
  fixedPlacement?: boolean;
}) {
  const router = useRouter();

  return (
    <footer
      className={`px-6 py-4 bg-gray-200 ${
        // If fixedPlacement is wanted or site is currently loading (fallback), pin footer to the bottom
        fixedPlacement || router.isFallback ? "absolute bottom-0 w-full" : ""
      }`}
    >
      <div className="md:flex md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center">
          Alle bilder tilhører{" "}
          <a href="https://meny.no" className="hover:underline">
            MENY
          </a>
          <br />
          Copyright &copy; {new Date().getFullYear()}{" "}
          <a href="https://ringstad.dev" className="hover:underline">
            ringstad.dev
          </a>
        </span>

        {/* <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">

        </div> */}
        <ul className="flex flex-wrap items-center mt-3 text-sm font-semibold text-gray-600 sm:mt-0">
          <li className="mr-4 hover:underline">
            <Link href="/om-oss">
              <a>Om Meny Tracker</a>
            </Link>
          </li>
          <li className="mr-4 hover:underline">
            <Link href="/stats">
              <a>Statistikk</a>
            </Link>
          </li>
          <li className="mr-4 hover:underline">
            <a
              href="https://github.com/Jorgen1040/meny-tracker"
              target="_blank"
              rel="noreferrer"
            >
              Se kildekode på GitHub
            </a>
          </li>
          <li className="mr-4 hover:underline">
            <a
              href="mailto:meny@ringstad.dev?subject=[Meny Tracker] - (Din henvendelse)"
              target="_blank"
              rel="noreferrer"
            >
              Kontakt
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
