import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const SearchInput = ({ text, onSearch, setText }) => {
  return (
    <div className="w-full sticky top-0">
      <form className="w-full flex border-b-2 border-slate-100 rounded-3xl" onSubmit={onSearch}>
        <input className="w-10/12 md:w-11/12 h-12 pl-3 py-3" placeholder=" Search..." value={text} onChange={(e) => setText(e.target.value)}></input>
        <button className="w-2/12 md:w-1/12 bg-white h-12 text-slate-200" type="submit">
          <FontAwesomeIcon icon="magnifying-glass" />
        </button>
      </form>
    </div>
  );
};
