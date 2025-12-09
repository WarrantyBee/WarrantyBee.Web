import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../pages/AuthPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import { apiRequest } from "../services/api";
import { WebError } from "../services/telemetry";
import {
	HttpMethods,
	CacheKeys,
	Endpoints,
	HttpStatus,
	AuthProviders,
	OAuthCallbacks,
} from "../constants";
import { useGlobalStore } from "../stores/global/index";

const routes = [
	{
		path: "/",
		name: "Auth",
		component: AuthPage,
	},
	{
		path: "/dashboard",
		name: "Dashboard",
		component: DashboardPage,
	},
	{
		path: "/profile",
		name: "Profile",
		component: ProfilePage,
	},
	{
		path: "/not-found",
		name: "NotFound",
		component: NotFoundPage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to, from, next) => {
	const globalStore = useGlobalStore();
	const accessToken = localStorage.getItem(CacheKeys.ACCESS_TOKEN);
	const fetchRequiredData = async (authenticated = false) => {
		try {
			globalStore.setLoader(true);
			if (authenticated && !globalStore.user.profile) {
				const response = await apiRequest(
					HttpMethods.GET,
					Endpoints.GET_USER_PROFILE
				);
				if (response?.status === HttpStatus.OK) {
					globalStore.setUser(response.data.data);
				} else {
					throw new WebError("Unexpected response from server.", response);
				}
			}
			if (!globalStore.countries) {
				const response = await apiRequest(HttpMethods.GET, Endpoints.COUNTRIES);
				if (response?.status === HttpStatus.OK) {
					globalStore.setCountries(response.data.data);
				} else {
					throw new WebError("Unexpected response from server.", response);
				}

				const cultures = response.data.data
					.filter((c) => c.hasOwnProperty("cultures") && c.cultures?.length > 0)
					.map((c) => {
						return c.cultures
							.map((cul) => {
								return {
									value: cul.id,
									label: `${cul.language.nativeName} (${c.name})`,
									iso: cul.iso,
									countryId: c.id,
								};
							})
							.flatMap((n) => n);
					})
					.flatMap((n) => n);
				globalStore.setCultures(cultures);

				const phoneCodes = response.data.data
					.map((c) => {
						if (c.phoneCode?.includes(",")) {
							return c.phoneCode.split(",").map((code) => {
								return {
									name: c.name,
									iso2: c.iso2,
									value: code,
								};
							});
						} else {
							return {
								name: c.name,
								iso2: c.iso2,
								value: c.phoneCode,
							};
						}
					})
					.flatMap((n) => n);
				globalStore.setPhoneCodes(phoneCodes);
			}
		} catch (error) {
			notifyError("Oops! Something went wrong. Please try again later.");
			throw error;
		} finally {
			globalStore.setLoader(false);
		}
	};

	if (to.matched.length === 0) {
		if (to.fullPath?.startsWith("/oauth/callback")) {
			if (
				Object.values(AuthProviders).includes(to.query.authProvider) &&
				Object.values(OAuthCallbacks).includes(to.query.action) &&
				to.query.code
			) {
				if (to.query.authProvider === AuthProviders.FACEBOOK) {
					const body = {
						provider: to.query.authProvider,
						code: to.query.code,
					};
					setTimeout(async () => {
						const response = await apiRequest(
							HttpMethods.POST,
							Endpoints.GET_PROFILE_THROUGH_OAUTH,
							body
						);
					}, 2000);
				}
				if (to.query.action === OAuthCallbacks.SIGN_UP) {
					// logic to redirect to sign up component
				}
			}
		}
		return next({ name: "NotFound" });
	}

	if (to.name === "NotFound") {
		next();
	}

	if (to.name !== "Auth") {
		if (!accessToken) {
			await fetchRequiredData();
			return next({ name: "Auth" });
		} else {
			try {
				await apiRequest(HttpMethods.POST, Endpoints.ALIVE);
				await fetchRequiredData(true);
				next();
			} catch (error) {
				if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
					await fetchRequiredData();
					localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
					return next({ name: "Auth" });
				}
			}
		}
	} else {
		if (accessToken) {
			try {
				await apiRequest(HttpMethods.POST, Endpoints.ALIVE);
				await fetchRequiredData(true);
				return next({ name: "Dashboard" });
			} catch (error) {
				if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
					await fetchRequiredData();
					localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
					return next();
				}
			}
		} else {
			await fetchRequiredData();
			next();
		}
	}
});

export default router;
