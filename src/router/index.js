import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../pages/AuthPage.vue";

const routes = [
	{
		path: "/",
		name: "Auth",
		component: AuthPage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const accessToken = localStorage.getItem("WARRANTYBEE_ACCESS_TOKEN");
	if (!accessToken && to.name !== "Auth") {
		next({ name: "Auth" });
	} else {
		next();
	}
});

export default router;
