import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "./shared/user.context";

function Test() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    console.log(user);
  });
  return <div>{JSON.stringify(user)}</div>;
}

export default Test;
