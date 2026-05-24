<template>
	<div class="consumer-layout">
		<div class="menubar d-flex align-items-center px-4">
			<div class="d-flex align-items-center gap-3" @click="router.push('/dashboard')" style="cursor: pointer">
				<div class="logo-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width: 32px; height: 32px; border-radius: 50%">W</div>
				<h1 class="m-0 fs-4 fw-bold text-primary">WarrantyBee</h1>
			</div>
			
			<div class="ms-5 d-none d-md-flex gap-4">
				<el-link :type="isActive('/dashboard') ? 'primary' : 'default'" :underline="false" @click="router.push('/dashboard')" class="fw-bold">Dashboard</el-link>
				<el-link :type="isActive('/vault') ? 'primary' : 'default'" :underline="false" @click="router.push('/vault')">My Vault</el-link>
				<el-link :type="isActive('/claims') ? 'primary' : 'default'" :underline="false" @click="router.push('/claims')">Claims</el-link>
			</div>

			<div class="flex-grow-1"></div>

			<div class="d-flex align-items-center gap-3">
				<el-dropdown trigger="click">
					<div class="profile-trigger d-flex align-items-center gap-2">
						<el-avatar :size="36" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
						<el-icon><CaretBottom /></el-icon>
					</div>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="router.push('/profile')">
								<el-icon><User /></el-icon> Profile
							</el-dropdown-item>
							<el-dropdown-item @click="router.push('/applications')">
								<el-icon><Monitor /></el-icon> Applications
							</el-dropdown-item>
							<el-dropdown-item divided type="danger" @click="handleSignOut">
								<el-icon><SwitchButton /></el-icon> Sign Out
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>

		<div class="main-content">
			<router-view />
		</div>
	</div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { CaretBottom, User, Monitor, SwitchButton } from "@element-plus/icons-vue";
import { CacheKeys } from "../constants";

const router = useRouter();
const route = useRoute();

const isActive = (path) => route.path === path;

const handleSignOut = () => {
	localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
	localStorage.removeItem(CacheKeys.REFRESH_TOKEN);
	router.push("/");
};
</script>

<style lang="scss" scoped>
.consumer-layout {
	width: 100vw;
	min-height: 100vh;
	background: #f8f9fb;

	.menubar {
		height: 70px;
		background: #ffffff;
		border-bottom: 1px solid #e5e7eb;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.profile-trigger {
		cursor: pointer;
		padding: 5px;
		border-radius: 8px;
		&:hover { background: #f3f4f6; }
	}

	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 30px 20px;
	}
}
</style>
