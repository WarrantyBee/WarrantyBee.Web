import { OAuthCallbacks } from "../../constants";

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

const setUserProfile = function (profile) {
	if (profile) {
		if (profile.hasOwnProperty("phoneCode")) {
			this.user.profile.phoneCode = profile.phoneCode;
		}
		if (profile.hasOwnProperty("phoneNumber")) {
			this.user.profile.phoneNumber = profile.phoneNumber;
		}
		if (profile.hasOwnProperty("avatarUrl")) {
			this.user.profile.avatarUrl = profile.avatarUrl;
		}
		if (profile.hasOwnProperty("addressLine1")) {
			this.user.profile.address.addressLine1 = profile.addressLine1;
		}
		if (profile.hasOwnProperty("addressLine2")) {
			this.user.profile.address.addressLine2 = profile.addressLine2;
		}
		if (profile.hasOwnProperty("city")) {
			this.user.profile.address.city = profile.city;
		}
		if (profile.hasOwnProperty("postalCode")) {
			this.user.profile.address.postalCode = profile.postalCode;
		}
		if (profile.hasOwnProperty("countryId")) {
			this.user.profile.address.country.id = profile.countryId;
		}
		if (profile.hasOwnProperty("regionId")) {
			this.user.profile.address.region.id = profile.regionId;
		}
		if (profile.hasOwnProperty("cultureId")) {
			this.user.profile.culture = this.cultures.find(
				(culture) => culture.value === profile.cultureId
			);
			this.user.profile.culture.id = profile.cultureId;
		}
	}
};

const setScreenLoader = function (active, text = "Loading") {
	this.screenLoader.active = active;
	this.screenLoader.text = text;
};

const setRedirection = function ({
	action = null,
	redirectPending = false,
	handshakePending = false,
	redirectTo = null,
	handshakeWith = null,
}) {
	if (Object.values(OAuthCallbacks).includes(action)) {
		this.redirect[action].redirectPending = redirectPending;
		this.redirect[action].handshakePending = handshakePending;
		this.redirect[action].redirectTo = redirectTo;
		this.redirect[action].handshakeWith = handshakeWith;
	}
};

const setBuffer = function (buffer) {
	this.buffer = buffer;
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
	setUserProfile,
	setScreenLoader,
	setRedirection,
	setBuffer,
};
