<template>
	<div
		class="d-flex justify-content-center align-items-center h-100 component-container"
	>
		<div class="component-sub-container">
			<div class="d-flex justify-content-center">
				<h1 class="poppins-semibold">Sign in to WarrantyBee</h1>
			</div>
			<div class="d-flex mt-4 login-providers justify-content-center">
				<div class="d-flex gap-3">
					<div class="icon">
						<font-awesome-icon :icon="['fab', 'facebook-f']" class="fa-lg" />
					</div>
					<div class="icon">
						<font-awesome-icon :icon="['fab', 'google']" class="fa-lg" />
					</div>
					<div class="icon">
						<font-awesome-icon :icon="['fab', 'linkedin-in']" class="fa-lg" />
					</div>
				</div>
			</div>
			<div
				class="d-flex account-credential-label justify-content-center poppins-light"
			>
				<p>or use your account credentials</p>
			</div>
			<div class="sign-in-form">
				<el-form
					ref="signInFormRef"
					:model="signInFormData"
					:rules="signInFormRules"
				>
					<el-form-item prop="email">
						<el-input
							v-model="signInFormData.email"
							class="poppins-light"
							placeholder="Email"
							size="large"
							clearable
							:disabled="signingIn"
							@focus="suppressErrors()"
							@keypress.enter="signIn()"
							@keydown="blockEmptyInput"
						>
							<template #prefix>
								<font-awesome-icon
									:icon="['fas', 'envelope']"
									class="fa-lg text-body"
								/>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item class="pt-2" prop="password">
						<el-input
							v-model="signInFormData.password"
							class="poppins-light"
							type="password"
							placeholder="Password"
							size="large"
							clearable
							show-password
							:disabled="signingIn"
							@focus="suppressErrors()"
							@keypress.enter="signIn()"
							@keydown="blockEmptyInput"
						>
							<template #prefix>
								<font-awesome-icon
									:icon="['fas', 'lock']"
									class="fa-lg text-body"
								/>
							</template>
						</el-input>
					</el-form-item>
					<div
						v-if="hasError()"
						class="d-flex justify-content-center mt-4 text-danger"
					>
						<small v-if="errors.wrongEmailOrPassword" class="poppins-light">
							You have given wrong credentials
						</small>
						<small v-else-if="errors.userNotRegistered" class="poppins-light">
							No account is associated with the given email
						</small>
					</div>
					<div
						class="forgot-password d-flex gap-3 flex-column align-items-center"
						:style="{ 'margin-top': hasError() ? '14px' : '40px' }"
					>
						<span
							class="poppins-light"
							@click="!signingIn && emit('forgot-password')"
							>Forgot your password?</span
						>
						<span class="poppins-light" @click="!signingIn && emit('sign-up')"
							>Not a member ? Sign up now</span
						>
					</div>
					<el-form-item class="justify-content-center pt-4 mb-0">
						<el-button
							class="poppins-light"
							type="primary"
							size="large"
							round
							plain
							@click="signIn()"
							:loading="signingIn"
							:disabled="signingIn"
						>
							SIGN IN
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, defineEmits, toRaw } from "vue";
import { apiRequest } from "../../services/api.js";
import {
	HttpMethods,
	HttpStatus,
	ErrorCodes,
	Endpoints,
	CacheKeys,
	MenuItems,
} from "../../constants.js";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../../stores/global/index.js";

const globalStore = useGlobalStore();
const router = useRouter();
const emit = defineEmits([
	"mfa-sign-in",
	"forgot-password",
	"sign-up",
	"sign-in-success",
]);

const signInFormRef = ref();
const signingIn = ref(false);
const signInFormData = reactive({
	email: "",
	password: "",
});
const LoginTypes = reactive({
	SIMPLE: "login",
	MFA: "mfa",
});
const signInFormRules = reactive({
	email: [
		{ required: true, message: "Please enter your email", trigger: "blur" },
		{
			type: "email",
			message: "Please enter a valid email",
			trigger: ["blur", "change"],
		},
	],
	password: [
		{
			required: true,
			message: "Please enter your password",
			trigger: ["blur", "change"],
		},
	],
});
const errors = reactive({
	userNotRegistered: false,
	wrongEmailOrPassword: false,
});

const hasError = () => {
	return Object.values(errors).some((val) => val === true);
};

const suppressErrors = () => {
	errors.userNotRegistered = false;
	errors.wrongEmailOrPassword = false;
};

const blockEmptyInput = (event) => {
	if (event.key === " ") {
		event.preventDefault();
	}
};

const signIn = async () => {
	let hasFormValidationError = true;

	try {
		suppressErrors();
		await signInFormRef.value.validate();
		hasFormValidationError = false;
		signingIn.value = true;
		const requestBody = {
			type: LoginTypes.SIMPLE,
			email: signInFormData.email?.trim(),
			password: signInFormData.password?.trim(),
		};
		const response = await apiRequest(
			HttpMethods.POST,
			Endpoints.LOGIN,
			requestBody
		);

		switch (response.status) {
			case HttpStatus.OK:
				const data = response.data?.data;
				if (data?.loginToken) {
					emit("mfa-sign-in", {
						email: signInFormData.email,
						password: signInFormData.password,
						loginToken: data.loginToken,
					});
				} else if (data?.accessToken) {
					localStorage.setItem(CacheKeys.ACCESS_TOKEN, data.accessToken);
					globalStore.setUser(data.user);
					globalStore.setAccessToken(data.accessToken);
					emit("sign-in-success");
				} else {
					throw new this.$WebError(
						"Access token or login token not found in response.",
						response
					);
				}
				break;
			default:
				throw new this.$WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		signingIn.value = false;
		if (hasFormValidationError) return;

		if (error?.response?.status === HttpStatus.BAD_REQUEST) {
			if (error.response.data?.error?.code === ErrorCodes.INVALID_CREDENTIALS) {
				errors.wrongEmailOrPassword = true;
				return;
			}
		}

		if (error.response?.status === HttpStatus.NOT_FOUND) {
			if (error.response.data?.error?.code === ErrorCodes.USER_NOT_REGISTERED) {
				errors.userNotRegistered = true;
				return;
			}
		}

		notifyError("Oops! Something went wrong. Please try again later.");
		throw error;
	}
};
</script>

<style lang="scss" scoped>
.component-container {
	padding: 60px 40px;

	.component-sub-container {
		.login-providers {
			div.icon {
				padding: 10px;
				border-radius: 50%;
				border: 0.5px solid;
			}

			div.icon:hover {
				cursor: pointer;
				background-color: #000000;
				color: #ffffff;
			}
		}

		.account-credential-label p {
			margin-bottom: 0px;
			margin-top: 20px;
			font-size: 14px;
		}

		.sign-in-form {
			padding: 25px 40px 0px 40px;

			::v-deep(.justify-content-center > .el-form-item__content) {
				justify-content: center;
			}

			.el-input__icon {
				font-size: 18px;
			}

			.forgot-password {
				span {
					display: block;
					cursor: pointer;
					font-size: 14px;
					text-decoration: underline;
					text-underline-offset: 10px;
				}
			}
		}
	}
}
</style>
