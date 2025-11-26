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

const setLoader = function (value) {
	this.loading = value;
};

const setCountries = function (countries) {
	this.countries = countries;
};

const setCultures = function (cultures) {
	this.cultures = cultures;
};

const setPhoneCodes = function (phoneCodes) {
	this.phoneCodes = phoneCodes;
};

export const actions = {
	setUser,
	setAccessToken,
	setSelectedMenu,
	setAvatarUrl,
	setLoader,
	setCountries,
	setCultures,
	setPhoneCodes,
};
