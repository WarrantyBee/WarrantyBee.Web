<template>
	<div
		class="d-flex flex-column justify-content-center align-items-center h-100 component-container"
	>
		<div>
			<h1 class="poppins-semibold">Forgot your password?</h1>
		</div>
		<div class="mt-4">
			<p class="poppins-light fs-14">Enter your email to reset it</p>
		</div>
		<el-form ref="otpFormRef" :model="otpFormData" :rules="otpFormRules">
			<div class="d-flex gap-2 align-items-start mt-4 input-fields">
				<div class="w-70">
					<el-form-item prop="email">
						<el-input
							v-model="otpFormData.email"
							class="poppins-light"
							placeholder="Email"
							size="large"
							:disabled="firstTimeSend"
							@focus="suppressErrors()"
							clearable
						>
							<template #prefix>
								<font-awesome-icon
									:icon="['fas', 'envelope']"
									class="fa-lg text-body"
								/>
							</template>
						</el-input>
					</el-form-item>
				</div>
				<div class="w-30">
					<el-button
						class="w-100"
						type="primary"
						size="large"
						plain
						@click="sendOtp()"
						:loading="sending"
						:disabled="sending || !enableResendBtn || resetting"
						>{{
							firstTimeSend
								? timer > 0
									? formatSeconds(timer)
									: "RESEND"
								: "SEND OTP"
						}}</el-button
					>
				</div>
			</div>
		</el-form>
		<div class="d-flex justify-content-center text-danger">
			<small v-if="errors.userNotRegistered">
				No account is associated with the given email
			</small>
			<small v-else-if="errors.passwordRecentlyUpdated">
				Your password was recently updated. Please try again later.
			</small>
		</div>
		<el-form
			ref="passwordResetFormRef"
			:model="passwordResetFormData"
			:rules="passwordResetFormRules"
		>
			<div class="d-flex gap-2 align-items-start mt-4 input-fields">
				<div class="w-70">
					<el-form-item prop="newPassword">
						<el-input
							v-model="passwordResetFormData.newPassword"
							class="poppins-light"
							type="password"
							placeholder="New Password"
							size="large"
							show-password
							clearable
							:disabled="!firstTimeSend || resetting"
						>
							<template #prefix>
								<font-awesome-icon
									:icon="['fas', 'lock']"
									class="fa-lg text-body"
								/>
							</template>
						</el-input>
					</el-form-item>
				</div>
				<div class="w-30">
					<el-form-item prop="otp">
						<el-input
							v-model="passwordResetFormData.otp"
							class="poppins-light"
							placeholder="OTP"
							size="large"
							type="password"
							@keypress="takeDigits"
							maxlength="6"
							:disabled="!firstTimeSend || resetting"
							@focus="suppressErrors()"
						>
							<template #prefix>
								<font-awesome-icon
									:icon="['fas', 'key']"
									class="fa-lg text-body"
								/>
							</template>
						</el-input>
					</el-form-item>
				</div>
			</div>
			<div
				class="d-flex gap-2 align-items-start mt-4 input-fields"
				style="margin-top: 8px !important"
			>
				<div class="w-70">
					<el-form-item prop="confirmPassword">
						<el-input
							v-model="passwordResetFormData.confirmPassword"
							class="poppins-light"
							type="password"
							placeholder="Confirm Password"
							size="large"
							clearable
							:disabled="!firstTimeSend || resetting"
						>
							<template #prefix>
								<font-awesome-icon
									:icon="['fas', 'lock']"
									class="fa-lg text-body"
								/>
							</template>
						</el-input>
					</el-form-item>
				</div>
				<div class="w-30">
					<el-button
						class="w-100"
						type="primary"
						size="large"
						plain
						:disabled="!firstTimeSend || resetting || sending"
						:loading="resetting"
						@click="resetPassword()"
						>RESET</el-button
					>
				</div>
			</div>
		</el-form>
		<div class="d-flex justify-content-center text-danger">
			<small v-if="errors.invalidOtp">
				Please enter the valid One-Time Password (OTP)
			</small>
			<small v-else-if="errors.previouslyUsedPassword">
				Please enter a valid password that you have not used previously
			</small>
		</div>
		<div class="mt-4">
			<p
				class="poppins-light text-btn"
				@click="!(sending || resetting) && emit('sign-in')"
			>
				&lt; Back
			</p>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, defineEmits } from "vue";
import {
	Endpoints,
	HttpMethods,
	HttpStatus,
	ErrorCodes,
} from "../../constants";
import { apiRequest } from "../../services/api";

const emit = defineEmits(["sign-in"]);

const sending = ref(false);
const resetting = ref(false);
const timer = ref(60);
const firstTimeSend = ref(false);
const enableResendBtn = ref(true);
const errors = reactive({
	userNotRegistered: false,
	invalidOtp: false,
	previouslyUsedPassword: false,
	passwordRecentlyUpdated: false,
});
const otpFormRef = ref();
const otpFormData = reactive({
	email: "",
});
const otpFormRules = reactive({
	email: [
		{ required: true, message: "Please enter your email", trigger: "blur" },
		{
			type: "email",
			message: "Please enter a valid email",
			trigger: ["blur", "change"],
		},
	],
});
const passwordResetFormRef = ref();
const passwordResetFormData = reactive({
	newPassword: "",
	confirmPassword: "",
	otp: "",
});

