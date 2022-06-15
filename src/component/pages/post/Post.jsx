import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../../../shared/utiles";
import { getUserInfo } from "../../../shared/utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultPfp from "../../../assets/default-avatar.jpg";
import "./Post.css";
import { networkConfig } from "../../../shared/networkConfig";
import { comparedDate } from "../../../shared/date";

function Post({ post }) {
  const [isEditing, setIsEditing] = useState("");
  const [editId, setEditId] = useState("");
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [openedOption, setOpenedOption] = useState(false);
  const [postedAt, setPostedAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(getUserInfo().user);
    setContent(post.content);
    setPostedAt(comparedDate(post.createdAt));
    setCreatedAt(post.createdAt);

    return () => clearInterval();
  }, []);

  useEffect(() => {
    likeThis();
    getThisPost();
  }, [liked]);

  const likeThis = async () => {
    const data = { userId: currentUser._id };
    const res = await fetchData(`/posts/${post.id}/like`, "PUT", getUserInfo().token, data);
    console.log(res);
  };

  const getThisPost = async () => {
    const thisPost = await fetchData(`/posts/${post.id}`, "GET", getUserInfo().token);
    thisPost.data.likes.forEach((like) => {
      if (getUserInfo().user._id === like) {
        setLiked(true);
      }
    });
    post = thisPost.data;
  };

  const editPost = async (e) => {
    e.preventDefault();

    const authorization = getUserInfo().token;
    const id = post._id;
    const url = `/posts/${id}`;
    const author = post.author._id;
    const userId = getUserInfo().user._id;

    const oldValue = post.content;
    const value = content;
    if (oldValue === value) {
      setIsEditing(false);
      setEditId("");
      setContent("");
      return;
    }

    const data = { userId: userId, author: author, content: value };

    const res = await fetchData(url, "PUT", authorization, data);
    if (res.status !== 200) console.log("can't edit post");
    else {
      console.log("post edited");
      setIsEditing(false);
      setEditId("");
      setContent("");
      window.location.reload();
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    const authorization = getUserInfo().token;
    const actualUser = currentUser._id;

    const url = "/posts/" + post._id;
    const data = { actualUser: actualUser };
    const res = await fetchData(url, "DELETE", authorization, data);
    if (res.status !== 200) console.log("Can't delete this post");
    else {
      window.location.reload();
      return;
    }
  };

  const updateTime = () => {
    setPostedAt(comparedDate(createdAt));
  };

  setInterval(() => {
    updateTime(createdAt);
  }, 60000);

  return (
    <div className="d-flex justify-content-center py-1" key={post._id}>
      <div className="post col-12 col-md-6 d-flex w-100 flex-column bg-dark" style={{ borderRadius: "4px" }}>
        <div className="head d-flex w-100 p-2">
          <Link to={`/profil/${post.author._id}`} className="col-2 col-lg-1 d-flex align-items-center justify-content-center">
            <img
              src={
                post.author.profilPicture === undefined || post.author.profilPicture === "none"
                  ? defaultPfp
                  : networkConfig.static + "/users/" + post.author._id + "/" + post.author.profilPicture
              }
              alt=""
              className="p-2"
              width="45px"
              height="45px"
              style={{ borderRadius: "50%", width: "45px", height: "45px", objectFit: "cover" }}
            />
          </Link>
          {!openedOption && (
            <div
              className="col-9 col-lg-10 d-flex flex-column justify-content-center"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profil/${post.author._id}`)}
            >
              <Link to={`/profil/${post.author._id}`}>
                <h6 className="m-0 px-1">{post.author.name}</h6>
              </Link>
              <small className="text-muted d-flex px-1" style={{ fontSize: "0.7rem" }}>
                {postedAt}
              </small>
            </div>
          )}
          {openedOption && (
            <div
              className="col-9 col-lg-10 d-flex justify-content-center mx-1 align-items-center bg-dark"
              style={{ postion: "absolute", borderRadius: "8px", boxShadow: "0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)" }}
            >
              <div className="edit mx-2 small" style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon="bookmark" size="sm" /> Save post
              </div>
              {post.author._id === currentUser._id && (
                <div className="edit mx-2 small" onClick={deletePost} style={{ cursor: "pointer" }}>
                  <FontAwesomeIcon icon="trash" size="sm" /> Delete
                </div>
              )}
              {post.author._id === currentUser._id && (
                <div
                  className="edit mx-2 small"
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setOpenedOption(!openedOption);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon="pencil" size="sm" /> Edit
                </div>
              )}
            </div>
          )}
          <div className="col-1 justify-content-center" style={{ position: "relative", display: "inline-block" }}>
            <FontAwesomeIcon icon={"ellipsis"} className="pt-3" onClick={() => setOpenedOption(!openedOption)} />
          </div>
        </div>
        {!isEditing && (
          <Link to={`/post/${post._id}`} className="p-2 d-flex" style={{ flexWrap: "wrap", textOverflow: "clip" }}>
            <div className="post-content m-0 px-2" style={{ maxWidth: "100%", whiteSpace: "pre-wrap", color: "white" }}>
              {post.content}
            </div>
          </Link>
        )}
        {isEditing && (
          <form onSubmit={editPost} className="px-1">
            <textarea
              className="w-100 form-control border-0 bg-dark"
              cols="10"
              rows="2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ backgroundColor: "#323232", color: "white", border: "solid 1px #222222", resize: "none" }}
            />
            <div className="px-1 py-1 d-flex" style={{ borderTop: "1px solid #666" }}>
              <button className="btn btn-primary btn w-50 mx-1 mt-1" type="submit">
                Save
              </button>
              <button className="btn btn-secondary btn w-50 mx-1 mt-1" type="button" onClick={() => setIsEditing(!isEditing)}>
                Cancel
              </button>
            </div>
          </form>
        )}
        {(post.picture === undefined || post.picture !== "none") && (
          <Link to={`/post/${post._id}`} className="images pb-2">
            <img src={networkConfig.static + "/posts/" + post._id + "/" + post.picture} alt="post" style={{ width: "100%", objectFit: "contain" }} />
          </Link>
        )}
        {!isEditing && (
          <div className="action d-flex flex-row px-1 pt-1" style={{ borderRadius: "4px" }}>
            <div className="w-100 d-flex" style={{ borderTop: "1px solid #666" }}>
              <div className="link w-100 me-1 mt-1">
                <div className="btn btn-dark w-100" onClick={() => setLiked(!liked)}>
                  <div className="d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={"heart"} className="p-1" color={liked ? "red" : "white"} />{" "}
                    {post.likes && post.likes.length > 0 && (
                      <span className="mx-1" style={{ fontSize: "12px" }}>
                        {post.likes.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link className="link w-100 mt-1" to={`/post/${post._id}`}>
                <div className="btn btn-dark w-100">
                  <div className="d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={"comment"} className="p-1" />{" "}
                    {post.comments && post.comments.length > 0 && (
                      <span className="p-0 m-0 mx-1" style={{ fontSize: "12px" }}>
                        {post.comments.length}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;