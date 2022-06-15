import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getItems, getUserInfo, removeItems } from "../../shared/utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networkConfig } from "../../shared/networkConfig";
import "./LeftNav.css";

function LeftNav() {
  const navigate = useNavigate();
  const currentUser = getUserInfo().user;
  const path = window.location.href;

  const isLogged = () => {
    if (getItems("token") === "" || getItems("info") === "") {
      removeItems("token");
      removeItems("info");
      navigate("/login");
    }
  };

  useEffect(() => {
    isLogged();
  }, []);

  return (
    // <nav className="sticky top-0 z-50 h-14 w-full flex justify-around items-center bg-white text-gray-900 centered-shadow">
    //   <div className="relative">
    //     <NavLink
    //       className="text-center"
    //       to="/"
    //       onClick={() => {
    //         if (path.split(networkConfig.front)[1] === "/") {
    //           window.location.reload();
    //         }
    //       }}
    //     >
    //       <FontAwesomeIcon icon="home" className="m-0" />
    //       <div className="hidden dot absolute m-0 p-0 pt-1 text-xs top-4" style={{ left: "0.28rem" }}>
    //         <FontAwesomeIcon icon="circle" size="xs" className="" />
    //       </div>
    //     </NavLink>
    //   </div>
    //   <div className="">
    //     <NavLink to="/notification">
    //       <FontAwesomeIcon icon="cloud" />
    //     </NavLink>
    //   </div>
    //   <div className="">
    //     <NavLink to="/messages">
    //       <FontAwesomeIcon icon="message" />
    //     </NavLink>
    //   </div>
    //   <div className="">
    //     <NavLink to="/notification">
    //       <FontAwesomeIcon icon="bell" />
    //     </NavLink>
    //   </div>
    //   <div className="">
    //     <NavLink to="/search">
    //       <FontAwesomeIcon icon="magnifying-glass" />
    //     </NavLink>
    //   </div>
    //   <div className="">
    //     <NavLink to={"/profil/" + currentUser._id}>
    //       <FontAwesomeIcon icon="user-circle" />
    //     </NavLink>
    //   </div>
    // </nav>
    <div className="left-nav sticky left-0 top-0">
      <div className="flex flex-col">
        <div className="brand my-3">
          <div className="flex justify-center items-center text-rose-500">
            <div className="logo flex justify-center items-center mx-1 w-12 h-12 rounded-full p-2 bg-white shadow-lg">
              <FontAwesomeIcon icon="cloud" size="lg" />
            </div>
            <h3 className="mx-1 text-success font-semibold">Pooped</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftNav;
