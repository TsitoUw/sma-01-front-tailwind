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
  const [likesCount, setLikesCount] = useState(0);
  const [reload, setReload] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(getUserInfo().user);
    setContent(post.content);
    setPostedAt(comparedDate(post.createdAt));
    setCreatedAt(post.createdAt);
    setLikesCount(post.likes.length);

    return () => clearInterval();
  }, [post]);

  useEffect(() => {
    getThisPost();
  }, [reload]);

  const likeThis = async () => {
    setLiked((l) => !l);
    const id = getUserInfo().user._id;
    const data = { userId: id };
    const res = await fetchData(`/posts/${post._id}/like`, "PUT", getUserInfo().token, data);
    setLikesCount((c) => (c = res.data.likes.length));
    console.log(res.data.likes.length);
    setReload((r) => r + 1);
  };

  const getThisPost = async () => {
    const thisPost = await fetchData(`/posts/${post._id}`, "GET", getUserInfo().token);
    thisPost.data.likes.forEach((like) => {
      if (getUserInfo().user._id === like) {
        setLiked(true);
      }
    });
    setLikesCount(thisPost.data.likes.length);
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
    <div className="post px-2 py-1">
      <div className="bg-white flex flex-col rounded-lg">
        <div className="head flex w-100 p-2">
          <Link to={`/profile/${post.author._id}`} className="w-2/12 xl:w-1/12 flex justify-center items-center p-2">
            <img
              src={
                post.author.profilPicture === undefined || post.author.profilPicture === "none"
                  ? defaultPfp
                  : networkConfig.static + "/users/" + post.author._id + "/" + post.author.profilPicture
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
            onClick={() => navigate(`/profile/${post.author._id}`)}
          >
            <Link to={`/profile/${post.author._id}`}>
              <h6 className="font-semibold">{post.author.name}</h6>
            </Link>
            <small className="font-light text-xs text-slate-400">{postedAt}</small>
          </div>

          {/* {openedOption && (
          <div
            className=""
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
        )} */}
          <div className="w-1/12 flex justify-center">
            <FontAwesomeIcon icon={"ellipsis"} className="pt-2" onClick={() => setOpenedOption(!openedOption)} />
          </div>
        </div>
        {!isEditing && (
          <Link to={`/post/${post._id}`} className="text-slate-900 p-2">
            <div className="mx-2 my-1" style={{ maxWidth: "100%", whiteSpace: "pre-wrap" }}>
              {post.content}
            </div>
          </Link>
        )}
        {/* {isEditing && (
          <form onSubmit={editPost} className="">
            <textarea className="" cols="10" rows="2" value={content} onChange={(e) => setContent(e.target.value)} style={{ resize: "none" }} />
            <div className="">
              <button className="" type="submit">
                Save
              </button>
              <button className="" type="button" onClick={() => setIsEditing(!isEditing)}>
                Cancel
              </button>
            </div>
          </form>
        )} */}
        {(post.picture === undefined || post.picture !== "none") && (
          <Link to={`/post/${post._id}`} className="images object-contain">
            <img src={networkConfig.static + "/upload/" + post._id + "/" + post.picture} alt="post" />
          </Link>
        )}
        {!isEditing && (
          <div className="w-full flex p-2">
            <div
              className={
                liked
                  ? "w-4/12 text-rose-500 flex items-center justify-center border border-rose-500 px-4 py-1 rounded-lg mx-1 md:mx-2"
                  : "w-4/12 text-slate-400 flex items-center justify-center border border-slate-400 hover:border-rose-400 hover:text-rose-400 px-4 py-1 rounded-lg mx-1 md:mx-2"
              }
              onClick={() => {
                likeThis();
              }}
            >
              <FontAwesomeIcon icon={"heart"} className="p-1" /> {likesCount > 0 && <span className="mx-1 text-sm">{likesCount}</span>}
            </div>
            <Link
              className="w-4/12 text-slate-400 flex items-center justify-center border border-slate-400 px-4 py-1 rounded-lg mx-1 md:mx-2 hover:border-rose-400 hover:text-rose-400"
              to={`/post/${post._id}`}
            >
              <FontAwesomeIcon icon={"comment"} className="p-1" />{" "}
              {post.comments && post.comments.length > 0 && <span className="mx-1 text-sm">{post.comments.length}</span>}
            </Link>
            <div
              className={
                liked
                  ? "w-4/12 text-rose-500 flex items-center justify-center border border-rose-500 px-4 py-1 rounded-lg mx-1 md:mx-2"
                  : "w-4/12 text-slate-400 flex items-center justify-center border border-slate-400 px-4 py-1 rounded-lg mx-1 md:mx-2 hover:border-rose-400 hover:text-rose-400"
              }
              onClick={() => {
                likeThis();
              }}
            >
              <FontAwesomeIcon icon={"bookmark"} className="p-1" />{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
