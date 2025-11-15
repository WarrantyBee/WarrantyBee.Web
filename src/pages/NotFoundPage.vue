<template class="p-0">
	<div
		class="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center bg-light text-center"
	>
		<h1 class="display-1 fw-bold text-secondary">404</h1>

		<h2 class="fw-semibold mt-3">Page Not Found</h2>

		<p class="text-muted mt-2 mb-4" style="max-width: 400px">
			Sorry, the page you are trying to access doesn't exist or may have been
			moved.
		</p>

		<el-button type="primary" size="large" @click="goToDashboard()">
			Go to Dashboard
		</el-button>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goToDashboard = () => {
	router.push({ name: "Dashboard" });
};
</script>

<style scoped lang="scss">
.display-1 {
	font-size: 8rem;
}
</style>
