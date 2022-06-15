import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData, setItems } from "../../../shared/utiles";
import "../register/Register.css";
import loginSvg from "../../../assets/svg/undraw_my_password_re_ydq7.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [keepLogged, setKeepLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setShowErr(false);
    e.preventDefault();
    const data = { email: email, password: password, keepLogged: keepLogged };
    const res = await fetchData("/users/authenticate", "POST", "", data);
    if (res.status !== 200) {
      setShowErr(true);
      setIsLoading(false);
    } else {
      const info = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        profilPicture: res.data.profilPicture,
      };
      const token = "Bearer " + res.accessToken;
      setItems("token", token);
      setItems("info", JSON.stringify(info));
      setIsLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="register flex">
      <div className="deco w-3/5 flex justify-center items-center">
        <img src={loginSvg} alt="register" width="350px" />
      </div>
      <div className="connection w-full md:w-2/5 flex flex-col justify-center items-center px-0 md:px-8">
        <div className="card h-full md:h-auto">
          <header className="bg-indigo-500 rounded-none md:rounded-t-xl p-4">
            <h3 className="text-white text-center">Log in</h3>
          </header>
          <form onSubmit={handleSubmit} className="flex flex-col p-2">
            <div className="input-container">
              <input
                className="log-input"
                type="email"
                value={email}
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onFocus={() => setShowErr(false)}
              />
            </div>
            <div className="flex rounded-sm h-10 my-2">
              <input
                className="w-11/12 h-full bg-slate-600 p-2 text-white rounded-l-md"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassowrd(e.target.value);
                }}
                onFocus={() => {
                  setShowErr(false);
                }}
              />
              <div
                className="w-1/12 flex justify-center items-center h-full bg-slate-600 p-2 text-white rounded-r-md"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} size="sm" />
              </div>
            </div>

            <div className="my-2">
              <button type="submit" className="bg-sky-500 text-white flex justify-center items-center p-2 w-full rounded-md" disabled={isLoading}>
                <FontAwesomeIcon icon="sign-in" className="mx-1" />
                Authenticate {isLoading && <FontAwesomeIcon icon="circle-notch" size="sm" className="text-gray-100 mx-1 animate-spin" />}
              </button>
            </div>
            <div className="my-2">
              <p className="text-center">
                create an account{" "}
                <Link to="/register" className="text-sky-600">
                  here
                </Link>
              </p>
            </div>
            <div className="my-2 text-center text-sm text-red-600">
              {showErr && <p className="">Verify your email or password</p>}
              {!showErr && <p style={{ color: "transparent" }}>gotcha xD</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
