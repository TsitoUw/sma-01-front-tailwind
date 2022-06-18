import React, { useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getItems, getUserInfo, removeItems } from "../../shared/utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networkConfig } from "../../shared/networkConfig";
import "./LeftNav.css";
import defaultPfp from "../../assets/default-avatar.jpg";
import { UserContext } from "../../shared/user.context";

function LeftNav() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="left-nav sticky left-0 top-0">
      <div className="flex flex-col flex-none">
        {/* ------- brand ------- */}

        <div className="brand py-5">
          <div className="flex justify-center items-center text-rose-500">
            <Link to="/" className="logo flex justify-center items-center mx-1 w-10 h-10 md:w-12 md:h-12 rounded-full p-2 bg-white shadow-lg">
              <FontAwesomeIcon icon="cloud" size="lg" />
            </Link>
            <Link to="/" className="hidden md:block">
              <h3 className="mx-1 text-success font-semibold">Pooped</h3>
            </Link>
          </div>
        </div>
        {/* ------- menu ------- */}

        <div className="menu py-2 ">
          <div className="label my-3 mx-8 hidden md:block">
            <p className="font-bold">Menu</p>
          </div>
          <div className="link flex flex-col">
            <NavLink to="/" className="my-1">
              <div className="mx-2 md:mx-6 content flex items-center md:justify-start justify-center p-3">
                <FontAwesomeIcon icon="home" />
                <p className="mx-2 font-semibold hidden md:block">Home</p>
              </div>
            </NavLink>
            <NavLink to="/messages" className="my-1">
              <div className="mx-2 md:mx-6 content flex items-center md:justify-start justify-center p-3">
                <FontAwesomeIcon icon="message" />
                <p className="mx-2 font-semibold hidden md:block">Messages</p>
              </div>
            </NavLink>
            <NavLink to={`/saved/${user._id}`} className="my-1">
              <div className="mx-2 md:mx-6 content flex items-center md:justify-start justify-center p-3">
                <FontAwesomeIcon icon="bookmark" />
                <p className="mx-2 font-semibold hidden md:block">Saved Post</p>
              </div>
            </NavLink>
            <NavLink to={`/search`} className="my-1">
              <div className="mx-2 md:mx-6 content flex items-center md:justify-start justify-center p-3">
                <FontAwesomeIcon icon="magnifying-glass" />
                <p className="mx-2 font-semibold hidden md:block">Search</p>
              </div>
            </NavLink>
          </div>
        </div>
        {/* ------- account ------- */}

        <div className="account py-2 ">
          <div className="label mt-3 mx-8 hidden md:block">
            <p className="font-bold">Account</p>
          </div>
          <div className="about flex flex-col">
            <NavLink to={`/profile/${user._id}`} className="my-1">
              <div className="mx-2 md:mx-6 content flex items-center md:justify-start justify-center p-3">
                <div className="picture rounded-full aspect-square w-5 h-5 md:w-7 md:h-7">
                  <img src={defaultPfp} alt={`${user.name} profile`} />
                </div>
                <div className="flex-col flex-none hidden md:flex">
                  <p className="mx-3 font-bold w-16 md:w-18 lg:w-28 text-ellipsis overflow-hidden">{user.name}</p>
                  <p className="mx-3 font-light w-16 md:w-18 lg:w-28  text-ellipsis overflow-hidden text-slate-400">{user.email}</p>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftNav;
