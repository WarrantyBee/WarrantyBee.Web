<template>
	<div class="menu-bar-container d-flex gap-3 w-100">
		<el-menu
			class="w-100"
			mode="horizontal"
			:ellipsis="false"
			:default-active="activeIndex"
			@select="selectMenu"
		>
			<div
				class="menu-banner-wrapper d-flex align-items-center justify-content-center"
			>
				<img class="menu-banner" src="../assets/menu_banner.png" alt="" />
			</div>
			<el-menu-item index="1" class="poppins-light"> Dashboard </el-menu-item>
			<el-sub-menu index="2" class="poppins-light">
				<template #title> Products</template>
				<el-menu-item index="2-1" class="poppins-light">
					All Products
				</el-menu-item>
				<el-menu-item index="2-2" class="poppins-light">
					Add Product
				</el-menu-item>
				<el-menu-item index="2-3" class="poppins-light">
					Archived Products
				</el-menu-item>
			</el-sub-menu>
			<el-sub-menu index="3" class="poppins-light">
				<template #title> Warranties</template>
				<el-menu-item index="3-1" class="poppins-light">
					Active Warranties
				</el-menu-item>
				<el-menu-item index="3-2" class="poppins-light">
					Expiring Soon
				</el-menu-item>
				<el-menu-item index="3-3" class="poppins-light">
					Expired Warranties
				</el-menu-item>
			</el-sub-menu>
			<el-sub-menu index="4" class="profile-details poppins-light">
				<template #title>
					<img class="profile-avatar" :src="globalStore.getAvatarUrl" />
					{{ globalStore.getUserFullName }}</template
				>
				<el-menu-item index="4-1" class="poppins-light">
					My Profile
				</el-menu-item>
				<el-menu-item index="4-2" class="poppins-light" @click="signOut()">
					Sign Out
				</el-menu-item>
			</el-sub-menu>
		</el-menu>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { CacheKeys, MenuItems } from "../constants.js";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global.js";

const router = useRouter();
const globalStore = useGlobalStore();
const activeIndex = computed(() => globalStore.getSelectedMenu);
const selectMenu = (index) => {
	switch (index) {
		case MenuItems.DASHBOARD:
			router.push("/dashboard");
			break;
		case MenuItems.MY_PROFILE:
			router.push("/profile");
			break;
	}
	globalStore.setSelectedMenu(index);
};
const signOut = () => {
	localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
	router.push("/");
};
</script>

<style lang="scss" scoped>
.menu-bar-container {
	height: 60px;
	border-bottom: 0.5px solid #0000001f;

	.el-menu--horizontal > .menu-banner-wrapper {
		margin-right: auto;
		margin-left: 60px;
	}

	.menu-banner {
		height: 40px;
		margin-right: 20px;
	}

	.profile-details {
		margin-right: 10px;

		.profile-avatar {
			width: 40px;
			height: 40px;
			margin-right: 8px;
			border-radius: 50%;
			border: 1px solid #0000001f;
		}
	}
}
</style>
