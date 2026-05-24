<template>
	<div class="page-container" v-loading="loading">
		<div class="menubar d-flex align-items-center px-4">
			<div class="d-flex align-items-center gap-3">
				<div class="logo-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width: 32px; height: 32px; border-radius: 50%">W</div>
				<h1 class="m-0 fs-4 fw-bold text-primary">WarrantyBee</h1>
			</div>
			
			<div class="ms-5 d-none d-md-flex gap-4">
				<el-link type="primary" :underline="false" class="fw-bold">Dashboard</el-link>
				<el-link :underline="false" @click="router.push('/applications')">My Appliances</el-link>
				<el-link :underline="false">Claims</el-link>
			</div>

			<div class="flex-grow-1"></div>

			<div class="d-flex align-items-center gap-3">
				<el-button type="primary" circle>
					<el-icon><Plus /></el-icon>
				</el-button>
				
				<el-dropdown trigger="click">
					<div class="profile-trigger d-flex align-items-center gap-2">
						<el-avatar :size="36" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
						<el-icon><CaretBottom /></el-icon>
					</div>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item class="py-2 px-4">
								<div class="d-flex flex-column">
									<span class="fw-bold">Arijit Roy</span>
									<small class="text-muted">aroy02072000@gmail.com</small>
								</div>
							</el-dropdown-item>
							<el-dropdown-item divided @click="router.push('/profile')">
								<el-icon><User /></el-icon> Profile
							</el-dropdown-item>
							<el-dropdown-item @click="router.push('/applications')">
								<el-icon><Monitor /></el-icon> Applications
							</el-dropdown-item>
							<el-dropdown-item @click="router.push('/settings')">
								<el-icon><Setting /></el-icon> Settings
							</el-dropdown-item>
							<el-dropdown-item divided type="danger" @click="handleSignOut">
								<el-icon><SwitchButton /></el-icon> Sign Out
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>

		<div class="content p-4">
			<div class="welcome-banner p-5 mb-5 rounded-4 text-white d-flex align-items-center">
				<div class="flex-grow-1">
					<h2 class="display-6 fw-bold mb-2">Hello, Arijit!</h2>
					<p class="fs-5 opacity-75">Welcome back to your digital appliance vault. You have 3 active warranties.</p>
				</div>
				<div class="d-none d-lg-block banner-icon">🛡️</div>
			</div>

			<div class="d-flex justify-content-between align-items-center mb-4">
				<h3 class="m-0 fw-bold">Recent Appliances</h3>
				<el-button type="primary" link @click="router.push('/applications')">View All <el-icon class="ms-1"><ArrowRight /></el-icon></el-button>
			</div>

			<el-row :gutter="25">
				<el-col :xs="24" :sm="12" :md="8" class="mb-4">
					<el-card class="appliance-card" shadow="hover">
						<div class="d-flex gap-3 align-items-start">
							<div class="icon-box bg-primary-light">📺</div>
							<div class="flex-grow-1">
								<h4 class="m-0 mb-1 fs-6">Samsung Crystal 4K TV</h4>
								<p class="text-muted small mb-3">Model: UA50AUE60AK</p>
								<el-tag size="small" type="success">Active Warranty</el-tag>
							</div>
						</div>
						<div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
							<small class="text-muted">Expires in 245 days</small>
							<el-button type="primary" size="small" plain>File Claim</el-button>
						</div>
					</el-card>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" class="mb-4">
					<el-card class="appliance-card" shadow="hover">
						<div class="d-flex gap-3 align-items-start">
							<div class="icon-box bg-warning-light">❄️</div>
							<div class="flex-grow-1">
								<h4 class="m-0 mb-1 fs-6">LG Double Door Fridge</h4>
								<p class="text-muted small mb-3">Model: GL-D241HDSY</p>
								<el-tag size="small" type="warning">Expiring Soon</el-tag>
							</div>
						</div>
						<div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
							<small class="text-muted">Expires in 12 days</small>
							<el-button type="warning" size="small" plain>Renew AMC</el-button>
						</div>
					</el-card>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" class="mb-4">
					<el-card class="appliance-card add-new d-flex align-items-center justify-content-center" shadow="never">
						<div class="text-center py-4">
							<el-icon :size="32" class="text-primary mb-2"><Plus /></el-icon>
							<p class="m-0 fw-bold">Register New Appliance</p>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { 
	Plus, 
	CaretBottom, 
	User, 
	Monitor, 
	Setting, 
	SwitchButton,
	ArrowRight
} from "@element-plus/icons-vue";
import { CacheKeys } from "../constants";

const router = useRouter();
const loading = ref(false);

const handleSignOut = () => {
	loading.value = true;
	localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
	localStorage.removeItem(CacheKeys.REFRESH_TOKEN);
	router.push("/");
	loading.value = false;
};
</script>

<style lang="scss" scoped>
.page-container {
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
		transition: background 0.2s;
		&:hover { background: #f3f4f6; }
	}

	.content {
		max-width: 1100px;
		margin: 0 auto;
	}

	.welcome-banner {
		background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
		position: relative;
		overflow: hidden;
		.banner-icon {
			font-size: 80px;
			opacity: 0.2;
			transform: rotate(15deg);
		}
	}

	.appliance-card {
		border-radius: 16px;
		border: none;
		.icon-box {
			width: 48px;
			height: 48px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;
		}
		&.add-new {
			border: 2px dashed #d1d5db;
			background: transparent;
			cursor: pointer;
			&:hover { border-color: #007bff; background: #f0f7ff; }
		}
	}

	.bg-primary-light { background: #eef6ff; }
	.bg-warning-light { background: #fffbeb; }
}
</style>
