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
    <div
      className="bg-dark mb-1"
      style={{ borderBottomLeftRadius: "4px", borderBottomRightRadius: "4px" }}
      onBlur={() => setFocused(false)}
      onClick={() => setFocused(true)}
    >
      <Toast body={toastBody} show={showToast} />
      <form className="d-flex flex-column p-2" onSubmit={handleCreatePost}>
        <div className="m-1 row">
          <div className="col-2 col-xl-1 d-flex justify-content-center" style={{ alignItems: "self-start" }}>
            <img
              src={
                getUserInfo().user.profilPicture === "none" || !getUserInfo().user.profilPicture
                  ? defaultPfp
                  : networkConfig.static + "/users/" + getUserInfo().user._id + "/" + getUserInfo().user.profilPicture
              }
              alt=""
              className="p-2"
              style={{ borderRadius: "50%", width: "45px", height: "45px", objectFit: "cover" }}
            />
          </div>
          <div className="col-10 col-xl-11">
            <textarea
              className="w-100 form-control"
              placeholder={placeHolder}
              cols="10"
              rows="2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ backgroundColor: "#323232", color: "white", border: "solid 1px #222222", resize: "none" }}
            />
          </div>
          <input type="file" accept=".jpeg,.jpg,.png" ref={fileInputRef} name="profile-picture" className="d-none" onChange={handlePhotoFileChange} />
        </div>
        <div className="m-1 row">
          <div className="col-2 col-xl-1"></div>
          <div className="col-10 col-xl-11 row gx-0 p-0 m-0 align-items-center">
            <div className="col-1 d-flex justify-content-center p-1">
              <button type="button" className="btn text-white m-0 p-0" onClick={() => fileInputRef.current.click()}>
                <FontAwesomeIcon icon={"camera"} />
              </button>
            </div>
            <div className="col-11">
              <p className="m-0 p-0 w-100 text-muted" style={{ cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                Photo
              </p>
            </div>
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={content === "" || content.trim() === "" ? true : false}>
            Post
          </button>
          {_src && (
            <div className="w-100 pt-2 d-flex" style={{ position: "relative" }}>
              <img src={_src} alt="" style={{ width: "100%", height: "auto", objectFit: "cover", opacity: "40%", borderRadius: "2%" }} />
              {addImageLoading && <div style={{ position: "absolute", left: "50%", top: "50%" }} className="spinner-grow sprinner-grow-sm"></div>}
              <FontAwesomeIcon
                icon="cancel"
                className="m-2"
                style={{ position: "absolute", cursor: "pointer" }}
                onClick={() => {
                  fileInputRef.current.value = "";
                  set_Src(null);
                  setUploadFile(null);
                }}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
