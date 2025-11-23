import { defineStore } from "pinia";
import maleAvatar from "../assets/male_avatar.png";
import femaleAvatar from "../assets/female_avatar.png";
import { Genders, MenuItems } from "../constants";

export const useGlobalStore = defineStore("global", {
	state: () => ({
		user: null,
		accessToken: null,
		isAuthenticated: false,
		selectedMenu: MenuItems.DASHBOARD,
	}),
	persist: true,
	getters: {
		getUser: (state) => state.user,
		getUserFullName: (state) =>
			`${state.user?.firstname || ""} ${state.user?.lastname || ""}`.trim(),
		getAvatarUrl: (state) =>
			state.user?.profile?.avatarUrl ||
			(state.user?.profile?.gender === Genders.FEMALE
				? femaleAvatar
				: maleAvatar),
		getAccessToken: (state) => state.accessToken,
		getIsAuthenticated: (state) => state.isAuthenticated,
		getSelectedMenu: (state) => state.selectedMenu,
	},
	actions: {
		setUser(user) {
			this.user = user;
		},
		setAccessToken(token) {
			if (token) {
				this.accessToken = token;
				this.isAuthenticated = true;
			} else {
				this.accessToken = null;
				this.isAuthenticated = false;
			}
		},
		setSelectedMenu(menu) {
			this.selectedMenu = menu;
		},
	},
});
