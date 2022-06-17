import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { networkConfig } from "../../../shared/networkConfig";
import defaultPfp from "../../../assets/default-avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProfileHeader({ user }) {
  const navigate = useNavigate();
  return (
    <div className="profile-header px-2 py-1">
      <div className="bg-white flex flex-col p-2 rounded-lg">
        <div className="head flex w-100">
          <Link to={`/profile/${user._id}`} className="w-2/12 xl:w-1/12 flex justify-center items-center p-2">
            <img
              src={
                user.profilPicture === undefined || user.profilPicture === "none"
                  ? defaultPfp
                  : networkConfig.static + "/users/" + user._id + "/" + user.profilPicture
              }
              alt=""
              className="aspect-square object-cover rounded-full flex-none"
              width="40px"
              height="40px"
            />
          </Link>
          <div
            className="w-9/12 md:w-10/12 md:mx-0 flex flex-col justify-center"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <Link to={`/profile/${user._id}`}>
              <h6 className="font-semibold">{user.name}</h6>
            </Link>
          </div>

          <div className="w-1/12 flex justify-center items-center">
            <FontAwesomeIcon icon={"cloud"} className="pt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
