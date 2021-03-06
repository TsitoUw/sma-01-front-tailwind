import React, { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../shared/user.context";
import LeftNav from "../leftNav/LeftNav";
import RightNav from "../rightNav/RightNav";
import TopNav from "../topNav/TopNav";

export const Layout = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="layout bg-slate-200 flex flex-col md:flex-row">
      <div className="top bg-white w-100 sticky top-0 block md:hidden z-20">
        <TopNav />
      </div>
      <div className="left  bg-white w-2/12 hidden md:block z-20 centered-shadow">
        <LeftNav />
      </div>
      <div className="main w-100 md:w-6/12 z-10">{children}</div>
      <div className="right bg-white md:w-4/12 hidden md:block z-20 ">
        <RightNav />
      </div>
    </div>
  );
};
