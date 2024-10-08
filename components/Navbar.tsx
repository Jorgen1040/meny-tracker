import Link from "next/link";
import {
  HomeIcon,
  MenuIcon,
  SearchIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import React, { FormEvent, useState } from "react";

// Top navbar
export default function Navbar() {
  const [textInput, setTextInput] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value);
  };

  // TODO: Make this proper
  const redirect = async (event: FormEvent) => {
    event.preventDefault();
    window.location.href = "/produkter/" + textInput;
    console.log(textInput);
  };

  return (
    <nav className="bg-red-500 sticky top-0 z-40 w-full drop-shadow-xl">
      <div className="text-center bg-yellow-400 py-2">
        <span>
          <b>Prisdata har ikke vært oppdatert siden 23. februar 2024</b> <br />{" "}
          Denne siden ligger nå kun tilgjengelig som arkiv og vil ikke bli
          videreutviklet.{" "}
          <a
            className="hover:underline"
            href="https://github.com/Jorgen1040/meny-tracker"
            target="_blank"
            rel="author"
          >
            {" "}
            Se kildekoden her{" "}
          </a>
        </span>
      </div>
      <div className="max-w-8xl mx-auto">
        <div className="py-5 px-8 lg:px-8 mx-4 lg:mx-0">
          <div className="relative flex items-center justify-between">
            <Link href="/">
              <a>
                <HomeIcon className="left-8 w-8 h-8 justify-self-start" />
              </a>
            </Link>
            <form onSubmit={redirect}>
              <div className="relative text-gray-600 focus-within:text-gray-400 flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button
                    type="submit"
                    className="p-1 focus:outline-none focus:shadow-outline"
                  >
                    <SearchIcon className="w-6 h-6" />
                  </button>
                </span>
                <input
                  onChange={handleChange}
                  type="search"
                  name="q"
                  className="py-2 text-sm text-white bg-red-400 rounded-md pl-10 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  placeholder="Søk EAN..."
                  autoComplete="off"
                />
              </div>
            </form>
            <div title="Ikke tilgjengelig enda">
              <UserCircleIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
