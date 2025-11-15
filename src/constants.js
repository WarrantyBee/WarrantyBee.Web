const Endpoints = {
	LOGIN: "/auth/login",
	FORGOT_PASSWORD: "/auth/forgotpassword",
	RESET_PASSWORD: "/auth/resetpassword",
};

const CacheKeys = {
	ACCESS_TOKEN: "_WARRANTYBEE_API_ACCESS_TOKEN",
};

const HttpMethods = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
};

const LoginTypes = {
	SIMPLE: "login",
	MFA: "mfa",
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
};
