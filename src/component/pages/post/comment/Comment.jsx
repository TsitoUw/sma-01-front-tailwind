import React, { useState, useEffect } from "react";
import { networkConfig } from "../../../../shared/networkConfig";
import defaultPfp from "../../../../assets/default-avatar.jpg";
import "./Comment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { comparedDate } from "../../../../shared/date";
import { getUserInfo } from "../../../../shared/utiles";

function Comment({ comment }) {
  const [postedAt, setPostedAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const currentUser = getUserInfo().user;
  const navigate = useNavigate();

  useEffect(() => {
    setPostedAt(comparedDate(comment.createdAt));
    setCreatedAt(comment.createdAt);
    return () => clearInterval();
  }, [comment]);

  const updateTime = () => {
    setPostedAt(comparedDate(createdAt));
  };

  setInterval(() => {
    updateTime(createdAt);
  }, 60000);

  return (
    <div className="comment px-2 py-1 flex flex-col">
      <div className="comment-content flex items-start">
        <Link to={`/profile/${comment.author._id}`} className="w-2/12 xl:w-1/12 flex justify-center items-center p-2">
          <img
            src={
              comment.author.profilPicture === undefined || comment.author.profilPicture === "none"
                ? defaultPfp
                : networkConfig.static + "/users/" + comment.author._id + "/" + comment.author.profilPicture
            }
            alt=""
            className="aspect-square object-cover rounded-full flex-none"
            width="40px"
            height="40px"
          />
        </Link>
        <div className="w-auto flex flex-col rounded-2xl bg-white">
          <div className="head flex w-100 px-3 pt-2">
            <div
              className="mx-2 md:mx-0 flex flex-col justify-start"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${comment.author._id}`)}
            >
              <Link to={`/profile/${comment.author._id}`}>
                <h6 className="font-semibold">{comment.author.name}</h6>
              </Link>
            </div>
          </div>
          <div className="content px-3 pb-2 mx-2 md:mx-0">
            <p>{comment.content}</p>
          </div>
        </div>
        <div className="w-1/12 h-full  justify-center align-center mt-7 mx-1 hidden hover:flex">
          <div className="px-1 bg-white rounded-full">
            <FontAwesomeIcon icon={"ellipsis"} className="" />
          </div>
        </div>
      </div>
      <div className="action w-full flex p-1">
        <div className="text-transparent w-2/12 xl:w-1/12">lol</div>
        <div className="w-10/12 xl:w-11/12 flex">
          <p className="text-sm mx-1 text-slate-400">{postedAt}</p>
          {currentUser._id === comment.author._id && <p className="mx-1 text-sm hover:text-blue-400 pointer">Delete</p>}
        </div>
      </div>
    </div>
  );
}

export default Comment;
