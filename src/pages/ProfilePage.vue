<template>
	<div class="d-flex flex-column page-container">
		<MenuBar />
		<div class="page-sub-container-wrapper px-5 pt-4">
			<div class="d-flex flex-column page-sub-container">
				<div class="d-flex profile-banner"></div>
				<div class="d-flex flex-column p-5 profile-form-container">
					<div class="d-flex profile-form-row">
						<div class="d-flex gap-3 align-items-center profile-form-col">
							<div class="d-flex">
								<img :src="profileForm.avatarUrl" class="profile-picture" />
								<font-awesome-icon
									:icon="['fas', uploading ? 'rotate' : 'camera']"
									class="profile-picture-edit fa-lg"
									:class="{ spin: uploading }"
									@click="!uploading && selectProfilePicture()"
								/>
								<input
									class="d-none upload-profile-picture"
									type="file"
									accept="image/*"
									@change="uploadProfilePicture($event)"
								/>
							</div>
							<div class="d-flex flex-column">
								<h3 class="poppins-semibold">
									{{ globalStore.getUserFullName }}
								</h3>
								<p class="text-muted mb-0 poppins-light">
									{{ profileForm.email }}
								</p>
							</div>
						</div>
						<div
							class="d-flex align-items-center gap-3 profile-form-col flex-grow-1 justify-content-end"
						>
							<div v-if="inEditMode" class="d-flex">
								<el-button
									class="poppins-light"
									type="success"
									size="large"
									@click="saveProfile"
									:loading="saving"
									:disabled="saving"
								>
									SAVE
								</el-button>
							</div>
							<div v-if="inEditMode" class="d-flex">
								<el-button
									class="poppins-light"
									size="large"
									@click="cancelEdit"
									plain
									:disabled="saving"
								>
									CANCEL
								</el-button>
							</div>
							<div v-if="!inEditMode" class="d-flex">
								<el-button
									class="poppins-light"
									type="primary"
									size="large"
									@click="editProfile"
								>
									EDIT
								</el-button>
							</div>
						</div>
					</div>
					<div class="d-flex flex-column profile-form-row mt-4">
						<el-form
							v-if="showForm"
							ref="profileFormRef"
							:rules="profileFormRules"
							:model="profileForm"
						>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="First Name"
										prop="firstname"
									>
										<el-input
											name="firstname"
											v-model="profileForm.firstname"
											size="large"
											disabled
											@keydown="blockEmptyInput($event)"
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'user']"
													class="fa-lg text-body disable-mode"
												/>
											</template>
										</el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="Last Name"
										prop="lastname"
									>
										<el-input
											name="lastname"
											v-model="profileForm.lastname"
											size="large"
											disabled
											@keydown="blockEmptyInput($event)"
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'user']"
													class="fa-lg text-body disable-mode"
												/>
											</template>
										</el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-50">
									<el-form-item
										class="w-100 poppins-light"
										label="Address Line 1"
										prop="addressLine1"
									>
										<el-input
											name="addressLine1"
											v-model="profileForm.addressLine1"
											size="large"
											:disabled="!inEditMode || saving"
											@keydown="blockEmptyInput($event)"
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'address-book']"
													class="fa-lg text-body"
													:class="{ 'disable-mode': !inEditMode || saving }"
												/>
											</template>
										</el-input>
									</el-form-item>
								</div>
							</div>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="Email"
										prop="email"
									>
										<el-input
											name="email"
											v-model="profileForm.email"
											size="large"
											disabled
											@keydown="blockEmptyInput($event)"
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'envelope']"
													class="fa-lg text-body disable-mode"
												/>
											</template>
										</el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="Phone Number"
										prop="phoneNumber"
									>
										<el-input
											name="phoneNumber"
											class="poppins-light"
											placeholder="Phone number"
											size="large"
											v-model="profileForm.phoneNumber"
											:disabled="!inEditMode || saving"
											@keydown="allowOnlyDigits($event)"
										>
											<template #prepend>
												<el-select
													v-model="profileForm.phoneCode"
													class="poppins-light"
													size="large"
													style="width: 120px"
													placeholder="Code"
													:disabled="!inEditMode"
													:style="{
														backgroundColor: inEditMode
															? '#ffffff'
															: 'var(--el-disabled-bg-color)',
													}"
												>
													<template #prefix>
														<font-awesome-icon
															:icon="['fas', 'phone']"
															class="fa-lg text-body"
															:class="{ 'disable-mode': !inEditMode || saving }"
														/>
													</template>
													<template #label>
														<span>{{ profileForm.phoneCode }}</span>
													</template>
													<el-option
														v-for="item in globalStore.phoneCodes"
														:key="item.value"
														:label="item.name"
														:value="item.value"
													>
														<template #default>
															<img
																:src="`https://flagcdn.com/24x18/${item.iso2.toLowerCase()}.png`"
																alt=""
																style="margin-right: 8px"
															/>
															{{ item.name }} ({{ item.value }})
														</template>
													</el-option>
												</el-select>
											</template>
										</el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-50">
									<el-form-item
										class="w-100 poppins-light"
										label="Address Line 2"
										prop="addressLine2"
									>
										<el-input
											name="addressLine2"
											v-model="profileForm.addressLine2"
											size="large"
											:disabled="!inEditMode || saving"
											@keydown="blockEmptyInput($event)"
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'address-book']"
													class="fa-lg text-body"
													:class="{ 'disable-mode': !inEditMode || saving }"
												/>
											</template>
										</el-input>
									</el-form-item>
								</div>
							</div>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="Postal Code"
										prop="postalCode"
									>
										<el-input
											name="postalCode"
											v-model="profileForm.postalCode"
											size="large"
											:disabled="!inEditMode || saving"
											@keydown="allowOnlyDigits($event)"
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'envelopes-bulk']"
													class="fa-lg text-body"
													:class="{ 'disable-mode': !inEditMode || saving }"
												/>
											</template>
										</el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="City"
										prop="city"
									>
										<el-input
											name="city"
											v-model="profileForm.city"
											size="large"
											:disabled="!inEditMode || saving"
											@keydown="blockEmptyInput($event)"
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'city']"
													class="fa-lg text-body"
													:class="{ 'disable-mode': !inEditMode || saving }"
												/>
											</template>
										</el-input>
									</el-form-item>
								</div>
								<div class="d-flex gap-5 fb-50">
									<div class="d-flex fb-50">
										<el-form-item
											class="w-100 poppins-light"
											label="Region"
											prop="regionId"
										>
											<el-select
												name="regionId"
												v-model="profileForm.regionId"
												class="poppins-light"
												placeholder="Region"
												size="large"
												:disabled="
													!regions ||
													regions.length === 0 ||
													!inEditMode ||
													saving
												"
											>
												<template #prefix>
													<font-awesome-icon
														:icon="['fas', 'location-dot']"
														class="fa-lg text-body"
														:class="{ 'disable-mode': !inEditMode || saving }"
													/>
												</template>
												<el-option
													class="poppins-light"
													v-for="item in regions"
													:key="item.id"
													:label="item.name"
													:value="item.id"
												/>
											</el-select>
										</el-form-item>
									</div>
									<div class="d-flex fb-50">
										<el-form-item
											class="w-100 poppins-light"
											label="Country"
											prop="countryId"
										>
											<el-select
												name="countryId"
												v-model="profileForm.countryId"
												class="poppins-light"
												placeholder="Country"
												size="large"
												:disabled="!inEditMode || saving"
											>
												<template #prefix>
													<font-awesome-icon
														:icon="['fas', 'globe']"
														class="fa-lg text-body"
														:class="{ 'disable-mode': !inEditMode || saving }"
													/>
												</template>
												<el-option
													class="poppins-light"
													v-for="item in globalStore.countries"
													:key="item.id"
													:label="item.name"
													:value="item.id"
												>
													<template #default>
														<img
															:src="`https://flagcdn.com/24x18/${item.iso2.toLowerCase()}.png`"
															alt=""
															style="margin-right: 8px"
														/>
														{{ item.name }}
													</template>
												</el-option>
											</el-select>
										</el-form-item>
									</div>
								</div>
							</div>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="Date Of Birth"
										prop="dateOfBirth"
									>
										<el-date-picker
											name="dateOfBirth"
											v-model="profileForm.dateOfBirth"
											class="poppins-light w-100"
											:class="{ 'disable-mode': !inEditMode || saving }"
											type="date"
											placeholder="Date of birth"
											size="large"
											disabled
											:disabled-date="disableMinorDoB"
										/>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item
										class="w-100 poppins-light"
										label="Gender"
										prop="gender"
									>
										<el-select
											name="gender"
											class="poppins-light"
											v-model="profileForm.gender"
											placeholder="Gender"
											size="large"
											disabled
										>
											<template #prefix>
												<font-awesome-icon
													:icon="['fas', 'mars-and-venus']"
													class="fa-lg text-body disable-mode"
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
								<div class="d-flex gap-5 fb-50">
									<div class="d-flex fb-50">
										<el-form-item
											class="w-100 poppins-light"
											prop="cultureId"
											label="Preferred Language"
										>
											<el-select
												name="cultureId"
												class="poppins-light"
												placeholder="Preferred language"
												size="large"
												v-model="profileForm.cultureId"
												:disabled="!inEditMode || saving"
											>
												<template #prefix>
													<font-awesome-icon
														:icon="['fas', 'language']"
														class="fa-lg text-body"
														:class="{ 'disable-mode': !inEditMode || saving }"
													/>
												</template>
												<el-option-group
													v-for="group in cultures"
													:key="group.label"
													:label="group.label"
												>
													<el-option
														class="poppins-light"
														v-for="item in group.options"
														:key="item.value"
														:label="item.label"
														:value="item.value"
													/>
												</el-option-group>
											</el-select>
										</el-form-item>
									</div>
									<div class="d-flex fb-50">
										<el-form-item class="w-100"></el-form-item>
									</div>
								</div>
							</div>
						</el-form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch, toRaw } from "vue";
