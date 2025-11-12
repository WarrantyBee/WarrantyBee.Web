const AuthPageComponents = {
	None: 0,
	SignUp: 1,
	Login: 2,
	ForgotPassword: 3,
	ResetPassword: 4,
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
	ON_ERROR: "on-error",
};

export {
	AuthPageComponents,
	HttpMethods,
	LoginTypes,
	NotificationTypes,
	Events,
};
