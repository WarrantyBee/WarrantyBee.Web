import { apiRequest } from "../services/api";
import {
	HttpMethods,
	Endpoints,
	HttpStatus,
	AuthProviders,
	OAuthCallbacks,
	ApplicationRouteNames,
	AuthProviderCodes,
	ScreenLoaderLabels,
	OAuthCallbackTypes,
} from "../constants";
import { useGlobalStore } from "../stores/global";
import { WebError } from "../services/telemetry";
import { useRouter } from "vue-router";

export async function handleOAuthCallback(to) {
	if (
		Object.values(AuthProviders).includes(to.query.authProvider) &&
		Object.values(OAuthCallbacks).includes(to.query.action) &&
		to.query.code
	) {
		if (to.query.authProvider === AuthProviders.FACEBOOK) {
			await handleFacebookSignUpRedirect(to);
		}
	}
}

export async function handleFacebookSignUpRedirect(to) {
	const globalStore = useGlobalStore();
	const router = useRouter();
	let redirect = {
		action: to.query.action,
		...globalStore.redirect[to.query.action],
		redirectPending: false,
	};
	globalStore.setScreenLoader(true, ScreenLoaderLabels[to.query.action]);
	const body = {
		provider: AuthProviderCodes[to.query.authProvider.toUpperCase()],
		code: to.query.code,
		callbackType: OAuthCallbackTypes[to.query.action],
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
		redirect = { action: to.query.action };
		notifyError("Oops! Something went wrong. Please try again later.");
	} finally {
		globalStore.setLoader(false);
		globalStore.setScreenLoader(false);
		globalStore.setRedirection(redirect);
		router.push({ name: ApplicationRouteNames.AUTH });
	}
}