import MenuBar from "../components/MenuBar.vue";
import { useGlobalStore } from "../stores/global/index.js";
import { apiRequest } from "../services/api";
import { Endpoints, Genders, HttpMethods, HttpStatus } from "../constants";
import { hasDifference, getDifference } from "../utils/jsonhelper.js";

const globalStore = useGlobalStore();
const profileFormRef = ref();
const inEditMode = ref(false);
const saving = ref(false);
const showForm = ref(false);
const uploading = ref(false);
const originalProfileForm = reactive({});

const profileForm = reactive({
	id: null,
	firstname: "",
	lastname: "",
	email: "",
	phoneCode: null,
	phoneNumber: "",
	gender: null,
	dateOfBirth: null,
	addressLine1: "",
	addressLine2: "",
	city: "",
	postalCode: "",
	countryId: null,
	regionId: null,
	cultureId: null,
	avatarUrl: null,
});

const regions = computed(() => {
	const data = globalStore.countries.find(
		(c) => c.id === profileForm.countryId
	)?.regions;
	return data || [];
});

watch(
	() => profileForm.countryId,
	(newCountryId, oldCountryId) => {
		if (
			inEditMode.value &&
			newCountryId !== oldCountryId &&
			oldCountryId !== null
		) {
			profileForm.regionId = null;
		}
	}
);

