<template>
	<el-container id="app-container" v-loading="loading">
		<el-main class="p-0">
			<router-view />
		</el-main>
	</el-container>
</template>

<script setup>
import { ElNotification } from "element-plus";
import { loadRecaptcha } from "./services/recaptcha";
import { computed, onMounted, onUpdated } from "vue";
import { Events, NotificationTypes } from "./constants";
import { useGlobalStore } from "./stores/global/index";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const globalStore = useGlobalStore();
const loading = computed(() => globalStore.loading);
const showSuccessNotification = (message) => {
	ElNotification({
		title: t("notifications.success.title"),
		message: message,
		type: NotificationTypes.SUCCESS,
		duration: 5000,
	});
};

const showErrorNotification = (message) => {
	ElNotification({
		title: t("notifications.error.title"),
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

const setupNotificationHandlers = () => {
	window.notifySuccess = notifySuccess;
	window.notifyError = notifyError;
	document.body.addEventListener(Events.ON_SUCCESS, (e) =>
		showSuccessNotification(e.detail.message)
	);
	document.body.addEventListener(Events.ON_ERROR, (e) =>
		showErrorNotification(e.detail.message)
	);
};

onUpdated(() => {
	setupNotificationHandlers();
});

onMounted(async () => {
	globalStore.setLoader(true);
	await loadRecaptcha();
	setupNotificationHandlers();
	globalStore.setLoader(false);
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
