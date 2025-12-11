import { MenuItems } from "../../constants";

export const state = () => ({
	user: null,
	accessToken: null,
	isAuthenticated: false,
	selectedMenu: MenuItems.DASHBOARD,
	countries: null,
	cultures: null,
	phoneCodes: null,
	loading: false,
	screenLoader: {
		active: false,
		text: "Loading",
	},
	redirect: {
		signup: {
			redirectPending: false,
			handshakePending: false,
			redirectTo: null,
			handshakeWith: null,
		},
	},
	buffer: {},
});
