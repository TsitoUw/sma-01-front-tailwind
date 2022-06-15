import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CreatePost from "../post/CreatePost";
import Post from "../post/Post";
import { getUserInfo, fetchData } from "../../../shared/utiles";
import "./Home.css";
import noPostSvg from "../../../assets/svg/undraw_post_re_mtr4.svg";
import usePaginate from "../../../shared/usePaginate";
import { showToastInOut } from "../../../shared/utiles";
import Toast from "../../toast/Toast";

function Home() {
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [currentUser, setCurrentUser] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");

  const navigate = useNavigate();

  const { loading, error, hasMore, entities } = usePaginate(0, "posts", page, limit);

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

  useEffect(() => {
    setCurrentUser(getUserInfo());
  }, []);

  const handleCreatePost = async (content) => {
    const authorization = currentUser.token;
    if (!authorization) navigate("/login");
    const url = `/posts`;
    const author = currentUser.user._id;
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
    <div className="home">
      <Toast body={toastBody} show={showToast} />
      <div className="body d-flex flex-row row">
        {/* <div className="sidenav left bg-dark">
					left
				</div> */}
        <div className="content col-12 col-md-5">
          <div className="container-fluid">
            <CreatePost onCreatePost={handleCreatePost} placeHolder={"What's on your mind?"} />
          </div>
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

export default Home;
