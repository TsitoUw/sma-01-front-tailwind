import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { networkConfig } from "../../../shared/networkConfig";
import { fetchData, getUserInfo, showToastInOut } from "../../../shared/utiles";
import "./Post.css";
import noComments from "../../../assets/svg/undraw_public_discussion_re_w9up.svg";
import Comment from "./comment/Comment";
import Toast from "../../toast/Toast";
import CommentPost from "./comment/CommentPost";
import Post from "./Post";
import { SocketContext } from "../../../shared/socket.context";
import usePaginate from "../../../shared/usePaginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../../shared/user.context";

function OpenedPost() {
  const socket = useContext(SocketContext);
  const { user } = useContext(UserContext);

  const id = window.location.pathname.split("/post/")[1];
  const [post, setPost] = useState(null);
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [update, setUpdate] = useState(0);

  if (!id || id.trim() === "") window.history.back();

  let { loading, hasMore, error, entities: comments } = usePaginate(`posts/${id}/comments`, page, limit, "asc", update);

  const navigate = useNavigate();
  const commentEndRef = useRef();
  const scrollToBottom = () => {
    commentEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("join-post", id);

    return () => socket.emit("leave-post", id);
  }, []);

  const observer = useRef();
  const lastCommentEltRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const { showToast, toastBody } = showToastInOut("Can't get comments");
    setShowToast(false);
    setToastBody(toastBody);
  }, [error]);

  const getUniquePost = useCallback(async () => {
    const url = `/posts/${id}`;
    const token = user.accessToken;

    const res = await fetchData(url, "GET", token);
    if (res.status !== 200) navigate(-1);
    else {
      setPost(res.data);
    }
  }, []);

  useEffect(() => {
    getUniquePost();
  }, [update]);

  const commentPost = async (content) => {
    const url = `/posts/${id}/comments`;
    const token = user.accessToken;
    const userId = user._id;
    const data = {
      content: content,
      userId: userId,
    };
    const res = await fetchData(url, "POST", token, data);
    if (res.status !== 201) console.log("cannot comment");
    else {
      socket.emit("commenting", id);
      setUpdate((u) => u + 2);
    }
  };

  socket.on("is-writing", () => {
    setIsWriting(true);
  });

  socket.on("is-not-writing", () => {
    setIsWriting(false);
  });

  socket.on("commented", () => {
    console.log("someone commented");
    setUpdate((u) => u + 2);
  });

  const focused = (e) => {
    e.preventDefault();
    socket.emit("writing", id);
  };

  const blured = (e) => {
    e.preventDefault();
    socket.emit("not-writing", id);
  };

  return (
    <div className="openedPost">
      <div className="">{post && <Post post={post} />}</div>
      <CommentPost onCommentPost={commentPost} onFocus={focused} onBlur={blured} />
      {isWriting && <div className="w-full text-slate-400 flex justify-center items-center animate-pulse">someone is writing...</div>}
      <div className="flex flex-col mt-2">
        {comments.length > 0 && (
          <div className="">
            {comments.map((comment, index) => {
              if (comments.length === index + 1)
                return (
                  <div key={comment._id} ref={lastCommentEltRef}>
                    <Comment comment={comment} />
                  </div>
                );
              else
                return (
                  <div key={comment._id}>
                    <Comment comment={comment} />
                  </div>
                );
            })}
          </div>
        )}
        {loading && (
          <div className="w-full flex justify-center items-center p-10">
            <FontAwesomeIcon icon="circle-notch" size="lg" className="text-rose-400 mx-1 animate-spin" />
          </div>
        )}

        {comments.length < 1 && !loading && (
          <div className="w-full flex justify-center items-center p-5">
            <img src={noComments} alt="" width="200px" />
          </div>
        )}
        <div ref={commentEndRef} />
      </div>
    </div>
  );
}

export default OpenedPost;
