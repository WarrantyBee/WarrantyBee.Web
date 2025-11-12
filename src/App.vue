<template>
	<el-container id="app-container">
		<el-main>
			<router-view />
		</el-main>
	</el-container>
</template>

<script setup>
import { ElNotification } from "element-plus";
import { loadRecaptcha, getRecaptchaToken } from "./services/recaptcha";
import { onMounted } from "vue";
import { Events, NotificationTypes } from "./constants";

const showErrorNotification = (message) => {
	ElNotification({
		title: "Error",
		message: message,
		type: NotificationTypes.ERROR,
		duration: 5000,
	});
};

const notifyError = (message) => {
	document.body.dispatchEvent(
		new CustomEvent(Events.ON_ERROR, { detail: { message } })
	);
};

onMounted(async () => {
	await loadRecaptcha();
	window.notifyError = notifyError;
	document.body.addEventListener(Events.ON_ERROR, (e) =>
		showErrorNotification(e.detail.message)
	);
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