const cultures = computed(() => {
	const allCultures = (globalStore.cultures || []).map((c, index) => ({
		...c,
		index,
	}));

	const countryId = profileForm.countryId;

	if (!countryId) {
		return [{ label: "Others", options: allCultures }];
	}

	let recommended = allCultures.filter((c) => c.countryId === countryId);

	if (recommended.length === 0) {
		recommended = allCultures.filter((c) =>
			["en-US", "es-ES", "de-DE"].includes(c.iso)
		);
	}

	const recommendedIds = recommended.map((c) => c.value);
	const others = allCultures.filter((c) => !recommendedIds.includes(c.value));

	const groups = [];
	if (recommended.length > 0) {
		groups.push({ label: "Recommended", options: recommended });
	}
	if (others.length > 0) {
		groups.push({ label: "Others", options: others });
	}

	return groups;
});

const genders = [
	{
		value: Genders.MALE,
		label: "Male",
	},
	{
		value: Genders.FEMALE,
		label: "Female",
	},
	{
		value: Genders.PREFER_NOT_TO_SAY,
		label: "Prefer not to say",
	},
];

const validatePhoneNumber = (rule, value, callback) => {
	if (profileForm.phoneCode === null) {
		callback(new Error("Please select your country code"));
	} else if (value?.length !== 10) {
		callback(new Error("Phone number should be exactly 10 digits"));
	} else {
		callback();
	}
};

