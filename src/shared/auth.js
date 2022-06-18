import { getItems, removeItems } from "./utiles";

export const basicAuth = () => {
  if (!getItems("accessToken") || !getItems("userId")) {
    removeItems("accessToken");
    removeItems("userId");
    window.location.href = "/login";
    return;
  }
  const accessToken = getItems("accessToken");
  const userId = getItems("userId");

  return { accessToken, userId };
};
