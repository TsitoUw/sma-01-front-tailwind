import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../shared/querry";
import CreatePost from "../post/CreatePost";
import { networkConfig } from "../../../shared/networkConfig";
import { getUserInfo, fetchData, showToastInOut } from "../../../shared/utiles";
import defaultPfp from "../../../assets/default-avatar.jpg";
import Post from "../post/Post";
import noPostSvg from "../../../assets/svg/undraw_post_re_mtr4.svg";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePaginate from "../../../shared/usePaginate";
import Toast from "../../toast/Toast";
import { useContext } from "react";
import { UserContext } from "../../../shared/user.context";

function Profile() {
  const id = window.location.pathname.split("/profile/")[1];
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [update, setUpdate] = useState(5);

  const { user: currentUser } = useContext(UserContext);
  let { loading, error, hasMore, entities } = usePaginate(`users/${id}/posts`, page, limit, "desc", update);

  const observer = useRef();
  const lastPostEltRef = useCallback(
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
    const { showToast, toastBody } = showToastInOut("Can't get posts");
    if (error) {
      setShowToast(showToast);
      setToastBody(toastBody);
    }
  }, [error]);

  const getThisUser = useCallback(async () => {
    const res = await getUser(id);
    setUser(res.data);
  }, [id]);

  useEffect(() => {
    setUpdate((u) => u + 2);
    getThisUser();
  }, [id]);

  const handleCreatePost = async (content) => {
    const authorization = currentUser.accessToken;
    if (!authorization) navigate("/login");
    const url = `/posts`;
    const author = currentUser._id;
    const data = { content: content, author: author };
    const res = await fetchData(url, "POST", authorization, data);
    if (res.status !== 201) {
      console.log("unable to post");
      return res;
    } else {
      setPage(1);
      return res;
    }
  };

  return (
    <div className="profil">
      <Toast body={toastBody} show={showToast} />
      <div className="d-flex container-fluid bg-dark justify-content-center" style={{ borderBottom: "1px solid #555555" }}>
        <div className="container row">
          <div className=" col-12 col-md-8 row pt-2 justify-content-center">
            <div className="pfp col-12 col-md-4 d-flex">
              <img
                src={
                  user.profilPicture === "none" || user.profilPicture === undefined
                    ? defaultPfp
                    : networkConfig.static + "/users/" + id + "/" + user.profilPicture
                }
                alt=""
                className="m-2"
                style={{ borderRadius: "50%", width: "120px", height: "120px", objectFit: "cover", border: "solid 2px #777777" }}
              />
            </div>
            <div className="info col-12 col-md-8 d-flex p-2 " style={{ alignItems: "flex-end" }}>
              <div className="name">
                <h3 className="p-0 m-0 pb-1" style={{ textTransform: "capitalize" }}>
                  {user.name}
                </h3>
                <p className="p-0 m-0">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="info-menu col-12 col-md-4 d-flex justify-content-center" style={{ alignItems: "flex-end" }}>
            <div className="menu d-flex p-2 justify-content-center">
              {currentUser._id === user._id && (
                <div className="edit-profil-btn w-100">
                  <button
                    className="btn btn-secondary mx-1 d-flex align-items-center justify-content-center w-100"
                    onClick={() => navigate(`/profil/${id}/edit`)}
                  >
                    <FontAwesomeIcon icon="bars" size="sm" className=" m-0 p-0 px-1" /> <div className=" m-0 p-0">Account Settings</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex row justify-content-center">
        <div className="col-12 col-md-5">
          {currentUser._id === user._id && (
            <div className="container-fluid">
              <CreatePost onCreatePost={handleCreatePost} onUpdate={setUpdate} placeHolder={"Post a status..."} />
            </div>
          )}
          <div className="post container-fluid d-flex flex-column">
            {entities.length < 1 && !loading && (
              <div className="d-flex justify-content-center">
                <img src={noPostSvg} alt="" width="350px" className="p-5" />
              </div>
            )}
            {entities.length > 0 &&
              entities.map((post, index) => {
                if (entities.length === index + 1)
                  return (
                    <div key={post._id} ref={lastPostEltRef}>
                      <Post post={post} />
                    </div>
                  );
                else
                  return (
                    <div key={post._id}>
                      <Post post={post} />
                    </div>
                  );
              })}
            {loading && (
              <div className="p-3 d-flex justify-content-center">
                <div className="spinner-grow sprinner-grow-sm text-muted"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
