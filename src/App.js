import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { socket, SocketContext } from "./shared/socket.context";
import LoaderLarger from "./component/loader/LoaderLarger";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEllipsis,
  faMessage,
  faBookmark,
  faCamera,
  faHome,
  faComment,
  faUserCircle,
  faMagnifyingGlass,
  faCancel,
  faCloud,
  faInfoCircle,
  faSignOut,
  faArrowLeft,
  faBars,
  faPencil,
  faHeart,
  faSignIn,
  faTrash,
  faBell,
  faEye,
  faEyeSlash,
  faCircleNotch,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Header from "./component/pages/header/Header";

library.add(
  faEllipsis,
  faMessage,
  faBookmark,
  faCamera,
  faHome,
  faComment,
  faUserCircle,
  faMagnifyingGlass,
  faCancel,
  faCloud,
  faInfoCircle,
  faSignOut,
  faArrowLeft,
  faBars,
  faPencil,
  faHeart,
  faSignIn,
  faTrash,
  faBell,
  faEye,
  faEyeSlash,
  faCircleNotch,
  faCircle
);

const Home = lazy(() => import("./component/pages/home/Home"));
const Login = lazy(() => import("./component/pages/login/Login"));
const Search = lazy(() => import("./component/pages/search/Search"));
const Profil = lazy(() => import("./component/pages/profil/Profil"));
const Register = lazy(() => import("./component/pages/register/Register"));
const OpenedPost = lazy(() => import("./component/pages/post/OpenedPost"));
const ProfilEdit = lazy(() => import("./component/pages/profil/ProfilEdit"));
const MessageHome = lazy(() => import("./component/pages/message/MessageHome"));

function App() {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <Router>
          <Suspense fallback={<LoaderLarger />}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/search"
                element={
                  <>
                    <Header />
                    <Search />
                  </>
                }
              />
              <Route
                path="/messages"
                element={
                  <>
                    <Header />
                    <MessageHome />
                  </>
                }
              />
              <Route
                path="/post/:id"
                element={
                  <>
                    <Header />
                    <OpenedPost />
                  </>
                }
              />
              <Route
                path="/profil/:id/edit"
                element={
                  <>
                    <Header />
                    <ProfilEdit />
                  </>
                }
              />
              <Route
                path="/profil/:id"
                element={
                  <>
                    <Header />
                    <Profil />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <Home />
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