const validateGender = (rule, value, callback) => {
	if (!Object.values(Genders).includes(value)) {
		callback(new Error("Please select your gender"));
	} else {
		callback();
	}
};

const validatePostalCode = (rule, value, callback) => {
	if (value?.length !== 6) {
		callback(new Error("Postal code should be exactly 6 digits"));
	} else {
		callback();
	}
};

const validateCountry = (rule, value, callback) => {
	if (!globalStore.countries.map((c) => c.id).includes(value)) {
		callback(new Error("Please select your country"));
	} else {
		callback();
	}
};

const validateRegion = (rule, value, callback) => {
	if (
		typeof value === "undefined" ||
		!regions ||
		!regions.value ||
		!regions.value.map((c) => c.id).includes(value)
	) {
		callback(new Error("Please select your region"));
	} else {
		callback();
	}
};

const validateCulture = (rule, value, callback) => {
	if (value === null) {
		callback(new Error("Please select your preferred language"));
	} else {
		callback();
	}
};

const profileFormRules = reactive({
	firstname: [
		{
			required: true,
			message: "Please enter your first name",
			trigger: ["blur", "change"],
		},
	],
	lastname: [
		{
			required: true,
			message: "Please enter your last name",
			trigger: ["blur", "change"],
		},
	],
	email: [
		{
			required: true,
			message: "Please enter your email",
			trigger: ["blur", "change"],
		},
		{
			type: "email",
			message: "Please enter a valid email",
			trigger: ["blur", "change"],
		},
	],
	phoneNumber: [
		{
			required: true,
			message: "Please enter your phone number",
			trigger: ["blur", "change"],
		},
		{
			validator: validatePhoneNumber,
			trigger: ["blur", "change"],
		},
	],
	gender: [
		{
			required: true,
			message: "Please select your gender",
			trigger: ["blur", "change"],
		},
		{
			validator: validateGender,
			trigger: ["blur", "change"],
		},
	],
	dateOfBirth: [
		{
			required: true,
			message: "Please select your date of birth",
			trigger: ["blur", "change"],
		},
	],
	addressLine1: [
		{
			required: true,
			message: "Please enter your address line 1",
			trigger: ["blur", "change"],
		},
	],
	city: [
		{
			required: true,
			message: "Please enter your city",
			trigger: ["blur", "change"],
		},
	],
	postalCode: [
		{
			required: true,
			message: "Please enter your postal code",
			trigger: ["blur", "change"],
		},
		{
			validator: validatePostalCode,
			trigger: ["blur", "change"],
		},
	],
	countryId: [
		{
			required: true,
			message: "Please select your country",
			trigger: ["blur", "change"],
		},
		{
			validator: validateCountry,
			trigger: ["blur", "change"],
		},
	],
	regionId: [
		{
			required: true,
			message: "Please select your region",
			trigger: ["blur", "change"],
		},
		{
			validator: validateRegion,
			trigger: ["blur", "change"],
		},
	],
	cultureId: [
		{
			required: true,
			message: "Please select your preferred language",
			trigger: ["blur", "change"],
		},
		{
			validator: validateCulture,
			trigger: ["blur", "change"],
		},
	],
});

const allowOnlyDigits = (event) => {
	const allowedKeys = [
		"Backspace",
		"Delete",
		"Tab",
		"ArrowLeft",
		"ArrowRight",
		"Home",
		"End",
	];

	if (allowedKeys.includes(event.key)) return;
	if (!/^\d$/.test(event.key)) {
		event.preventDefault();
	}
};

const blockEmptyInput = (event) => {
	const propertyName = event.target.name;

	if (event.key === " ") {
		if (profileForm.hasOwnProperty(propertyName)) {
			if (profileForm[propertyName].length === 0) {
				event.preventDefault();
			}
		}
	}
};

const disableMinorDoB = (time) => {
	const todayMinus18 = new Date();
	todayMinus18.setFullYear(todayMinus18.getFullYear() - 18);
	return time.getTime() > todayMinus18.getTime();
};

const selectProfilePicture = () => {
	const fileInput = document.querySelector(".upload-profile-picture");
	fileInput.click();
};

