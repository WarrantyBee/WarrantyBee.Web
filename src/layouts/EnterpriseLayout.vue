<template>
	<div class="enterprise-layout d-flex">
		<div class="sidebar d-flex flex-column">
			<div class="logo-section p-4 d-flex align-items-center gap-3">
				<div class="logo-circle bg-white text-dark d-flex align-items-center justify-content-center fw-bold" style="width: 32px; height: 32px; border-radius: 50%">W</div>
				<span class="fs-5 fw-bold text-white">Brand Hub</span>
			</div>

			<el-menu
				active-text-color="#ffffff"
				background-color="#1f2937"
				class="border-0 flex-grow-1"
				:default-active="route.path"
				text-color="#9ca3af"
				router
			>
				<el-menu-item index="/b2b/dashboard">
					<el-icon><DataBoard /></el-icon>
					<span>Dashboard</span>
				</el-menu-item>
				<el-menu-item index="/b2b/claims">
					<el-icon><Ticket /></el-icon>
					<span>Claims Inbox</span>
				</el-menu-item>
				<el-menu-item index="/b2b/catalog">
					<el-icon><Box /></el-icon>
					<span>Product Catalog</span>
				</el-menu-item>
				<el-menu-item index="/b2b/network">
					<el-icon><Connection /></el-icon>
					<span>Service Network</span>
				</el-menu-item>
			</el-menu>

			<div class="sidebar-footer p-4 border-top border-secondary">
				<div class="d-flex align-items-center gap-3 text-white">
					<el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
					<div class="d-flex flex-column overflow-hidden">
						<span class="small fw-bold text-truncate">Philips Support</span>
						<el-button link type="info" size="small" class="p-0 justify-content-start" @click="handleSignOut">Sign Out</el-button>
					</div>
				</div>
			</div>
		</div>

		<div class="main-body flex-grow-1 overflow-auto">
			<div class="header d-flex align-items-center px-4 justify-content-between">
				<h2 class="m-0 fs-5 fw-bold text-secondary">{{ pageTitle }}</h2>
				<div class="d-flex align-items-center gap-3">
					<el-badge is-dot class="item">
						<el-icon :size="20"><Bell /></el-icon>
					</el-badge>
					<el-divider direction="vertical" />
					<el-icon :size="20"><Setting /></el-icon>
				</div>
			</div>
			<div class="p-4">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { 
	DataBoard, 
	Ticket, 
	Box, 
	Connection, 
	Bell, 
	Setting 
} from "@element-plus/icons-vue";
import { CacheKeys } from "../constants";

const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => {
	switch (route.path) {
		case "/b2b/dashboard": return "Business Overview";
		case "/b2b/claims": return "Claims Triage Inbox";
		case "/b2b/catalog": return "Master Product Catalog";
		case "/b2b/network": return "Service Centers & Techs";
		default: return "WarrantyBee Business";
	}
});

const handleSignOut = () => {
	localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
	localStorage.removeItem(CacheKeys.REFRESH_TOKEN);
	router.push("/");
};
</script>

<style lang="scss" scoped>
.enterprise-layout {
	width: 100vw;
	height: 100vh;
	background: #f3f4f6;

	.sidebar {
		width: 260px;
		background: #1f2937;
		height: 100%;
	}

	.header {
		height: 64px;
		background: #ffffff;
		border-bottom: 1px solid #e5e7eb;
	}

	.main-body {
		height: 100vh;
	}
}
</style>
