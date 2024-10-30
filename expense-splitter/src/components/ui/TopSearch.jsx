import { useEffect, useRef, useState } from "react";
import { UseDataContext } from "../context/SiteContext";

const TopSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { search, handleSearch } = UseDataContext();
  const inputRef = useRef(null);

  useEffect(() => {
    if (search.input) {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  }, [search.input]);

  useEffect(() => {
    if (search.show) {
      inputRef.current.focus();
    }
  });

  return (
    <div className="flex backdrop-blur-sm">
      <div className="relative flex min-w-60 items-center sm:w-96">
        <i className="fa-solid fa-magnifying-glass absolute pl-3 opacity-70"></i>
        <button
          onClick={() => {
            handleSearch("input", "");
            setIsFocused(false);
          }}
          className={`fa-solid fa-circle-xmark absolute right-3 pl-3 text-lg opacity-50 hover:opacity-100 ${!isFocused && "hidden"} z-20`}
        ></button>
        <input
          //   onFocus={handleSetFocus}
          ref={inputRef}
          onChange={(e) => handleSearch("input", e.target.value)}
          value={search.input}
          className="z-10 h-10 w-full rounded-3xl bg-white/10 p-2 pl-9 text-base tracking-normal text-white/80 placeholder:text-white/50"
          type="text"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default TopSearch;
