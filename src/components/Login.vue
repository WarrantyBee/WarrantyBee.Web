<template>
	<div id="login-container" class="d-flex">
		<div class="d-flex h-100 info-section"></div>
		<div
			class="d-flex justify-content-center align-items-center h-100 form-section"
		>
			<div class="">
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
					<el-form>
						<el-form-item>
							<el-input
								v-model="loginForm.email"
								class="poppins-light"
								placeholder="Email"
								size="large"
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
						<el-form-item>
							<el-input
								v-model="loginForm.password"
								class="poppins-light"
								type="password"
								placeholder="Password"
								size="large"
								clearable
								show-password
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'lock']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<div class="forgot-password d-flex justify-content-center">
							<span class="poppins-light">Forgot your password?</span>
						</div>
						<el-form-item class="justify-content-center">
							<el-button
								class="poppins-light mt-5"
								type="primary"
								size="large"
								round
								plain
								@click="console.log(loginForm)"
							>
								SIGN IN
							</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
	email: "",
	password: "",
});

const loginRules = reactive({
	email: [
		{ required: true, message: "Please input email address", trigger: "blur" },
		{
			type: "email",
			message: "Please input correct email address",
			trigger: ["blur", "change"],
		},
	],
	password: [
		{ required: true, message: "Please input password", trigger: "blur" },
		{
			min: 6,
			message: "Length should be at least 6 characters",
			trigger: "blur",
		},
	],
});

const languages = [
	{
		value: "en",
		label: "English",
	},
	{
		value: "es",
		label: "Español",
	},
	{
		value: "fr",
		label: "Français",
	},
	{
		value: "de",
		label: "Deutsch",
	},
	{
		value: "ja",
		label: "日本語 (Nihongo)",
	},
	{
		value: "zh",
		label: "中文 (Zhōngwén)",
	},
];

const submitLogin = (formEl) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			loading.value = true;
			console.log("Login form submitted", loginForm);
			// Simulate API call
			setTimeout(() => {
				loading.value = false;
				ElMessage.success("Login successful");
			}, 2000);
		} else {
			ElMessage.error("Please check the form");
			return false;
		}
	});
};
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

	.form-section {
		flex-basis: 60%;
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
}
</style>
