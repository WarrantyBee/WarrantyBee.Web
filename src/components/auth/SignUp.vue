<template>
	<div
		class="d-flex justify-content-center align-items-center h-100 component-container"
	>
		<div class="component-sub-container w-100">
			<div class="d-flex justify-content-center">
				<h1 class="poppins-semibold">Sign up to WarrantyBee</h1>
			</div>
			<div class="d-flex justify-content-center form-container px-5 pt-4 pb-0">
				<el-form class="w-100">
					<div class="d-flex gap-3">
						<el-form-item class="fb-50">
							<el-input
								class="poppins-light"
								placeholder="Firstname"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'user']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item class="fb-50" large>
							<el-input
								class="poppins-light"
								placeholder="Lastname"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'user']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
					</div>
					<div class="d-flex gap-3">
						<el-form-item class="fb-60">
							<el-input class="poppins-light" placeholder="Email" size="large">
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'envelope']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item class="fb-40">
							<el-select
								class="poppins-light"
								v-model="value"
								placeholder="Gender"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'mars-and-venus']"
										class="fa-lg text-body"
									/>
								</template>
								<el-option
									class="poppins-light"
									v-for="item in genders"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</div>
					<div class="d-flex gap-3">
						<el-form-item class="fb-100">
							<el-input
								class="poppins-light"
								placeholder="Address line 1"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'address-book']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
					</div>
					<div class="d-flex gap-3">
						<el-form-item class="fb-100">
							<el-input
								class="poppins-light"
								placeholder="Address line 2"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'address-book']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
					</div>
					<div class="d-flex gap-3">
						<el-form-item class="fb-55">
							<el-input
								class="poppins-light"
								placeholder="Phone number"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'phone']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item class="fb-45">
							<el-select
								class="poppins-light"
								v-model="value"
								placeholder="Preferred language"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'language']"
										class="fa-lg text-body"
									/>
								</template>
								<el-option
									class="poppins-light"
									v-for="item in genders"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</div>
					<div class="d-flex gap-3">
						<el-form-item class="fb-35">
							<el-select
								class="poppins-light"
								v-model="value"
								placeholder="Country"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'globe']"
										class="fa-lg text-body"
									/>
								</template>
								<el-option
									class="poppins-light"
									v-for="item in genders"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
						<el-form-item class="fb-45">
							<el-select
								class="poppins-light"
								v-model="value"
								placeholder="Region"
								size="large"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'location-dot']"
										class="fa-lg text-body"
									/>
								</template>
								<el-option
									class="poppins-light"
									v-for="item in genders"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
						<el-form-item class="fb-20">
							<el-button class="w-100" type="primary" plain size="large"
								>SIGN UP</el-button
							>
						</el-form-item>
					</div>
					<div class="d-flex align-items-center gap-2">
						<div class="login-provider">
							<font-awesome-icon :icon="['fab', 'facebook-f']" class="fa-lg" />
						</div>
						<div class="login-provider">
							<font-awesome-icon :icon="['fab', 'google']" class="fa-lg" />
						</div>
						<div class="login-provider">
							<font-awesome-icon :icon="['fab', 'linkedin-in']" class="fa-lg" />
						</div>
						<div class="flex-grow-1"></div>
						<div>
							<p class="poppins-light mb-0 text-btn" @click="emit('sign-in')">
								Already have an account?
							</p>
						</div>
					</div>
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
} from "../../constants.js";
const emit = defineEmits(["sign-in"]);

const genders = [
	{
		value: 1,
		label: "Male",
	},
	{
		value: 2,
		label: "Female",
	},
	{
		value: 3,
		label: "Prefer not to say",
	},
];
</script>

<style lang="scss" scoped>
.component-container {
	padding: 60px 40px;

	.component-sub-container {
		.fb-20 {
			flex-basis: 20%;
		}

		.fb-30 {
			flex-basis: 30%;
		}

		.fb-35 {
			flex-basis: 35%;
		}

		.fb-40 {
			flex-basis: 40%;
		}

		.fb-45 {
			flex-basis: 45%;
		}

		.fb-50 {
			flex-basis: 50%;
		}

		.fb-55 {
			flex-basis: 55%;
		}

		.fb-60 {
			flex-basis: 60%;
		}

		.fb-100 {
			flex-basis: 100%;
		}

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

		.custom-label p {
			margin-bottom: 0px;
			margin-top: 12px;
			font-size: 14px;
		}

		.login-provider {
			cursor: pointer;
			border: 1px solid #000000;
			border-radius: 8px;
			padding: 5px 10px;
		}

		.login-provider:hover {
			background: #000000;
			color: #ffffff;
		}

		.text-btn {
			cursor: pointer;
			font-size: 14px;
			text-decoration: underline;
			text-underline-offset: 10px;
		}
	}
}
</style>
