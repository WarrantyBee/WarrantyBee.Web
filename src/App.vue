<template>
	<el-container id="app-container" v-loading="loading">
		<el-main class="p-0">
			<router-view />
		</el-main>
	</el-container>
</template>

<script setup>
import { ElNotification } from "element-plus";
import { loadRecaptcha, getRecaptchaToken } from "./services/recaptcha";
import { onMounted, ref } from "vue";
import { Events, NotificationTypes } from "./constants";

const loading = ref(false);
const showSuccessNotification = (message) => {
	ElNotification({
		title: "Success",
		message: message,
		type: NotificationTypes.SUCCESS,
		duration: 5000,
	});
};

const showErrorNotification = (message) => {
	ElNotification({
		title: "Error",
		message: message,
		type: NotificationTypes.ERROR,
		duration: 5000,
	});
};

const notifySuccess = (message) => {
	document.body.dispatchEvent(
		new CustomEvent(Events.ON_SUCCESS, { detail: { message } })
	);
};

const notifyError = (message) => {
	document.body.dispatchEvent(
		new CustomEvent(Events.ON_ERROR, { detail: { message } })
	);
};

onMounted(async () => {
	loading.value = true;
	await loadRecaptcha();
	window.notifySuccess = notifySuccess;
	window.notifyError = notifyError;
	document.body.addEventListener(Events.ON_SUCCESS, (e) =>
		showSuccessNotification(e.detail.message)
	);
	document.body.addEventListener(Events.ON_ERROR, (e) =>
		showErrorNotification(e.detail.message)
	);
	loading.value = false;
});
</script>

<style scoped>
#app-container {
	height: 100vh;
	width: 100vw;
}

#app-container > .el-main {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
