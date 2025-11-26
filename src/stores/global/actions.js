const setUser = function (user) {
	this.user = user;
};

const setAccessToken = function (token) {
	if (token) {
		this.accessToken = token;
		this.isAuthenticated = true;
	} else {
		this.accessToken = null;
		this.isAuthenticated = false;
	}
};

const setSelectedMenu = function (menu) {
	this.selectedMenu = menu;
};

const setAvatarUrl = function (avatarUrl) {
	if (this.user && this.user.profile) {
		this.user.profile.avatarUrl = avatarUrl;
	}
};

export const actions = {
	setUser,
	setAccessToken,
	setSelectedMenu,
	setAvatarUrl,
};
