import React, { useState, useEffect, useContext } from "react";
import { networkConfig } from "../../../../shared/networkConfig";
import defaultPfp from "../../../../assets/default-avatar.jpg";
import "./Comment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { comparedDate } from "../../../../shared/date";
import { UserContext } from "../../../../shared/user.context";

function Comment({ comment }) {
  const [postedAt, setPostedAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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
    <div className="post px-2 py-1">
      <div className="bg-white flex flex-col rounded-lg">
        <div className="head flex w-full p-2">
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
          <div
            className="w-9/12 xl:w-10/12 mx-2 md:mx-0 flex flex-col justify-start"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/profile/${comment.author._id}`)}
          >
            <Link to={`/profile/${comment.author._id}`}>
              <h6 className="font-semibold">{comment.author.name}</h6>
            </Link>
            <small className="font-light text-xs text-slate-400">{postedAt}</small>
          </div>

          <div className="w-1/12 flex justify-center">
            <FontAwesomeIcon icon={"ellipsis"} className="pt-2" />
          </div>
        </div>
        <div className="text-slate-900 p-2">
          <div className="mx-2 my-1" style={{ maxWidth: "100%", whiteSpace: "pre-wrap" }}>
            {comment.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
