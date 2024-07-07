import React, { useRef } from "react";

const SearchInput = ({ searchUser, setSearching }) => {
  const inputRef = useRef(null);

  const handleCloseClick = () => {
    setSearching(false);
    inputRef.current.value = "";
  };

  return (
    <div>
      <input
        type="text"
        placeholder="search"
        className="p-3 py-4 rounded-xl bg-zinc-900 text-white outline-none"
        onChange={searchUser}
        onClick={() => {
          setSearching(true);
        }}
        ref={inputRef}
      />
      <button
        onClick={handleCloseClick}
        className=" right-2 top-2  text-white p-4 rounded-xl"
      >
        Close
      </button>
    </div>
  );
};

export default SearchInput;
