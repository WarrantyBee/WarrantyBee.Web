<template>
	<div id="login-container" class="d-flex">
		<div class="d-flex h-100 info-section"></div>
		<div class="component-section">
			<Login
				v-if="activeComponent === components.Login"
				@forgot-password="activeComponent = components.ForgotPassword"
			/>
			<ForgotPassword
				v-if="activeComponent === components.ForgotPassword"
				@back-to-login="activeComponent = components.Login"
				@proceed-to-reset="activeComponent = components.ResetPassword"
			/>
			<ResetPassword
				v-if="activeComponent === components.ResetPassword"
				@reset-success="activeComponent = components.Login"
				@back-to-login="activeComponent = components.Login"
			/>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Login from "../components/Login.vue";
import ForgotPassword from "../components/ForgotPassword.vue";
import ResetPassword from "../components/ResetPassword.vue";
import { AuthPageComponents } from "../constants";

const components = reactive(AuthPageComponents);
const activeComponent = ref(components.Login);
</script>

<style lang="scss" scoped>
#login-container {
	background: #ffffff;
	border-radius: 10px;
	width: 70%;
	height: 80%;
	box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
		rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
		rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

	.info-section {
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
