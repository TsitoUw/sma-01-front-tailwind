import { basicAuth } from "./auth";
import { fetchData, removeItems } from "./utiles";

export const getPost = async (page, limit) => {
	const authorization = basicAuth().token;
	if (!authorization) window.location.href = "/login";
	const url = `/posts?page=${page}&limit=${limit}&sort=desc`;
	const res = await fetchData(url, "GET", authorization);
	if (res.status === 403) {
		console.log("session expired");
		sessionStorage.clear();
		window.location.href = "/login";
	}
	return { ...res, length: res.length };
};

export const getUser = async (id) => {
	const authorization = basicAuth().token;
	const url = "/users/" + id;
	const res = await fetchData(url, "GET", authorization);
	if (res.status === 403) {
		alert("session expired");
		removeItems("token");
		removeItems("info")
		window.location.href = "/login";
	}
	return res;
};

export const getUsersPosts = async (id, page, limit) => {
	const authorization = basicAuth().token;
	if (!authorization) window.location.href = "/login";
	const url = `/users/${id}/posts?page=${page}&limit=${limit}&sort=desc`;
	const res = await fetchData(url, "GET", authorization);
	if (res.status === 403) {
		console.log("session expired");
		sessionStorage.clear();
		window.location.href = "/login";
	}
	return { ...res, length: res.length };
};

