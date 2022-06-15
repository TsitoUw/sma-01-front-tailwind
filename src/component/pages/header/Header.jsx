import React, { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getItems, getUserInfo, removeItems } from "../../../shared/utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networkConfig } from "../../../shared/networkConfig";
import "./Header.css";

function Header() {
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
    <nav className="sticky top-0 z-50 h-14 w-full flex justify-around items-center bg-white text-gray-900 centered-shadow">
      <div className="relative">
        <NavLink
          className="text-center"
          to="/"
          onClick={() => {
            if (path.split(networkConfig.front)[1] === "/") {
              window.location.reload();
            }
          }}
        >
          <FontAwesomeIcon icon="home" className="m-0" />
          <div className="hidden dot absolute m-0 p-0 pt-1 text-xs top-4" style={{ left: "0.28rem" }}>
            <FontAwesomeIcon icon="circle" size="xs" className="" />
          </div>
        </NavLink>
      </div>
      <div className="">
        <NavLink to="/notification">
          <FontAwesomeIcon icon="cloud" />
        </NavLink>
      </div>
      <div className="">
        <NavLink to="/messages">
          <FontAwesomeIcon icon="message" />
        </NavLink>
      </div>
      <div className="">
        <NavLink to="/notification">
          <FontAwesomeIcon icon="bell" />
        </NavLink>
      </div>
      <div className="">
        <NavLink to="/search">
          <FontAwesomeIcon icon="magnifying-glass" />
        </NavLink>
      </div>
      <div className="">
        <NavLink to={"/profil/" + currentUser._id}>
          <FontAwesomeIcon icon="user-circle" />
        </NavLink>
      </div>
    </nav>
  );
}

export default Header;
