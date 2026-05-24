import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../pages/AuthPage.vue";
import ConsumerLayout from "../layouts/ConsumerLayout.vue";
import EnterpriseLayout from "../layouts/EnterpriseLayout.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import MyVaultPage from "../pages/MyVaultPage.vue";
import MyClaimsPage from "../pages/MyClaimsPage.vue";
import B2BClaimsPage from "../pages/B2BClaimsPage.vue";
import ApplicationsPage from "../pages/ApplicationsPage.vue";
import AdminApiKeysPage from "../pages/AdminApiKeysPage.vue";
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
		path: "/",
		component: ConsumerLayout,
		children: [
			{ path: "dashboard", name: "Dashboard", component: DashboardPage },
			{ path: "vault", name: "MyVault", component: MyVaultPage },
			{ path: "claims", name: "MyClaims", component: MyClaimsPage },
			{ path: "applications", name: "Applications", component: ApplicationsPage },
		]
	},
	{
		path: "/b2b",
		component: EnterpriseLayout,
		children: [
			{ path: "dashboard", name: "B2BDashboard", component: DashboardPage },
			{ path: "claims", name: "B2BClaims", component: B2BClaimsPage },
		]
	},
	{
		path: "/admin/api-keys",
		name: "AdminApiKeys",
		component: AdminApiKeysPage,
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
		return next();
	}

	if (to.name !== "Auth") {
		if (!accessToken) {
			return next({ name: "Auth" });
		} else {
			// Basic auth check
			next();
		}
	} else {
		if (accessToken) {
			return next({ name: "Dashboard" });
		}
		next();
	}
});

export default router;
