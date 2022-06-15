import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { fetchData, getUserInfo } from "../../../shared/utiles";
import Header from "../header/Header";
import Post from "../post/Post";
import noPostSvg from "../../../assets/svg/undraw_absorbed_in_re_ymd6.svg";
import defaultPfp from "../../../assets/default-avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import { networkConfig } from "../../../shared/networkConfig";

function Search() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [postsLength, setPostsLength] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersLength, setUsersLength] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const onSearch = async (e) => {
    e.preventDefault();
    setPosts([]);
    setPostsLength(0);
    setUsers([]);
    setUsersLength(0);
    setIsSearching(true);
    await findUsers();
    await findPosts();
    setIsSearching(false);
    return;
  };

  const findPosts = async () => {
    const url = "/search/posts/" + text;
    let res = await fetchData(url, "GET", getUserInfo().token);
    setPosts(res.data);
    setPostsLength(res.data.length);
    return;
  };

  const findUsers = async () => {
    const url = "/search/users/" + text;
    let res = await fetchData(url, "GET", getUserInfo().token);
    setUsers(res.data);
    setUsersLength(res.data.length);
    return;
  };

  return (
    <div className="search">
      <div className="row">
        <div className="d-flex justify-content-center row">
          <form
            className="col-12 col-md-5 d-flex bg-dark p-2"
            onSubmit={onSearch}
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          >
            <input
              className="w-100 form-control"
              placeholder=" Search..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ backgroundColor: "#323232", color: "white", border: "solid 1px #222222", height: "2.6rem", borderRadius: "4px" }}
            ></input>
            <button className="btn btn-primary ms-1" type="submit">
              <FontAwesomeIcon icon="magnifying-glass" />
            </button>
          </form>
        </div>
        <div className="d-flex justify-content-center row">
          <div className="col-12 col-md-5">
            <div className="post d-flex flex-column w-100">
              {users.length > 0 && <p className="text-muted m-0 p-0 px-2 pt-2">People</p>}

              {users.length > 0 &&
                users.map((user) => {
                  return (
                    <div className="d-flex justify-content-center pt-2 mx-1" key={user._id}>
                      <div className="post col-12 col-md-6 d-flex w-100 flex-column bg-dark" style={{ borderRadius: "4px" }}>
                        <div className="head d-flex w-100 p-2">
                          <Link to={`/profil/${user._id}`} className="col-2 col-lg-1 d-flex align-items-center justify-content-center">
                            <img
                              src={
                                !user.profilPicture || user.profilPicture === "none"
                                  ? defaultPfp
                                  : networkConfig.static + "/users/" + user._id + "/" + user.profilPicture
                              }
                              alt=""
                              className="p-2"
                              style={{ borderRadius: "50%", width: "55px", height: "55px", objectFit: "cover" }}
                            />
                          </Link>
                          <div
                            className="col-9 col-lg-10 d-flex flex-column justify-content-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/profil/${user._id}`)}
                          >
                            <Link to={`/profil/${user._id}`}>
                              <h6 className="m-0 px-1">{user.name}</h6>
                            </Link>
                          </div>
                          <div className="col-1 d-flex justify-content-center">
                            <FontAwesomeIcon icon={"cloud"} className="pt-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center row">
          <div className="col-12 col-md-5">
            <div className="post d-flex flex-column w-100">
              {posts.length > 0 && <p className="text-muted m-0 p-0 px-2 pt-2">Post</p>}
              {posts.length > 0 && posts.map((post)=>{
                return(
                  <div key={post._id}>
                    <Post post={post} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center row">
          <div className="col-12 col-md-5">
            <div className="post d-flex flex-column w-100">
              {postsLength < 1 && usersLength < 1 && !isSearching && (
                <div className="d-flex justify-content-center">
                  <img src={noPostSvg} alt="" width="350px" className="p-5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="col-12 col-md-5 d-flex justify-content-center w-100">
            <div className="spinner-grow spinner-grow-xl text-muted my-3" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
