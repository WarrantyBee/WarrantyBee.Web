import { apiRequest } from "../services/api";
import {
	HttpMethods,
	Endpoints,
	HttpStatus,
	AuthProviders,
	OAuthCallbacks,
	ApplicationRouteNames,
} from "../constants";
import { useGlobalStore } from "../stores/global";
import { WebError } from "../services/telemetry";

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
	let redirect = {
		action: OAuthCallbacks.SIGN_UP,
		...globalStore.redirect.signup,
		redirectPending: false,
	};
	globalStore.setScreenLoader(true, "Taking you to Sign Up page...");
	const body = {
		provider: to.query.authProvider,
		code: to.query.code,
	};
	try {
		const response = await apiRequest(
			HttpMethods.POST,
			Endpoints.GET_PROFILE_THROUGH_OAUTH,
			body
		);
		if (response?.status === HttpStatus.OK) {
			const buffer = {
				...globalStore.buffer,
				authProviderResponse: response.data.data,
			};
			globalStore.setBuffer(buffer);
		} else {
			throw new WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		redirect = {};
		notifyError("Oops! Something went wrong. Please try again later.");
	} finally {
		globalStore.setScreenLoader(false);
		globalStore.setRedirection(redirect);
		return next({ name: ApplicationRouteNames.AUTH });
	}
}
