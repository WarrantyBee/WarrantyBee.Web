<template>
	<div id="login-container" class="d-flex">
		<div class="d-flex h-100 info-section"></div>
		<div class="d-flex flex-column h-100 form-section">
			<div class="d-flex justify-content-end">
				<el-select v-model="value" placeholder="Select" style="width: 240px">
					<el-option
						v-for="item in languages"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</div>
			<div class="d-flex justify-content-center">
				<h1 class="poppins-semibold">Sign in to WarrantyBee</h1>
			</div>
			<div class="login-form">
				<el-form>
					<el-form-item>
						<el-input placeholder="Email" size="large" clearable>
							<template #prefix>
								<font-awesome-icon icon="envelope" />
							</template>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="Password" size="large" clearable>
							<template #prefix>
								<font-awesome-icon icon="lock" />
							</template>
						</el-input>
					</el-form-item>
					<div class="forgot-password d-flex justify-content-center">
						<span class="poppins-light">Forgot your password?</span>
					</div>
					<el-form-item class="justify-content-center">
						<el-button type="primary">SIGN IN</el-button>
					</el-form-item>
				</el-form>
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
		background: #001f66;
	}

	.form-section {
		flex-basis: 60%;
		padding: 70px 40px;

		.login-form {
			padding: 40px 120px;

			::v-deep(.justify-content-center > .el-form-item__content) {
				justify-content: center;
			}

			.forgot-password span {
				cursor: pointer;
				text-decoration: underline;
				text-underline-offset: 10px;
			}
		}
	}
}
</style>
