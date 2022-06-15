import React from "react";
import LeftNav from "../header/LeftNav";

export const Layout = ({ children }) => {
  return (
    <div className="layout flex w-full min-h-screen">
      <div className="left relative w-3/12">
        <LeftNav />
      </div>
      <div className="main w-6/12">{children}</div>
      <div className="right w-3/12">right</div>
    </div>
  );
};
