<template>
	<div class="d-flex page-container">
		<div class="d-flex h-100 banner-section"></div>
		<div class="component-section">
			<SignUp
				v-if="activeComponent === AuthPageComponents.SIGN_UP"
				@sign-in="activeComponent = AuthPageComponents.SIGN_IN"
			/>
			<SignIn
				v-if="activeComponent === AuthPageComponents.SIGN_IN"
				@mfa-sign-in="redirectToMfaFlow"
				@forgot-password="activeComponent = AuthPageComponents.FORGOT_PASSWORD"
				@sign-up="activeComponent = AuthPageComponents.SIGN_UP"
				@sign-in-success="redirectToDashboard"
			/>
			<MFAChallenge
				v-if="activeComponent === AuthPageComponents.MFA_SIGN_IN"
				:data="signInFormData"
				@sign-in="activeComponent = AuthPageComponents.SIGN_IN"
				@sign-in-success="redirectToDashboard"
			/>
			<ForgotPassword
				v-if="activeComponent === AuthPageComponents.FORGOT_PASSWORD"
				@sign-in="activeComponent = AuthPageComponents.SIGN_IN"
			/>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import SignUp from "../components/auth/SignUp.vue";
import SignIn from "../components/auth/SignIn.vue";
import MFAChallenge from "../components/auth/MFAChallenge.vue";
import ForgotPassword from "../components/auth/ForgotPassword.vue";

const router = useRouter();
const AuthPageComponents = reactive({
	SIGN_UP: 1,
	SIGN_IN: 2,
	MFA_SIGN_IN: 3,
	FORGOT_PASSWORD: 4,
	RESET_PASSWORD: 5,
});
const activeComponent = ref(AuthPageComponents.SIGN_IN);
const signInFormData = ref({
	email: "",
	password: "",
	loginToken: "",
});

const redirectToMfaFlow = (data) => {
	signInFormData.value = data;
	activeComponent.value = AuthPageComponents.MFA_SIGN_IN;
};

const redirectToDashboard = () => {
	router.push("/dashboard");
};
</script>

<style lang="scss" scoped>
.page-container {
	background: #ffffff;
	border-radius: 10px;
	width: 70%;
	height: 80%;
	box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
		rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
		rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

	.banner-section {
		flex-basis: 40%;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
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
