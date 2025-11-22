import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../pages/AuthPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import { apiRequest } from "../services/api";
import { HttpMethods, CacheKeys, Endpoints, HttpStatus } from "../constants";

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
	const accessToken = localStorage.getItem(CacheKeys.ACCESS_TOKEN);

	if (to.matched.length === 0) {
		return next({ name: "NotFound" });
	}

	if (to.name === "NotFound") {
		next();
	}

	if (to.name !== "Auth") {
		if (!accessToken) {
			return next({ name: "Auth" });
		} else {
			try {
				await apiRequest(HttpMethods.POST, Endpoints.ALIVE);
				next();
			} catch (error) {
				if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
					localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
					return next({ name: "Auth" });
				}
			}
		}
	} else {
		if (accessToken) {
			try {
				await apiRequest(HttpMethods.POST, Endpoints.ALIVE);
				return next({ name: "Dashboard" });
			} catch (error) {
				next();
			}
		}
		next();
	}
});

export default router;
