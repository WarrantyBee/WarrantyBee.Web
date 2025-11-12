<template>
	<div
		class="d-flex justify-content-center align-items-center h-100 form-section"
	>
		<div v-if="!inMFAMode">
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
			<div class="login-form">
				<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
					<el-form-item prop="email">
						<el-input
							v-model="loginForm.email"
							class="poppins-light"
							placeholder="Email"
							size="large"
							clearable
							:disabled="signingIn"
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
							v-model="loginForm.password"
							class="poppins-light"
							type="password"
							placeholder="Password"
							size="large"
							clearable
							show-password
							:disabled="signingIn"
						>
							<template #prefix>
								<font-awesome-icon
									:icon="['fas', 'lock']"
									class="fa-lg text-body"
								/>
							</template>
						</el-input>
					</el-form-item>
					<div class="forgot-password mt-5 d-flex justify-content-center">
						<span
							class="poppins-light"
							@click="!signingIn && emit('forgot-password')"
							>Forgot your password?</span
						>
					</div>
					<div class="forgot-password d-flex mt-3 justify-content-center">
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
		<div v-else class="mfa-section">
			<div>
				<div class="d-flex justify-content-center header-logo mb-3">
					<font-awesome-icon :icon="['fas', 'circle-check']" class="fa-lg" />
				</div>
				<div class="d-flex justify-content-center mt-4">
					<h2 class="poppins-semibold">Two-factor authentication</h2>
				</div>
				<div class="d-flex justify-content-center mt-3">
					<small class="poppins-light mb-0">
						Please enter the authentication code
					</small>
				</div>
				<div class="d-flex justify-content-center mt-2">
					<small class="poppins-light mb-0">
						The authentication code has been sent to {{ loginFormCopy.email }}
					</small>
				</div>
			</div>
			<div class="otp-container mt-5">
				<el-input
					v-for="(digit, index) in otp"
					:key="index"
					v-model="otp[index]"
					maxlength="1"
					class="otp-input"
					size="large"
					@input="focusNext(index)"
					@keydown.backspace="focusPrev(index, $event)"
					:disabled="signingIn || resending"
				/>
			</div>
			<div
				v-if="isAuthCodeEmpty"
				class="d-flex justify-content-center mt-2 text-danger"
			>
				<small class="poppins-light">Please enter the 6 digit code</small>
			</div>
			<div class="d-flex align-items-center mfa-actions mt-5">
				<div class="d-flex flex-grow-1 text-btn">
					<p
						class="poppins-light mb-0"
						@click="!signingIn && !resending && (inMFAMode = false)"
					>
						&lt; Back
					</p>
				</div>
				<div class="d-flex justify-content-end gap-1">
					<div>
						<el-button
							type="primary"
							size="large"
							round
							plain
							:disabled="signingIn || resending || !enableResendBtn"
							@click="(resending = true) && signIn()"
							:loading="resending"
							>{{ timer > 0 ? formatSeconds(timer) : "RESEND" }}</el-button
						>
					</div>
					<div>
						<el-button
							class="poppins-light"
							type="primary"
							size="large"
							round
							plain
							@click="signIn()"
							:loading="signingIn"
							:disabled="signingIn || resending"
							>VERIFY</el-button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, defineEmits, toRaw } from "vue";
import { apiRequest } from "../services/api.js";
import { HttpMethods, LoginTypes } from "../constants";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits(["forgot-password", "sign-up"]);
const loginFormRef = ref();
const loginForm = reactive({
	email: "",
	password: "",
});
const signingIn = ref(false);
const resending = ref(false);
const inMFAMode = ref(false);
const isAuthCodeEmpty = ref(false);
const enableResendBtn = ref(false);
const timer = ref(60);
const loginToken = ref("");
const otp = ref(Array(6).fill(""));
const loginFormCopy = reactive({});

const startTimer = () => {
	timer.value = 60;
	enableResendBtn.value = false;
	window.timerIntervalId = setInterval(() => {
		timer.value = timer.value - 1;
		if (timer.value === 0) {
			clearInterval(window.timerIntervalId);
			enableResendBtn.value = true;
		}
	}, 1000);
};

