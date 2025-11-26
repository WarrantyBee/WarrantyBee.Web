import maleAvatar from "../../assets/male_avatar.png";
import femaleAvatar from "../../assets/female_avatar.png";
import { Genders } from "../../constants";

const getUser = function (state) {
	return state.user;
};

const getUserFullName = function (state) {
	return `${state.user?.firstname || ""} ${state.user?.lastname || ""}`.trim();
};

const getUserEmail = function (state) {
	return state.user?.email || "";
};

const getAvatarUrl = function (state) {
	return (
		state.user?.profile?.avatarUrl ||
		(state.user?.profile?.gender === Genders.FEMALE ? femaleAvatar : maleAvatar)
	);
};

const getAccessToken = function (state) {
	return state.accessToken;
};

const getIsAuthenticated = function (state) {
	return state.isAuthenticated;
};

const getSelectedMenu = function (state) {
	return state.selectedMenu;
};

export const getters = {
	getUser,
	getUserFullName,
	getUserEmail,
	getAvatarUrl,
	getAccessToken,
	getIsAuthenticated,
	getSelectedMenu,
};
