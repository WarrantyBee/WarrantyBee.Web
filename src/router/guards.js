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
	SignInTypes,
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
	try {
		const response = await fetchSocialProfile(to);
		switch (to.query.action) {
			case OAuthCallbacks.SIGN_UP:
				break;
			case OAuthCallbacks.SIGN_IN:
				await signInWithAuthProvider(to);
				break;
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

async function fetchSocialProfile(to) {
	const globalStore = useGlobalStore();
	const body = {
		authProvider: AuthProviderCodes[to.query.authProvider.toUpperCase()],
		code: to.query.code,
		callbackType: OAuthCallbackTypes[to.query.action],
	};
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
}

async function signInWithAuthProvider(to) {
	let loginResponse = {};
	try {
		const globalStore = useGlobalStore();
		const body = {
			type: SignInTypes.SIMPLE,
			email: globalStore.buffer.authProviderResponse.email,
			authProvider: AuthProviderCodes[to.query.authProvider.toUpperCase()],
			authProviderUserId: globalStore.buffer.authProviderResponse.id,
		};
		const response = await apiRequest(HttpMethods.POST, Endpoints.LOGIN, body);
		if (response?.status === HttpStatus.OK) {
			loginResponse = response.data.data;
		} else {
			throw new WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		if (error?.response?.status === HttpStatus.BAD_REQUEST) {
			if (error.response.data?.error?.code === ErrorCodes.INVALID_CREDENTIALS) {
				loginResponse = { wrongEmailOrPassword: true };
			}
		} else if (error.response?.status === HttpStatus.NOT_FOUND) {
			if (error.response.data?.error?.code === ErrorCodes.USER_NOT_REGISTERED) {
				loginResponse = { userNotRegistered: true };
			}
		} else {
			throw error;
		}
	} finally {
		const buffer = {
			...globalStore.buffer,
			loginResponse: loginResponse,
		};
		globalStore.setBuffer(buffer);
	}
}
