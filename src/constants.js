const Endpoints = Object.freeze({
	ALIVE: "/alive",
	COUNTRIES: "/countries",
	SIGN_UP: "/auth/signup",
	LOGIN: "/auth/login",
	FORGOT_PASSWORD: "/auth/forgotpassword",
	RESET_PASSWORD: "/auth/resetpassword",
	GET_USER_PROFILE: "/users/profile",
	CHANGE_PROFILE_PICTURE: "/users/profile/changeavatar",
	GET_PROFILE_THROUGH_OAUTH: "oauth/profile",
	UPDATE_USER_PROFILE: "/users/profile",

	FB_SIGN_UP_REDIRECT_URL: import.meta.env.VITE_FB_SIGN_UP_REDIRECT_URL,
});

const CacheKeys = Object.freeze({
	ACCESS_TOKEN: `_WARRANTYBEE_API_ACCESS_TOKEN_${window.location.hostname.toUpperCase()}`,
});

const MenuItems = Object.freeze({
	DASHBOARD: "1",
	PRODUCTS: "2",
	WARRANTIES: "3",
	MY_PROFILE: "4-1",
	SIGN_OUT: "4-2",
});

const HttpMethods = Object.freeze({
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
	PATCH: "PATCH",
});

const Genders = Object.freeze({
	MALE: 1,
	FEMALE: 2,
	PREFER_NOT_TO_SAY: 3,
});

const NotificationTypes = Object.freeze({
	INFO: "info",
	SUCCESS: "success",
	WARNING: "warning",
	ERROR: "error",
});

const Events = Object.freeze({
	ON_SUCCESS: "on-success",
	ON_ERROR: "on-error",
});

const HttpStatus = Object.freeze({
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
});

const ErrorCodes = Object.freeze({
	INVALID_CREDENTIALS: 1002,
	USER_NOT_REGISTERED: 1016,
	USER_ALREADY_REGISTERED: 1017,
	INVALID_OTP: 1034,
	PASSWORD_RECENTLY_UPDATED: 1049,
	PASSWORD_ALREADY_USED: 1050,
});

const AuthProviders = Object.freeze({
	GOOGLE: "google",
	FACEBOOK: "facebook",
	LINKEDIN: "linkedin",
});

const OAuthCallbacks = Object.freeze({
	SIGN_UP: "signup",
	SIGN_IN: "signin",
});

const ApplicationRoutes = Object.freeze({
	AUTH: "/",
	DASHBOARD: "/dashboard",
	PROFILE: "/profile",
	NOT_FOUND: "/not-found",
	OAUTH_CALLBACK: "/oauth/callback",
});

const ApplicationRouteNames = Object.freeze({
	AUTH: "Auth",
	DASHBOARD: "Dashboard",
	PROFILE: "Profile",
	NOT_FOUND: "NotFound",
	OAUTH_CALLBACK: "OAuthCallback",
});

export {
	Endpoints,
	CacheKeys,
	HttpMethods,
	NotificationTypes,
	Events,
	HttpStatus,
	ErrorCodes,
	Genders,
	MenuItems,
	AuthProviders,
	OAuthCallbacks,
	ApplicationRoutes,
	ApplicationRouteNames,
};
