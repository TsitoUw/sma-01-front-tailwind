import React from "react";
import { networkConfig } from "../../../../shared/networkConfig";
import defaultPfp from "../../../../assets/default-avatar.jpg";
import "./Comment.css";

function Comment({ comment }) {
  return (
    <div className="row m-1">
      <div className="col-2 col-lg-1 d-flex justify-content-center">
        <img
          src={
            !comment.author.profilPicture || comment.author.profilPicture === "none"
              ? defaultPfp
              : networkConfig.static + "/users/" + comment.author._id + "/" + comment.author.profilPicture
          }
          alt=""
          className="p-2"
          style={{ borderRadius: "50%", width: "45px", height: "45px", objectFit: "cover" }}
        />
      </div>
      <div className="content col-10 col-lg-11">
        <div className="body bg-dark mx-1" style={{ borderRadius: "8px" }}>
          <div className="head row p-2">
            <div className="col-11 d-flex ">
              <h6 className="p-0 m-0 px-2">{comment.author.name}</h6>
            </div>
          </div>
          <div className="coms row px-2 pb-3">
            <div className="comment-content col-12 m-0 p-0 px-2" style={{ maxWidth: "100%", whiteSpace: "pre-wrap", color: "white" }}>
              {comment.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
