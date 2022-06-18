import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getItems, getUserInfo, removeItems } from "../../shared/utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networkConfig } from "../../shared/networkConfig";
import "./RightNav.css";
import defaultPfp from "../../assets/default-avatar.jpg";
import { SearchInput } from "../pages/search/SearchInput";
import { ConfirmCancel } from "../modal/ConfirmCancel";

function RightNav() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const onLogout = () => {
    removeItems("info");
    removeItems("token");
    navigate("/login");
  };

  return (
    <div className="right-nav sticky left-0 top-0">
      <div className="flex flex-col">
        {/* ------- notification / log out ------- */}

        <div className="brand py-5">
          <div className="flex justify-evenly items-center">
            <Link to="/notification" className="logo text-slate-400 flex flex-col justify-center items-center mx-1 ">
              <div className="flex justify-center items-center w-12 h-12  rounded-full p-2 bg-white border-2 border-slate-200">
                <FontAwesomeIcon icon="bell" size="sm" />
              </div>
              <p className="mt-2 text-sm opacity-50">notifications</p>
            </Link>
            <div className="logo text-slate-400 flex flex-col justify-center items-center mx-1">
              <div
                className="flex justify-center items-center w-12 h-12  rounded-full p-2 bg-blue-400 active:bg-blue-500 shadow-lg shadow-blue-200 text-white"
                onClick={() => {
                  setShowLogoutModal(true);
                  console.log("first");
                }}
              >
                <FontAwesomeIcon icon="sign-out" size="sm" />
              </div>
              <p className="mt-2 text-sm opacity-50">logout</p>
              <ConfirmCancel
                header="Do you really want to log out ?"
                onShowModal={showLogoutModal}
                onCloseModal={setShowLogoutModal}
                onConfirm={onLogout}
              />
            </div>
          </div>
        </div>
        {/* ------- suggestion ------- */}

        <div className="suggestion py-2 ">
          <div className="label my-3 mx-8 hidden md:block">
            <p className="font-bold">Suggestion For You</p>
          </div>
          <div className="link flex flex-col"></div>
        </div>
        {/* ------- post activity ------- */}

        <div className="post-activity py-2 ">
          <div className="label my-3 mx-8 hidden md:block">
            <p className="font-bold">Last Post Activity</p>
          </div>
          <div className="post flex flex-col"></div>
        </div>
      </div>
    </div>
  );
}

export default RightNav;
