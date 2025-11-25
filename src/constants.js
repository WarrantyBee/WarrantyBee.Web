const Endpoints = {
	ALIVE: "/alive",
	COUNTRIES: "/countries",
	SIGN_UP: "/auth/signup",
	LOGIN: "/auth/login",
	FORGOT_PASSWORD: "/auth/forgotpassword",
	RESET_PASSWORD: "/auth/resetpassword",
	CHANGE_PROFILE_PICTURE: (userId) =>
		"/users/{0}/changeavatar".replace("{0}", `${userId}`),
};

const CacheKeys = {
	ACCESS_TOKEN: "_WARRANTYBEE_API_ACCESS_TOKEN",
};

const MenuItems = {
	DASHBOARD: "1",
	PRODUCTS: "2",
	WARRANTIES: "3",
	MY_PROFILE: "4-1",
	SIGN_OUT: "4-2",
};

const HttpMethods = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
};

const Genders = {
	MALE: 1,
	FEMALE: 2,
	PREFER_NOT_TO_SAY: 3,
};

const NotificationTypes = {
	INFO: "info",
	SUCCESS: "success",
	WARNING: "warning",
	ERROR: "error",
};

const Events = {
	ON_SUCCESS: "on-success",
	ON_ERROR: "on-error",
};

const HttpStatus = {
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
};

const ErrorCodes = {
	INVALID_CREDENTIALS: 1002,
	USER_NOT_REGISTERED: 1016,
	USER_ALREADY_REGISTERED: 1017,
	INVALID_OTP: 1034,
	PASSWORD_RECENTLY_UPDATED: 1049,
	PASSWORD_ALREADY_USED: 1050,
};

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
};
