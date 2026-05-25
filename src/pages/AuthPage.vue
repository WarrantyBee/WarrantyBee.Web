<template>
	<div class="d-flex page-container" v-loading="loading">
		<div class="d-flex h-100 banner-section"></div>
		<div class="component-section">
			<SignUp
				v-if="activeComponent === AuthPageComponents.SIGN_UP"
				:data="signUpFormData"
				@sign-in="activeComponent = AuthPageComponents.SIGN_IN"
			/>
			<SignIn
				v-else-if="activeComponent === AuthPageComponents.SIGN_IN"
				@mfa-sign-in="redirectToMfaFlow"
				@forgot-password="activeComponent = AuthPageComponents.FORGOT_PASSWORD"
				@sign-up="activeComponent = AuthPageComponents.SIGN_UP"
				@sign-in-success="redirectToDashboard"
			/>
			<MFAChallenge
				v-else-if="activeComponent === AuthPageComponents.MFA_SIGN_IN"
				:data="signInFormData"
				@sign-in="activeComponent = AuthPageComponents.SIGN_IN"
				@sign-in-success="redirectToDashboard"
			/>
			<ForgotPassword
				v-else-if="activeComponent === AuthPageComponents.FORGOT_PASSWORD"
				@sign-in="activeComponent = AuthPageComponents.SIGN_IN"
			/>
		</div>
	</div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import SignIn from "../components/auth/SignIn.vue";
import SignUp from "../components/auth/SignUp.vue";
import MFAChallenge from "../components/auth/MFAChallenge.vue";
import ForgotPassword from "../components/auth/ForgotPassword.vue";
import { apiRequest } from "../services/api.js";
import { Endpoints, HttpMethods, HttpStatus } from "../constants.js";
import { WebError, telemetry } from "../services/telemetry.js";
import { ElMessage } from "element-plus";

const router = useRouter();
const AuthPageComponents = Object.freeze({
	SIGN_IN: 1,
	SIGN_UP: 2,
	MFA_SIGN_IN: 3,
	FORGOT_PASSWORD: 4,
});

const activeComponent = ref(AuthPageComponents.SIGN_IN);
const loading = ref(false);
const signUpFormData = reactive({
	countries: [],
});
const signInFormData = ref({});

const redirectToMfaFlow = (data) => {
	signInFormData.value = data;
	activeComponent.value = AuthPageComponents.MFA_SIGN_IN;
};

const redirectToDashboard = () => {
	router.push("/dashboard");
};

const getCountries = async () => {
	try {
		const response = await apiRequest(HttpMethods.GET, Endpoints.COUNTRIES);
		if (response?.status === HttpStatus.OK) {
			signUpFormData.countries = response.data.data;
		} else {
			throw new WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		ElMessage.error(
			"Something went wrong. Please refresh the page or try again later."
		);
		telemetry.logError(error);
		throw error;
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	loading.value = true;
	await getCountries();
});
</script>

<style lang="scss" scoped>
.page-container {
	width: 100vw;
	height: 100vh;
	background: #ffffff;

	.banner-section {
		flex-basis: 40%;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		background: url("../assets/login-info-section-bg.png");
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.component-section {
		flex-basis: 60%;
	}
}
</style>
