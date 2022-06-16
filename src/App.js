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
import { Layout } from "./component/layout/Layout";

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
const Profile = lazy(() => import("./component/pages/profile/Profile"));
const Register = lazy(() => import("./component/pages/register/Register"));
const OpenedPost = lazy(() => import("./component/pages/post/OpenedPost"));
const ProfilEdit = lazy(() => import("./component/pages/profile/ProfileEdit"));
const MessageHome = lazy(() => import("./component/pages/message/MessageHome"));

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Suspense fallback={<LoaderLarger />}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/search"
              element={
                <Layout>
                  <Search />
                </Layout>
              }
            />
            <Route
              path="/messages"
              element={
                <Layout>
                  <MessageHome />
                </Layout>
              }
            />
            <Route
              path="/post/:id"
              element={
                <Layout>
                  <OpenedPost />
                </Layout>
              }
            />
            <Route
              path="/profil/:id/edit"
              element={
                <Layout>
                  <ProfilEdit />
                </Layout>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