const uploadProfilePicture = async (event) => {
	try {
		uploading.value = true;
		const files = event.target.files;
		if (files && files[0]) {
			const file = files[0];
			const maxAllowedSizeInBytes = 2 * 1024 * 1024;
			if (file.size > maxAllowedSizeInBytes) {
				notifyError("Upload an image smaller than 2 MB.");
				return;
			}
			const formData = new FormData();
			formData.append("avatar", file);
			const response = await apiRequest(
				HttpMethods.POST,
				Endpoints.CHANGE_PROFILE_PICTURE,
				formData
			);
			if (response.status === 200) {
				const url = response.data.data.url;
				globalStore.setAvatarUrl(url);
				profileForm.avatarUrl = url;
				notifySuccess("Profile picture updated successfully.");
			} else {
				throw new this.$WebError("Unexpected response from server.", response);
			}
		}
	} catch (error) {
		notifyError("An error occurred while uploading the profile picture.");
		throw error;
	} finally {
		uploading.value = false;
	}
};

const editProfile = () => {
	Object.assign(originalProfileForm, profileForm);
	inEditMode.value = true;
};

const cancelEdit = () => {
	Object.assign(profileForm, originalProfileForm);
	inEditMode.value = false;
};

const saveProfile = async () => {
	let hasFormValidationError = true;

	try {
		await profileFormRef.value.validate();
		hasFormValidationError = false;
		saving.value = true;

		if (hasDifference(toRaw(originalProfileForm), toRaw(profileForm))) {
			const payload = getDifference(
				toRaw(originalProfileForm),
				toRaw(profileForm)
			);

			for (const key in payload) {
				if (typeof payload[key] === "string") {
					payload[key] = payload[key].trim();
				}
			}

			const response = await apiRequest(
				HttpMethods.PATCH,
				Endpoints.UPDATE_USER_PROFILE,
				payload
			);

			if (response.status === HttpStatus.OK) {
				notifySuccess("Profile updated successfully.");
				globalStore.setUserProfile(toRaw(profileForm));
			} else {
				throw new this.$WebError("Failed to update profile", response);
			}
		}

		Object.assign(originalProfileForm, profileForm);
		inEditMode.value = false;
	} catch (error) {
		if (hasFormValidationError) {
			return;
		}
		if (error.name !== "ElValidationError") {
			notifyError("An error occurred while updating your profile.");
		}
	} finally {
		saving.value = false;
	}
};

onMounted(async () => {
	const user = JSON.parse(JSON.stringify(globalStore.user));
	Object.assign(profileForm, {
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		phoneCode: user.profile.phoneCode,
		phoneNumber: user.profile.phoneNumber,
		gender: user.profile.gender,
		dateOfBirth: user.profile.dateOfBirth,
		addressLine1: user.profile.address.addressLine1,
		addressLine2: user.profile.address.addressLine2,
		city: user.profile.address.city,
		postalCode: user.profile.address.postalCode,
		countryId: user.profile.address.country.id,
		regionId: user.profile.address.region.id,
		cultureId: user.profile.culture.id,
		avatarUrl: globalStore.getAvatarUrl,
	});
	showForm.value = true;
});
</script>

<style lang="scss" scoped>
.page-container {
	width: 100vw;
	height: 100vh;
	background: #ffffff;

	.page-sub-container-wrapper {
		overflow-y: scroll;

		.page-sub-container {
			box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
				rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
			border-radius: 8px;

			.profile-banner {
				height: 130px;
				background: linear-gradient(
					90deg,
					#bcd8f4 0%,
					#dcd5df 50%,
					#fdf4d6 100%
				);
				border-top-left-radius: 8px;
				border-top-right-radius: 8px;
			}

			.profile-form-container {
				.profile-picture {
					height: 100px;
					width: 100px;
					border-radius: 50%;
					object-fit: cover;
					border: 1px solid black;
				}

				.profile-picture-edit {
					margin-left: -22px;
					margin-top: 66px;
					stroke: #111;
					color: #fff;
					stroke-width: 10px;
					cursor: pointer;
				}

				.el-form {
					::v-deep(.el-date-editor.disable-mode .el-input__icon) {
						transform: scale(1.3);
						color: var(--el-disabled-text-color) !important;
					}

					.svg-inline--fa.disable-mode {
						color: var(--el-disabled-text-color) !important;
					}
				}
			}

			.el-form-item {
				flex-direction: column;
				align-items: flex-start;
			}

			:deep(.el-form-item.w-100) {
				.el-form-item__content {
					width: 100%;
				}
			}
		}
	}
}
</style>
