import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData, setItems } from "../../../shared/utiles";
import "./Register.css";
import registerSvg from "../../../assets/svg/undraw_thought_process_re_om58.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [passwordConfirmation, setPassowrdConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setShowErr(false);
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setShowErr(true);
      setPassErr(true);
      setIsLoading(false);
      return;
    }
    const data = { name: name, email: email, password: password };
    const res = await fetchData("/users/", "POST", "", data);
    if (res.status !== 201) {
      setShowErr(true);
      setIsLoading(false);
    } else {
      const data = { email: email, password: password, keepLogged: true };
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
        setItems("token", "Bearer " + res.accessToken);
        setItems("info", JSON.stringify(info));
        setIsLoading(false);
        navigate("/");
      }
    }
  };

  return (
    <div className="register flex">
      <div className="deco w-3/5 flex justify-center items-center">
        <img src={registerSvg} alt="register" width="450px" />
      </div>
      <div className="connection w-full md:w-2/5 flex flex-col justify-center items-center px-0 md:px-8">
        <div className="card h-full md:h-auto">
          <header className="bg-rose-500 rounded-none md:rounded-t-xl p-4">
            <h3 className="text-white text-center">Create an account</h3>
          </header>
          <form onSubmit={handleSubmit} className="flex flex-col p-2">
            <div className="input-container">
              <input
                className="log-input"
                type="text"
                placeholder="user name (optional)"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onFocus={() => setShowErr(false)}
              />
            </div>
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
                className="w-11/12 h-full bg-slate-600 p-2 text-white text-sm rounded-l-md"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassowrd(e.target.value);
                }}
                onFocus={() => {
                  setShowErr(false);
                  setPassErr(false);
                }}
              />
              <div
                className="w-1/12 flex justify-center items-center h-full bg-slate-600 p-2 text-white rounded-r-md"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} size="sm" />
              </div>
            </div>
            <div className="input-container">
              <input
                className="log-input"
                type="password"
                placeholder="confirm your password"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPassowrdConfirmation(e.target.value);
                }}
                onFocus={() => {
                  setShowErr(false);
                  setPassErr(false);
                }}
              />
            </div>
            <div className="my-2">
              <button type="submit" className="bg-sky-500 text-white flex justify-center items-center p-2 w-full rounded-md" disabled={isLoading}>
                <FontAwesomeIcon icon="sign-in" className="mx-1" />
                Register {isLoading && <FontAwesomeIcon icon="circle-notch" size="sm" className="text-gray-100 mx-1 animate-spin" />}
              </button>
            </div>
            <div className="my-2">
              <p className="text-center">
                already have an{" "}
                <Link to="/login" className="text-sky-600">
                  account
                </Link>{" "}
                ?
              </p>
            </div>
            <div className="my-2 text-center text-sm text-red-600">
              {!passErr && showErr && <p className="">Verify your email or password</p>}
              {passErr && showErr && <p className="">Your password doesn't match</p>}
              {!showErr && <p style={{ color: "transparent" }}>gotcha xD</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
