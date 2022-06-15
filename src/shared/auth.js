import { getItems, removeItems } from "./utiles";

export const basicAuth = () => {
	if (!getItems("token") || !getItems("info")) {
		removeItems("token");
		removeItems("info");
		window.location.href = "/login";
		return;
	}
	const token = getItems("token");
	const info = getItems("info");
	let user = {};
	try {
		user = JSON.parse(info);
	} catch (error) {}
	return { token, user };
};
