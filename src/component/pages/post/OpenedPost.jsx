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

function OpenedPost() {
  const socket = useContext(SocketContext);
  const id = window.location.toString().split(networkConfig.front + "/post/")[1];
  const [post, setPost] = useState(null);
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [currentUser, setCurrentUser] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [forcedUpdate, setForcedUpdate] = useState(0);

  if (!id || id.trim() === "") window.history.back();

  const { loading, hasMore, error, entities } = usePaginate(forcedUpdate, `posts/${id}/comments`, 1, 8, "asc");

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
    const token = getUserInfo().token;

    const res = await fetchData(url, "GET", token);
    if (res.status !== 200) navigate(-1);
    else {
      setPost(res.data);
    }
  }, []);

  useEffect(() => {
    getUniquePost();
    setCurrentUser(getUserInfo().user);
  }, []);

  const commentPost = async (content) => {
    console.log("eto");
    const url = `/posts/${id}/comments`;
    const token = getUserInfo().token;
    const userId = getUserInfo().user._id;
    const data = {
      content: content,
      userId: userId,
    };
    const res = await fetchData(url, "POST", token, data);
    if (res.status !== 201) console.log("cannot comment");
    else {
      setForcedUpdate(forcedUpdate + 1);
      console.log(forcedUpdate);
    }
  };

  socket.on("is-writing", () => {
    setIsWriting(true);
  });

  socket.on("is-not-writing", () => {
    setIsWriting(false);
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
      <Toast body={toastBody} show={showToast} />

      <div className="d-flex justify-content-center">
        <div className="post col-12 col-md-5 d-flex flex-column bg-dark" style={{ borderBottomLeftRadius: "4px", borderBottomRightRadius: "4px" }}>
          {post && <Post post={post} />}
        </div>
      </div>
      <div className="row justify-content-center pb-5">
        {entities.length > 0 && (
          <div className="col-12 col-md-5 row gx-0 justify-content-center pb-5">
            {entities.map((comment, index) => {
              if (entities.length === index + 1)
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
            {isWriting && (
              <div className="w-100 d-flex justify-content-center align-items-center pt-1">
                someone is writing <span className="mx-2 spinner-grow spinner-grow-sm text-muted"></span>{" "}
              </div>
            )}
          </div>
        )}
        {loading && (
          <div className="w-100 d-flex justify-content-center pt-1 pb-5">
            <div className="spinner-grow sprinner-grow-sm text-muted"></div>
          </div>
        )}
        {isWriting && entities.length < 1 && <div className="w-100 d-flex justify-content-center pt-1">someone is writing...</div>}
        {entities.length < 1 && !loading && (
          <div className="col-12 col-md-5 pb-1">
            <div className="d-flex justify-content-center">
              <img src={noComments} alt="" width="250px" className="pt-3" />
            </div>
          </div>
        )}
        <div ref={commentEndRef} />
      </div>
      <CommentPost onCommentPost={commentPost} onFocus={focused} onBlur={blured} />
    </div>
  );
}

export default OpenedPost;
