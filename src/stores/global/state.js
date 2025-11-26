import { MenuItems } from "../../constants";

export const state = () => ({
	user: null,
	accessToken: null,
	isAuthenticated: false,
	selectedMenu: MenuItems.DASHBOARD,
});
