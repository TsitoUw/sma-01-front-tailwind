import React from "react";
import LeftNav from "../leftNav/LeftNav";
import RightNav from "../rightNav/RightNav";
import TopNav from "../topNav/TopNav";

export const Layout = ({ children }) => {
  return (
    <div className="layout bg-slate-200 flex min-h-screen flex-col md:flex-row">
      <div className="top bg-white w-100 sticky top-0 block md:hidden z-20">
        <TopNav />
      </div>
      <div className="left bg-white w-2/12 hidden md:block z-20">
        <LeftNav />
      </div>
      <div className="main w-100 md:w-6/12 z-10">{children}</div>
      <div className="right bg-white md:w-4/12 hidden md:block z-20 centered-shadow">
        <RightNav />
      </div>
    </div>
  );
};
