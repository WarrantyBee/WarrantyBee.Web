<template>
	<div class="d-flex page-container" v-loading="signingOut">
		<div class="menubar d-flex gap-3 w-100">
			<div class="d-flex fb-80"></div>
			<div class="d-flex justify-content-end align-items-center fb-20">
				<el-button
					class="me-2"
					type="primary"
					plain
					size="large"
					@click="signOut()"
				>
					SIGN OUT
				</el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { CacheKeys } from "../constants";

const router = useRouter();
const signingOut = ref(false);

const signOut = () => {
	signingOut.value = true;
	localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
	router.push("/");
	signingOut.value = false;
};
</script>

<style lang="scss" scoped>
.page-container {
	width: 100vw;
	height: 100vh;
	background: #ffffff;

	.menubar {
		height: 60px;
		border-bottom: 0.5px solid #0000001f;
	}
}
</style>
