import React, { useEffect, useRef } from "react";

const SearchInput = ({ searchUser, setSearching }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      return;
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setSearching]);

  return (
    <input
      type="text"
      placeholder="search"
      className="p-3 py-4 rounded-xl bg-zinc-800"
      onChange={searchUser}
      onClick={() => {
        setSearching(true);
      }}
      ref={inputRef}
    />
  );
};

export default SearchInput;