const validateNewPassword = (rule, value, callback) => {
	const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

	if (!value) {
		callback(new Error("Password is required"));
	} else if (!strongRegex.test(value)) {
		callback(new Error("Only strong passwords are accepted"));
	} else {
		callback();
	}
};

const validateConfirmPassword = (rule, value, callback) => {
	if (!value) {
		callback(new Error("Confirm password is required"));
	} else if (value !== passwordResetFormData.newPassword) {
		callback(new Error("Passwords do not match"));
	} else {
		callback();
	}
};

const validateOtp = (rule, value, callback) => {
	const otpRegex = /^[0-9]{6}$/;

	if (!value) {
		callback(new Error("Required"));
	} else if (!otpRegex.test(value)) {
		callback(new Error("Required"));
	} else {
		callback();
	}
};

const suppressErrors = () => {
	errors.userNotRegistered = false;
	errors.invalidOtp = false;
	errors.previouslyUsedPassword = false;
	errors.passwordRecentlyUpdated = false;
};

const passwordResetFormRules = {
	otp: [{ validator: validateOtp, trigger: ["blur", "change"] }],
	newPassword: [
		{ validator: validateNewPassword, trigger: ["blur", "change"] },
	],
	confirmPassword: [
		{ validator: validateConfirmPassword, trigger: ["blur", "change"] },
	],
};

const formatSeconds = (seconds) => {
	const total = Math.max(0, Number(seconds) || 0);
	const minutes = Math.floor(total / 60);
	const secs = total % 60;
	const mm = String(minutes).padStart(2, "0");
	const ss = String(secs).padStart(2, "0");
	return `${mm}:${ss}`;
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

const takeDigits = (event) => {
	const char = String.fromCharCode(event.keyCode || event.which);

	if (!/^\d$/.test(char)) {
		event.preventDefault();
	}
};

const sendOtp = async () => {
	let hasFormValidationError = true;

	try {
		sending.value = true;
		suppressErrors();
		await otpFormRef.value.validate();
		hasFormValidationError = false;
		const requestBody = {
			email: otpFormData.email,
		};
		const response = await apiRequest(
			HttpMethods.POST,
			Endpoints.FORGOT_PASSWORD,
			requestBody
		);

		switch (response.status) {
			case HttpStatus.OK:
				sending.value = false;
				firstTimeSend.value = true;
				startTimer();
				break;
			default:
				throw new this.$WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		sending.value = false;
		if (hasFormValidationError) return;

		if (error?.response?.status === HttpStatus.NOT_FOUND) {
			if (error.response.data?.error?.code === ErrorCodes.USER_NOT_REGISTERED) {
				errors.userNotRegistered = true;
				return;
			}
		}

		if (error.response?.status === HttpStatus.TOO_MANY_REQUESTS) {
			if (
				error.response.data?.error?.code ===
				ErrorCodes.PASSWORD_RECENTLY_UPDATED
			) {
				errors.passwordRecentlyUpdated = true;
				return;
			}
		}

		notifyError("Oops! Something went wrong. Please try again later.");
		throw error;
	}
};

const resetPassword = async () => {
	let hasFormValidationError = true;

	try {
		resetting.value = true;
		suppressErrors();
		await passwordResetFormRef.value.validate();
		hasFormValidationError = false;
		const requestBody = {
			email: otpFormData.email,
			otp: passwordResetFormData.otp,
			newPassword: passwordResetFormData.newPassword,
		};
		const response = await apiRequest(
			HttpMethods.POST,
			Endpoints.RESET_PASSWORD,
			requestBody
		);

		switch (response.status) {
			case HttpStatus.OK:
				resetting.value = true;
				notifySuccess("Your password reset was successful.");
				emit("sign-in");
				break;
			default:
				throw new this.$WebError("Unexpected response from server.", response);
		}
	} catch (error) {
		resetting.value = false;
		if (hasFormValidationError) return;

		if (error?.response?.status === HttpStatus.BAD_REQUEST) {
			if (error.response.data?.error?.code === ErrorCodes.INVALID_OTP) {
				errors.invalidOtp = true;
				return;
			}
		}

		if (error.response?.status === HttpStatus.BAD_REQUEST) {
			if (
				error.response.data?.error?.code === ErrorCodes.PASSWORD_ALREADY_USED
			) {
				errors.previouslyUsedPassword = true;
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

	.field-errors {
		small {
			font-size: 12px;
			color: var(--el-color-danger);
		}
	}

	p.text-btn {
		cursor: pointer;
	}

	.fs-14 {
		font-size: 14px;
	}

	.input-fields {
		width: 400px;

		.w-30 {
			width: 30% !important;
		}

		.w-70 {
			width: 70% !important;
		}
	}
}
</style>