const formatSeconds = (seconds) => {
	const total = Math.max(0, Number(seconds) || 0);
	const minutes = Math.floor(total / 60);
	const secs = total % 60;
	const mm = String(minutes).padStart(2, "0");
	const ss = String(secs).padStart(2, "0");
	return `${mm}:${ss}`;
};

const loginFormRules = reactive({
	email: [
		{ required: true, message: "Please enter your email", trigger: "blur" },
		{
			type: "email",
			message: "Please enter a valid email",
			trigger: ["blur", "change"],
		},
	],
	password: [
		{ required: true, message: "Please enter your password", trigger: "blur" },
	],
});

const signIn = async () => {
	let requestBody = {};

	if (inMFAMode.value) {
		if (resending.value) {
			requestBody = {
				type: LoginTypes.SIMPLE,
				email: loginFormCopy.email,
				password: loginFormCopy.password,
			};
		} else {
			isAuthCodeEmpty.value = otp.value.some((digit) => digit === "");
			if (isAuthCodeEmpty.value) return;
			signingIn.value = true;
			requestBody = {
				type: LoginTypes.MFA,
				email: loginFormCopy.email,
				password: loginFormCopy.password,
				otp: otp.value.join(""),
				token: loginToken.value,
			};
		}
	} else {
		const valid = await loginFormRef.value.validate();
		if (!valid) return;
		signingIn.value = true;
		requestBody = {
			type: LoginTypes.SIMPLE,
			email: loginForm.email,
			password: loginForm.password,
		};
	}

	apiRequest(HttpMethods.POST, "/auth/login", requestBody)
		.then((response) => {
			if (response.hasOwnProperty("data") && response.data) {
				if (response.data.accessToken) {
					localStorage.setItem(
						"WARRANTYBEE_ACCESS_TOKEN",
						response.data.accessToken
					);
					router.push("/dashboard");
				} else if (response.data.loginToken) {
					loginToken.value = response.data.loginToken;
					if (!resending.value) {
						Object.assign(loginFormCopy, structuredClone(toRaw(loginForm)));
						Object.assign(
							loginForm,
							structuredClone({ email: "", password: "" })
						);
					}
					!inMFAMode.value && (inMFAMode.value = true);
					startTimer();
				}
			} else {
				throw new Error();
			}
			!resending.value && (signingIn.value = false);
			resending && (resending.value = false);
		})
		.catch((error) => {
			console.log(error);
			notifyError("Oops! Something went wrong. Please try again later.");
			signingIn.value = false;
		});
};

const focusNext = (index) => {
	isAuthCodeEmpty.value = otp.value.some((digit) => digit === "");
	if (otp.value[index].length === 1 && index < 5) {
		const nextInput = document.querySelectorAll(".otp-input input")[index + 1];
		nextInput?.focus();
	}
};

const focusPrev = (index, event) => {
	isAuthCodeEmpty.value = otp.value.some((digit) => digit === "");
	if (event.key === "Backspace" && !otp.value[index] && index > 0) {
		const prevInput = document.querySelectorAll(".otp-input input")[index - 1];
		prevInput?.focus();
	}
};
</script>

<style lang="scss" scoped>
.form-section {
	padding: 60px 40px;

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
		margin-top: 25px;
	}

	.login-form {
		padding: 25px 40px 0px 40px;

		::v-deep(.justify-content-center > .el-form-item__content) {
			justify-content: center;
		}

		.el-input__icon {
			font-size: 18px;
		}

		.forgot-password span {
			cursor: pointer;
			font-size: 14px;
			text-decoration: underline;
			text-underline-offset: 10px;
		}
	}
}

.mfa-section {
	.header-logo {
		font-size: 60px;
		color: #21bf74;
	}

	.text-btn p {
		cursor: pointer;
	}

	.otp-container {
		display: flex;
		justify-content: center;
		gap: 10px;

		.otp-input {
			width: 50px;

			::v-deep(.el-input__inner) {
				text-align: center;
			}
		}
	}
}
</style>
