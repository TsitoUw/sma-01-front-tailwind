import React, { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { networkConfig } from "../../../shared/networkConfig";
import { fetchData, getUserInfo, removeItems, setItems } from "../../../shared/utiles";
import { getUser } from "../../../shared/querry";
import defaultPfp from "../../../assets/default-avatar.jpg";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toast from "../../toast/Toast";

function ProfileEdit() {
  let id = getUserInfo().user._id;
  const [currentUser, setCurrentUser] = useState(getUserInfo().user);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [_src, set_Src] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [addImageLoading, setAddImageLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef();

  const getThisUser = useCallback(async () => {
    const res = await getUser(getUserInfo().user._id);
    setUser(res.data);
    setName(res.data.name);
    setEmail(res.data.email);
    if (res.data._id !== currentUser._id) {
      navigate(-1);
    }
    return res.data;
  }, [id]);

  useEffect(() => {
    getThisUser();
  }, [getThisUser]);

  const handlePhotoFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(fileInputRef.current.files[0]);
    fileReader.onloadend = () => {
      setUploadFile(fileInputRef.current.files[0]);
      set_Src([fileReader.result]);
    };
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const photoData = new FormData();
    photoData.append("photo", uploadFile);
    setAddImageLoading(true);

    const url = networkConfig.url + "/users/" + id + "/profil/picture";
    const data = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: getUserInfo().token,
      },
      body: photoData,
    });

    const res = await data.json();

    if (res) {
      set_Src(null);
      const user = await getThisUser();
      const info = JSON.stringify({ _id: user._id, name: user.name, email: user.email, profilPicture: user.profilPicture });
      removeItems("info");
      setItems("info", info);
    }
    showToastInOut("Profil picture updated");
    setAddImageLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    if (!name || name.length < 3) {
      setIsUpdating(false);
      return showToastInOut("name should be atleast 3 characters");
    }
    if (!email) {
      setIsUpdating(false);
      return showToastInOut("invalid email");
    }

    const data = { name, email };

    const url = "/users/" + user._id;
    const res = await fetchData(url, "PUT", getUserInfo().token, data);
    getThisUser();
    if (res.status > 200) {
      showToastInOut(res.error);
      setIsUpdating(false);
      return;
    }
    let info = { _id: res.data._id, name: res.data.name, email: res.data.email, profilPicture: res.data.profilPicture };
    info = JSON.stringify(info);
    setIsUpdating(false);
    setItems("info", info);
    setCurrentUser(info);
    showToastInOut("Informations updated");
  };

  const showToastInOut = (body, extTime = 5000) => {
    setShowToast(true);
    setToastBody(body);
    setTimeout(() => {
      setShowToast(false);
    }, extTime);
    return;
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="edit-profil">
      <Toast body={toastBody} show={showToast} />
      <div className="d-flex container-fluid bg-dark justify-content-center" style={{ borderBottom: "1px solid #555555" }}>
        <div className="container row">
          <div className=" col-12 col-md-8 row pt-2 justify-content-center">
            <div className="pfp col-12 col-md-4 d-flex ">
              {_src ? (
                <img
                  src={_src}
                  // src={user.profilPicture !== "none" ? networkConfig.static+"/users/"+id+"/"+user.profilPicture : defaultPfp}
                  className="m-2"
                  style={{
                    borderRadius: "50%",
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    border: "solid 2px #777777",
                    opacity: _src ? "40%" : "",
                    cursor: "pointer",
                  }}
                  alt="profile"
                  onClick={() => fileInputRef.current.click()}
                />
              ) : (
                <img
                  src={
                    user.profilPicture === undefined || user.profilPicture === "none"
                      ? defaultPfp
                      : networkConfig.static + "/users/" + id + "/" + user.profilPicture
                  }
                  className="m-2"
                  style={{
                    borderRadius: "50%",
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    border: "solid 2px #777777",
                    opacity: _src ? "40%" : "",
                    cursor: "pointer",
                  }}
                  alt="profile"
                  onClick={() => fileInputRef.current.click()}
                />
              )}
              <div
                className="p-2 d-flex justify-content-center align-items-center"
                style={{
                  width: "35px",
                  height: "35px",
                  backgroundColor: "grey",
                  position: "absolute",
                  top: "155px",
                  marginLeft: "100px",
                  borderRadius: "50px",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <FontAwesomeIcon icon="camera" style={{ cursor: "pointer" }} />
              </div>
            </div>
            <div className="info col-12 col-md-8 d-flex p-2 " style={{ alignItems: "flex-end" }}>
              <div className="name w-100">
                <form className="import-image d-flex" style={{ alignItems: "flex-end" }} onSubmit={handleSave}>
                  <input
                    type="file"
                    accept=".jpeg,.jpg,.png"
                    ref={fileInputRef}
                    name="profile-picture"
                    className="d-none"
                    onChange={handlePhotoFileChange}
                  />
                  {_src ? (
                    <div className="w-100">
                      <button type="submit" className="btn btn-primary mx-1" disabled={addImageLoading}>
                        Save {addImageLoading && <span className="spinner-grow spinner-grow-sm ms-1"></span>}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary mx-1"
                        onClick={() => {
                          set_Src(null);
                          setUploadFile(null);
                        }}
                      >
                        cancel
                      </button>
                    </div>
                  ) : (
                    <div className="w-100">
                      <h4 className="px-2" style={{ cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                        Change profile picture
                      </h4>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="info-menu col-12 col-md-4 d-flex justify-content-center" style={{ alignItems: "flex-end" }}>
            <div className="menu d-flex p-2 w-100 justify-content-center">
              <div className="edit-profil-btn">
                <button className="btn btn-secondary w-100" onClick={() => navigate(-1)}>
                  <FontAwesomeIcon icon="arrow-left" size="sm" className="px-1" /> Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex row gx-0 justify-content-center">
        <form className="content col-12 col-md-5" onSubmit={updateUser}>
          <h5 className="pt-2 ps-2 m-0 text-muted">
            <FontAwesomeIcon icon="pencil" size="xs" className="mx-1" /> Edit your informations{" "}
          </h5>
          <div className="name pt-2">
            <div className="bg-dark p-2 mx-1" style={{ borderRadius: "4px" }}>
              <small className="p-0 m-0 px-2 text-muted">Name</small>
              <div style={{ borderBottom: "2px solid #555555" }} className="px-2 pt-1">
                <input
                  type="text"
                  className="pt-2 pb-1 w-100 bg-dark"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  style={{ border: "none", color: "white", outline: "none" }}
                  required
                />
              </div>
            </div>
          </div>
          <div className="email pt-2">
            <div className="bg-dark p-2 mx-1" style={{ borderRadius: "4px" }}>
              <small className="p-0 m-0 px-2 text-muted">Email</small>
              <div style={{ borderBottom: "2px solid #555555" }} className="px-2 pt-1">
                <input
                  type="email"
                  className="pt-2 pb-1 w-100 bg-dark"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  style={{ border: "none", color: "white", outline: "none" }}
                  required
                />
              </div>
            </div>
          </div>
          <div className="save d-flex flex-column my-3">
            <button type="submit" className="btn btn-primary mx-1" disabled={isUpdating}>
              Save {isUpdating && <span className="spinner-grow spinner-grow-sm ms-1"></span>}
            </button>
          </div>
          <div className="logout d-flex flex-column my-2" style={{ justifyContent: "space-between" }}>
            <h5 className="pt-2 ps-2 m-0 text-muted">
              <FontAwesomeIcon icon="sign-out" size="xs" className="mx-1" /> Log out{" "}
            </h5>
            <button type="button" className="btn btn-danger mx-1 my-2 d-flex align-items-center justify-content-center" onClick={onLogout}>
              <FontAwesomeIcon icon="sign-out" className="mx-1" />
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
