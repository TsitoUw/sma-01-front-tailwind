import React from "react";
import LeftNav from "../LeftNav/LeftNav";

export const Layout = ({ children }) => {
  return (
    <div className="layout flex w-full min-h-screen bg-zinc-50 ">
      <div className="left flex-none relative min-w-min bg-white w-1/12 md:w-3/12">
        <LeftNav />
      </div>
      <div className="main min-w-min relative w-11/12 md:w-6/12">{children}</div>
      <div className="right flex-none hidden md:block md:w-3/12 border-l-2 border-slate-100">right</div>
    </div>
  );
};
