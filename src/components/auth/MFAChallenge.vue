<template>
	<div
		class="d-flex justify-content-center align-items-center h-100 component-container"
	>
		<div class="component-sub-container">
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
						The authentication code has been sent to {{ data.email }}
					</small>
				</div>
			</div>
			<div class="otp-container mt-5">
				<el-input
					v-for="(digit, index) in otp"
					:key="index"
					v-model="otp[index]"
					type="password"
					maxlength="1"
					class="otp-input"
					size="large"
					@input="focusNext(index)"
					@keypress="takeDigits"
					@keydown.backspace="focusPrev(index, $event)"
					:disabled="signingIn || resending"
				/>
			</div>
			<div
				v-if="hasError()"
				class="d-flex justify-content-center mt-4 text-danger"
			>
				<small v-if="errors.isAuthCodeEmpty" class="poppins-light"
					>Please enter the 6 digit code</small
				>
				<small v-else-if="errors.invalidAuthCode" class="poppins-light"
					>Please enter the valid code</small
				>
			</div>
			<div class="d-flex align-items-center mfa-actions mt-5">
				<div class="d-flex flex-grow-1 text-btn">
					<p
						class="poppins-light mb-0"
						@click="!signingIn && !resending && emit('sign-in')"
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
							@click="resend()"
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
import { ref, reactive, defineEmits, defineProps, onMounted } from "vue";
import { apiRequest } from "../../services/api";
import {
	Endpoints,
	HttpMethods,
	HttpStatus,
	CacheKeys,
	ErrorCodes,
} from "../../constants";

const emit = defineEmits(["sign-in", "sign-in-success"]);
const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
});

const timer = ref(60);
const enableResendBtn = ref(false);
const signingIn = ref(false);
const resending = ref(false);
const otp = ref(Array(6).fill(""));
const loginToken = ref("");
const errors = reactive({
	isAuthCodeEmpty: false,
	invalidAuthCode: false,
});
const LoginTypes = reactive({
	SIMPLE: "login",
	MFA: "mfa",
});

const hasError = () => {
	return Object.values(errors).some((val) => val === true);
};

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

const focusNext = (index) => {
	errors.isAuthCodeEmpty = otp.value.some((digit) => digit === "");
	errors.invalidAuthCode = false;
	if (otp.value[index].length === 1 && index < 5) {
		const nextInput = document.querySelectorAll(".otp-input input")[index + 1];
		nextInput?.focus();
	}
};

const focusPrev = (index, event) => {
	errors.isAuthCodeEmpty = otp.value.some((digit) => digit === "");
	errors.invalidAuthCode = false;
	if (event.key === "Backspace" && !otp.value[index] && index > 0) {
		const prevInput = document.querySelectorAll(".otp-input input")[index - 1];
		prevInput?.focus();
	}
};

const takeDigits = (event) => {
	const char = String.fromCharCode(event.keyCode || event.which);

	if (!/^\d$/.test(char)) {
		event.preventDefault();
	}
};

const resend = async () => {
	try {
		resending.value = true;
		enableResendBtn.value = false;
		const requestBody = {
			type: LoginTypes.SIMPLE,
			email: props.data.email,
			password: props.data.password,
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
					loginToken.value = data.loginToken;
					startTimer();
					resending.value = false;
				} else {
					throw new this.$WebError(
						"Login token not found in response.",
						response
					);
				}
				break;
			default:
				throw new this.$WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		resending.value = false;
		enableResendBtn.value = true;
		notifyError("Oops! Something went wrong. Please try again later.");
		throw error;
	}
};

const signIn = async () => {
	try {
		errors.isAuthCodeEmpty = otp.value.some((digit) => digit === "");
		if (errors.isAuthCodeEmpty) return;

		errors.invalidAuthCode = false;
		signingIn.value = true;

		const requestBody = {
			type: LoginTypes.MFA,
			email: props.data.email,
			password: props.data.password,
			otp: otp.value.join(""),
			token: loginToken.value,
		};

		const response = await apiRequest(
			HttpMethods.POST,
			Endpoints.LOGIN,
			requestBody
		);

		switch (response.status) {
			case HttpStatus.OK: {
				const data = response.data?.data;
				if (data?.accessToken) {
					localStorage.setItem(CacheKeys.ACCESS_TOKEN, data.accessToken);
					signingIn.value = false;
					emit("sign-in-success", data);
				} else {
					throw new this.$WebError(
						"Access token not found in response.",
						response
					);
				}
				break;
			}
			default:
				throw new this.$WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		signingIn.value = false;

		if (error.response?.status === HttpStatus.BAD_REQUEST) {
			if (error.response.data?.error?.code === ErrorCodes.INVALID_OTP) {
				errors.invalidAuthCode = true;
				return;
			}
		}

		notifyError("Oops! Something went wrong. Please try again later.");
		throw error;
	}
};

onMounted(() => {
	const el = document.querySelector(".otp-input input");
	el?.focus();
	loginToken.value = props.data.loginToken;
	startTimer();
});
</script>

<style lang="scss" scoped>
.component-container {
	padding: 60px 40px;

	.component-sub-container {
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
}
</style>
