import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import HomePage from "../pages/HomePage.vue";

const routes = [
	{
		path: "/login",
		name: "Login",
		component: LoginPage,
	},
	{
		path: "/",
		name: "Home",
		component: HomePage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const accessToken = localStorage.getItem("WARRANTYBEE_ACCESS_TOKEN");
	if (!accessToken && to.name !== "Login") {
		next({ name: "Login" });
	} else {
		next();
	}
});

export default router;
