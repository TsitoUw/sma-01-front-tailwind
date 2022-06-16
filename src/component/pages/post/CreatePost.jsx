import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networkConfig } from "../../../shared/networkConfig";
import { getUserInfo } from "../../../shared/utiles";
import { getUser } from "../../../shared/querry";
import defaultPfp from "../../../assets/default-avatar.jpg";
import Toast from "../../toast/Toast";
import { useNavigate } from "react-router-dom";

function CreatePost({ onCreatePost, placeHolder }) {
  const [user, setUser] = useState({});
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);
  const [_src, set_Src] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef();
  const [addImageLoading, setAddImageLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    let postId;
    const res = await onCreatePost(content);
    if (!res || res.status !== 201) return showToastInOut("Post title shouldn't be not empty");
    if (res && res.status === 201) {
      setContent("");
      postId = res.data._id;
      if (uploadFile !== null) await handleSave(e, postId);
      // window.location.reload();
    }
  };

  const getThisUser = useCallback(async () => {
    const res = await getUser(getUserInfo().user._id);
    setUser(res.data);
  }, []);

  useEffect(() => {
    getThisUser();
  }, [getThisUser]);

  const handlePhotoFileChange = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.readAsDataURL(fileInputRef.current.files[0]);
    fileReader.onloadstart = () => {
      setAddImageLoading(true);
      console.log("uploading...");
    };
    fileReader.onloadend = () => {
      setAddImageLoading(false);
      console.log("uploaded :)");
      setUploadFile(fileInputRef.current.files[0]);
      set_Src([fileReader.result]);
    };
  };

  const handleSave = async (e, id) => {
    e.preventDefault();
    const photoData = new FormData();
    photoData.append("photo", uploadFile);
    setAddImageLoading(true);

    const url = networkConfig.url + "/posts/" + id + "/picture";

    const data = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: getUserInfo().token,
      },
      body: photoData,
    });

    const res = await data.json();
    if (res.data) {
      setUploadFile(null);
      set_Src(null);
      getThisUser();
      if (fileInputRef.current.files) {
        fileInputRef.current.files = null;
      }
    }

    setAddImageLoading(false);
  };

  const showToastInOut = (body, extTime = 5000) => {
    setShowToast(true);
    setToastBody(body);
    setTimeout(() => {
      setShowToast(false);
    }, extTime);
    return;
  };

  return (
    <div className="bg-white rounded-b-xl">
      <Toast body={toastBody} show={showToast} />
      <form className="flex flex-col items-center" onSubmit={handleCreatePost}>
        <div className="flex items-center w-full">
          <div className="flex w-10/12">
            <div className="aspect-square rounded-full w-2/12 flex justify-center items-center">
              <img
                src={
                  getUserInfo().user.profilPicture === "none" || !getUserInfo().user.profilPicture
                    ? defaultPfp
                    : networkConfig.static + "/users/" + getUserInfo().user._id + "/" + getUserInfo().user.profilPicture
                }
                alt=""
                className="p-2 w-14"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="flex justify-center items-center w-10/12">
              <div className="w-full flex items-center">
                <textarea
                  onBlur={() => setFocused(false)}
                  onClick={() => setFocused(true)}
                  className="bg-slate-100 w-full p-2 rounded-xl resize-none my-2"
                  placeholder={placeHolder}
                  value={content}
                  rows={focused ? "4" : "1"}
                  type="text"
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
            <input
              type="file"
              accept=".jpeg,.jpg,.png"
              ref={fileInputRef}
              name="profile-picture"
              className="hidden"
              onChange={handlePhotoFileChange}
            />
          </div>
          {content === "" || content.trim() === "" ? (
            <div className="w-2/12 flex flex-col justify-center">
              <div className="flex justify-center">
                <button type="button" className="text-slate-800" onClick={() => fileInputRef.current.click()}>
                  <FontAwesomeIcon icon={"images"} />
                </button>
              </div>
              <div className="flex justify-center">
                <p className="text-xs" style={{ cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                  Photo
                </p>
              </div>
            </div>
          ) : (
            <div className="w-2/12 flex justify-centera items-center">
              <button
                className="mx-2 w-full h-9 rounded-xl flex items-center justify-center text-blue-500 hover:text-white border-blue-400 border active:bg-blue-500 hover:bg-blue-500"
                type="submit"
                disabled={content === "" || content.trim() === "" ? true : false}
              >
                Post
              </button>
            </div>
          )}
        </div>
      </form>
      {_src && (
        <div className="object-cover opacity-40 relative text-slate-100">
          <img src={_src} alt="post" className="rounded-xl" />
          <FontAwesomeIcon
            icon="cancel"
            className="m-2 absolute top-0"
            style={{ cursor: "pointer" }}
            onClick={() => {
              fileInputRef.current.value = "";
              set_Src(null);
              setUploadFile(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CreatePost;
