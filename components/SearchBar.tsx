// TODO: Make search component with search bar and results (atlas search)

import Link from "next/link";
import { MenuIcon, SearchIcon } from "@heroicons/react/solid";
import React, { FormEvent, useState } from "react";

// Top navbar
export default function SearchBar() {
  const [textInput, setTextInput] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value);
  };

  return <input type="text" className="" />;
}
