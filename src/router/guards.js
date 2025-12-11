import { run } from "../utils/promise";
import { apiRequest } from "../services/api";
import {
	HttpMethods,
	Endpoints,
	HttpStatus,
	AuthProviders,
	OAuthCallbacks,
} from "../constants";
import { useGlobalStore } from "../stores/global";

export async function handleOAuthCallback(to, from, next) {
	if (
		Object.values(AuthProviders).includes(to.query.authProvider) &&
		Object.values(OAuthCallbacks).includes(to.query.action) &&
		to.query.code
	) {
		if (to.query.authProvider === AuthProviders.FACEBOOK) {
			await handleFacebookSignUpRedirect(to, from, next);
		}
		if (to.query.action === OAuthCallbacks.SIGN_UP) {
			// logic to redirect to sign up component
		}
	}
}

export async function handleFacebookSignUpRedirect(to, from, next) {
	const globalStore = useGlobalStore();
	const body = {
		provider: to.query.authProvider,
		code: to.query.code,
	};
	globalStore.setScreenLoader(true, "Taking you to Sign Up page...");
	// let response = await apiRequest(
	// 	HttpMethods.POST,
	// 	Endpoints.GET_PROFILE_THROUGH_OAUTH,
	// 	body
	// );
	if (response?.status === HttpStatus.OK) {
		//return next({ name: "Auth" });
	} else {
		return next({ name: "NotFound" });
	}
}
