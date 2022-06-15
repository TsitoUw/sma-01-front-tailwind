import { networkConfig } from "./networkConfig";

export const getUserInfo = () => {
	const info = getItems("info");
	let user = {};
	if (info) user = JSON.parse(info);
	const token = getItems("token");
	return { user: user, token: token };
};

export const fetchData = async (url, method = "GET", authorization = "", body = "", file = null) => {
	url = networkConfig.url + url;
	let res;
	if (body) body = JSON.stringify(body);
	if (method === "GET") {
		res = await fetch(url, {
			method: method,

			headers: {
				Authorization: authorization,
			},
		});
	} else {
		res = await fetch(url, {
			method: method,
			headers: {
				"Content-Type": "application/json",
				Authorization: authorization,
			},
			body: body,
			file : file,
		});
	}
	const data = await res.json();
	if(data.status === 403){
		alert("session expired");
		removeItems("info");
		removeItems("token");
		return window.location.href = "/login"
		
	}
	return data;
};

export const setItems = (iname, ivalue) => {
	window.localStorage.setItem(iname, ivalue);
	return;
};

export const getItems = (iname) => {
	if(window.localStorage.getItem(iname)) return window.localStorage.getItem(iname)
	return "";
};

export const removeItems = (iname) => {
	 window.localStorage.removeItem(iname)
	return;
};

export const showToastInOut = (body, extTime = 5000) => {
	let showToast = true;
	let toastBody = body || "";
	setTimeout(() => {
		showToast = false;
	}, extTime);
	return {showToast, toastBody};
};