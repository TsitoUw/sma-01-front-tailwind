import React from "react";
import LeftNav from "../leftNav/LeftNav";
import RightNav from "../rightNav/RightNav";

export const Layout = ({ children }) => {
  return (
    <div className="layout flex w-full min-h-screen bg-zinc-50 ">
      <div className="left flex-none relative max-w-fit min-w-max bg-white w-1/12 md:w-2/12">
        <LeftNav />
      </div>
      <div className="main min-w-min flex-none relative w-11/12 md:w-6/12">{children}</div>
      <div className="right flex-none relative min-w-min bg-white md:w-4/12 md:block hidden">
        <RightNav />
      </div>
    </div>
  );
};
