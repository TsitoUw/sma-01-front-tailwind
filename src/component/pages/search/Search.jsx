import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { fetchData, getUserInfo } from "../../../shared/utiles";
import Post from "../post/Post";
import noPostSvg from "../../../assets/svg/undraw_searching.svg";
import defaultPfp from "../../../assets/default-avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import { networkConfig } from "../../../shared/networkConfig";
import { SearchInput } from "./SearchInput";
import ProfileHeader from "../profile/ProfileHeader";

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
    const url = "/posts/search/" + text;
    let res = await fetchData(url, "GET", getUserInfo().token);
    setPosts(res.data);
    setPostsLength(res.data.length);
    return;
  };

  const findUsers = async () => {
    const url = "/users/search/" + text;
    let res = await fetchData(url, "GET", getUserInfo().token);
    setUsers(res.data);
    setUsersLength(res.data.length);
    return;
  };

  return (
    <div className="search">
      <SearchInput onSearch={onSearch} setText={setText} text={text} />
      <div className="flex justify-center">
        <div className="user flex flex-col w-full">
          {users.length > 0 && <p className="text-slate-400 m-0 p-0 px-4 pt-2">People</p>}

          {users.length > 0 &&
            users.map((user) => {
              return (
                <div key={user._id}>
                  <ProfileHeader user={user} />
                </div>
              );
            })}
        </div>
      </div>
      <div className="d-flex justify-content-center row">
        <div className="col-12 col-md-5">
          <div className="post d-flex flex-column w-100">
            {posts.length > 0 && <p className="text-slate-400 m-0 p-0 px-4 pt-2">Post</p>}
            {posts.length > 0 &&
              posts.map((post) => {
                return (
                  <div key={post._id}>
                    <Post post={post} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="post flex flex-column w-100">
          {postsLength < 1 && usersLength < 1 && !isSearching && (
            <div className="flex justify-center">
              <img src={noPostSvg} alt="" width="350px" className="p-20" />
            </div>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="w-full flex justify-center items-center p-10">
          <FontAwesomeIcon icon="circle-notch" size="lg" className="text-rose-400 mx-1 animate-spin" />
        </div>
      )}
    </div>
  );
}

export default Search;
