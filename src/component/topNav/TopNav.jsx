import React, { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getItems, getUserInfo, removeItems } from "../../shared/utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networkConfig } from "../../shared/networkConfig";
import "./TopNav.css";
import defaultPfp from "../../assets/default-avatar.jpg";

function TopNav() {
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
    <div className="top-nav">
      <div className="flex flex-col">
        {/* ------- brand ------- */}

        <div className="brand py-1">
          <div className="flex justify-start px-2 items-center text-rose-500">
            <Link to="/" className="logo flex justify-center items-center mx-1 w-8 h-8 rounded-full p-2 bg-white shadow-lg">
              <FontAwesomeIcon icon="cloud" size="sm" />
            </Link>
            <Link to="/" className="">
              <h3 className="mx-1 text-success text-md font-semibold">Pooped</h3>
            </Link>
          </div>
        </div>
        {/* ------- menu ------- */}

        <div className="menu py-0 link flex w-100 justify-evenly">
          <NavLink to="/" className="my-1">
            <div className="mx-2 content flex items-center justify-center p-3">
              <FontAwesomeIcon icon="home" />
            </div>
          </NavLink>
          <NavLink to={`/saved/${currentUser._id}`} className="my-1">
            <div className="mx-2 content flex items-center justify-center p-3">
              <FontAwesomeIcon icon="bookmark" />
              <p className="mx-2 font-semibold hidden md:block">Saved Post</p>
            </div>
          </NavLink>
          <NavLink to="/messages" className="my-1">
            <div className="mx-2 content flex items-center justify-center p-3">
              <FontAwesomeIcon icon="message" />
              <p className="mx-2 font-semibold hidden md:block">Messages</p>
            </div>
          </NavLink>
          <NavLink to={`/search`} className="my-1">
            <div className="mx-2 content flex items-center justify-center p-3">
              <FontAwesomeIcon icon="magnifying-glass" />
              <p className="mx-2 font-semibold hidden md:block">Search</p>
            </div>
          </NavLink>
          <NavLink to={`/profile/${currentUser._id}`} className="my-1">
            <div className="mx-2 content flex items-center justify-center p-3">
              <div className="picture aspect-square w-4 h-4">
                <img src={defaultPfp} alt={`${currentUser.name} profile`} />
              </div>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
