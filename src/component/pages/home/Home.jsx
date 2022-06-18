import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CreatePost from "../post/CreatePost";
import Post from "../post/Post";
import { fetchData } from "../../../shared/utiles";
import "./Home.css";
import noPostSvg from "../../../assets/svg/undraw_post_re_mtr4.svg";
import usePaginate from "../../../shared/usePaginate";
import { showToastInOut } from "../../../shared/utiles";
import Toast from "../../toast/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../../shared/user.context";

function Home() {
  const { user } = useContext(UserContext);
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [update, setUpdate] = useState(5);

  const navigate = useNavigate();

  const { loading, error, hasMore, entities } = usePaginate("posts", page, limit, "desc", update);

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

  const handleCreatePost = async (content) => {
    const authorization = user.accessToken;
    if (!authorization) navigate("/login");
    const url = `/posts`;
    const author = user._id;
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
    <div className="home px-0 md:px-4">
      <Toast body={toastBody} show={showToast} />
      <div className="body">
        <div className="content ">
          <CreatePost onCreatePost={handleCreatePost} onUpdate={setUpdate} placeHolder={"Share your thought"} />
          <div className="post">
            {entities.length < 1 && !loading && (
              <div className="flex justify-center items-center">
                <img src={noPostSvg} alt="" width="350px" className="p-20" />
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
              <div className="w-full flex justify-center items-center p-10">
                <FontAwesomeIcon icon="circle-notch" size="lg" className="text-rose-400 mx-1 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
