<template>
	<div
		class="d-flex flex-column justify-content-center align-items-center h-100 form-section"
	>
		<div>
			<h1 class="poppins-semibold">Forgot your password?</h1>
		</div>
		<div class="mt-4">
			<p class="poppins-light">Enter your email to reset it</p>
		</div>
		<div class="d-flex gap-2 align-items-center mt-4">
			<div>
				<el-input
					v-model="email"
					class="poppins-light"
					placeholder="Email"
					size="large"
				>
					<template #prefix>
						<font-awesome-icon
							:icon="['fas', 'envelope']"
							class="fa-lg text-body"
						/>
					</template>
				</el-input>
			</div>
			<div>
				<el-button type="primary" size="large" plain>Send OTP</el-button>
			</div>
		</div>
		<div class="d-flex gap-2 align-items-center mt-4">
			<div>
				<el-input
					v-model="otp"
					class="poppins-light"
					placeholder="OTP"
					size="large"
				>
					<template #prefix>
						<font-awesome-icon :icon="['fas', 'key']" class="fa-lg text-body" />
					</template>
				</el-input>
			</div>
			<div>
				<el-button
					type="primary"
					size="large"
					@click="emit('proceed-to-reset')"
					plain
					>Proceed&nbsp;</el-button
				>
			</div>
		</div>
		<div>
			<el-button
				type="text"
				class="mt-4 poppins-light"
				@click="emit('back-to-login')"
				>Back to Login</el-button
			>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";

const emit = defineEmits(["back-to-login", "proceed-to-reset"]);
const email = ref("");
const otp = ref("");
</script>

<style lang="scss" scoped>
.form-section {
	padding: 60px 40px;
}
</style>
