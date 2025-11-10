<template>
	<div
		class="d-flex flex-column justify-content-center align-items-center h-100 form-section"
	>
		<div>
			<h1 class="poppins-semibold">Reset your password?</h1>
		</div>
		<div>
			<el-input
				v-model="newPassword"
				class="poppins-light"
				type="password"
				placeholder="Enter new password"
				size="large"
				clearable
				show-password
			>
				<template #prefix>
					<font-awesome-icon :icon="['fas', 'lock']" class="fa-lg text-body" />
				</template>
			</el-input>
		</div>
		<div>
			<el-input
				v-model="confirmPassword"
				class="poppins-light"
				type="password"
				placeholder="Confirm your new password"
				size="large"
				clearable
				show-password
			>
				<template #prefix>
					<font-awesome-icon :icon="['fas', 'lock']" class="fa-lg text-body" />
				</template>
			</el-input>
		</div>
		<div>
			<el-button
				type="text"
				class="mt-4 poppins-light"
				@click="emit('back-to-login')"
				>Back to Login</el-button
			>
		</div>
		<div>
			<el-button
				class="poppins-light mt-5"
				type="primary"
				size="large"
				round
				plain
			>
				RESET PASSWORD
			</el-button>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";

const emit = defineEmits(["back-to-login"]);
const newPassword = ref("");
const confirmPassword = ref("");
</script>

<style lang="scss" scoped>
.form-section {
	padding: 60px 40px;
}
</style>
