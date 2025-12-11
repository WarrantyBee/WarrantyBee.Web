<template>
	<div
		class="d-flex justify-content-center align-items-center h-100 component-container"
	>
		<div class="component-sub-container w-100">
			<div class="d-flex justify-content-center">
				<h1 class="poppins-semibold">Sign up to WarrantyBee</h1>
			</div>
			<div class="d-flex justify-content-center mt-3">
				<h6 class="poppins-light fade-text" :class="{ show: fade }">
					{{ currentSubheading }}
				</h6>
			</div>
			<div
				class="d-flex justify-content-center flex-column form-container px-5 pt-4 pb-0"
			>
				<el-form
					v-if="activeStep === SignUpSteps.FIRST"
					ref="signUpFormDataPart1Ref"
					:model="signUpFormDataPart1"
					:rules="signUpFormDataPart1Rules"
					class="w-100"
				>
					<div class="d-flex gap-3">
						<el-form-item class="fb-50" prop="firstname">
							<el-input
								name="firstname"
								class="poppins-light"
								placeholder="Firstname"
								size="large"
								v-model="signUpFormDataPart1.firstname"
								@keydown="blockEmptyInput"
								@focus="suppressErrors()"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'user']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item class="fb-50" prop="lastname">
							<el-input
								name="lastname"
								class="poppins-light"
								placeholder="Lastname"
								size="large"
								v-model="signUpFormDataPart1.lastname"
								@keydown="blockEmptyInput"
								@focus="suppressErrors()"
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
					<div class="d-flex gap-3 mt-2">
						<el-form-item class="fb-50" prop="email">
							<el-input
								name="email"
								class="poppins-light"
								placeholder="Email"
								size="large"
								v-model="signUpFormDataPart1.email"
								@keydown="blockEmptyInput"
								@focus="suppressErrors()"
								:disabled="authProvider != AuthProviderCodes.NONE"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'envelope']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item id="phone-number" class="fb-50" prop="phoneNumber">
							<el-input
								name="phoneNumber"
								class="poppins-light"
								placeholder="Phone number"
								size="large"
								v-model="signUpFormDataPart1.phoneNumber"
								@keydown="allowOnlyDigits"
								@focus="suppressErrors()"
							>
								<template #prepend>
									<el-select
										v-model="signUpFormDataPart1.phoneCode"
										class="poppins-light"
										size="large"
										style="width: 120px"
										placeholder="Code"
									>
										<template #prefix>
											<font-awesome-icon
												:icon="['fas', 'phone']"
												class="fa-lg text-body"
											/>
										</template>
										<template #label>
											<span>{{ signUpFormDataPart1.phoneCode }}</span>
										</template>
										<el-option
											v-for="item in phoneCodes"
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
					<div class="d-flex gap-3 mt-2">
						<el-form-item class="fb-40" prop="gender">
							<el-select
								class="poppins-light"
								v-model="signUpFormDataPart1.gender"
								placeholder="Gender"
								size="large"
								@focus="suppressErrors()"
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
						<el-form-item class="fb-40" prop="dateOfBirth">
							<el-date-picker
								v-model="signUpFormDataPart1.dateOfBirth"
								class="poppins-light"
								type="date"
								placeholder="Date of birth"
								:disabled-date="disableMinorDoB"
								:default-value="leastAllowedDoB"
								size="large"
								@focus="suppressErrors()"
							/>
						</el-form-item>
						<el-form-item class="fb-20">
							<el-button
								class="w-100"
								type="primary"
								plain
								size="large"
								@click="goToStep(SignUpSteps.SECOND)"
							>
								NEXT
							</el-button>
						</el-form-item>
					</div>
				</el-form>
				<el-form
					v-if="activeStep === SignUpSteps.SECOND"
					ref="signUpFormDataPart2Ref"
					:model="signUpFormDataPart2"
					:rules="signUpFormDataPart2Rules"
					class="w-100"
				>
					<div class="d-flex gap-3 mt-2">
						<el-form-item class="fb-100" prop="addressLine1">
							<el-input
								name="addressLine1"
								v-model="signUpFormDataPart2.addressLine1"
								@keydown="blockEmptyInput"
								class="poppins-light"
								placeholder="Address line 1"
								size="large"
								:disabled="signingUp"
								@focus="suppressErrors()"
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
					<div class="d-flex gap-3 mt-2">
						<el-form-item class="fb-100" prop="addressLine2">
							<el-input
								name="addressLine2"
								v-model="signUpFormDataPart2.addressLine2"
								class="poppins-light"
								placeholder="Address line 2"
								size="large"
								@keydown="blockEmptyInput"
								:disabled="signingUp"
								@focus="suppressErrors()"
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
						<el-form-item class="fb-60" prop="city">
							<el-input
								name="city"
								v-model="signUpFormDataPart2.city"
								class="poppins-light"
								size="large"
								placeholder="City"
								@keydown="blockEmptyInput"
								:disabled="signingUp"
								@focus="suppressErrors()"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'city']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item class="fb-40" prop="postalCode">
							<el-input
								name="postalCode"
								v-model="signUpFormDataPart2.postalCode"
								@keydown="allowOnlyDigits"
								class="poppins-light"
								size="large"
								placeholder="Postal code"
								:disabled="signingUp"
								@focus="suppressErrors()"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'envelopes-bulk']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
					</div>
					<div class="d-flex gap-3 mt-2">
						<el-form-item class="fb-50" prop="countryId">
							<el-select
								name="countryId"
								v-model="signUpFormDataPart2.countryId"
								class="poppins-light"
								placeholder="Country"
								size="large"
								:disabled="signingUp"
								@focus="suppressErrors()"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'globe']"
										class="fa-lg text-body"
									/>
								</template>
								<el-option
									class="poppins-light"
									v-for="item in countries"
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
						<el-form-item class="fb-50" prop="regionId">
							<el-select
								name="regionId"
								v-model="signUpFormDataPart2.regionId"
								class="poppins-light"
								placeholder="Region"
								size="large"
								:disabled="!regions || regions.length === 0 || signingUp"
								@focus="suppressErrors()"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'location-dot']"
										class="fa-lg text-body"
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
					<div class="d-flex gap-3 mt-2 align-items-center">
						<div class="flex-grow-1"></div>
						<el-form-item class="mb-0">
							<el-button
								type="primary"
								plain
								size="large"
								@click="goToStep(SignUpSteps.FIRST)"
								>BACK</el-button
							>
						</el-form-item>
						<el-form-item class="mb-0">
							<el-button
								type="primary"
								plain
								size="large"
								@click="goToStep(SignUpSteps.THIRD)"
							>
								NEXT
							</el-button>
						</el-form-item>
					</div>
				</el-form>
				<el-form
					v-if="activeStep === SignUpSteps.THIRD"
					ref="signUpFormDataPart3Ref"
					:model="signUpFormDataPart3"
					:rules="signUpFormDataPart3Rules"
					class="w-100"
				>
					<div
						v-if="authProvider === AuthProviderCodes.NONE"
						class="d-flex gap-3"
					>
						<el-form-item class="fb-50" prop="password">
							<el-input
								name="password"
								type="password"
								v-model="signUpFormDataPart3.password"
								@keydown="blockEmptyInput"
								class="poppins-light"
								size="large"
								placeholder="Password"
								show-password
								clearable
								:disabled="signingUp"
								@focus="suppressErrors()"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'lock']"
										class="fa-lg text-body"
									/>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item class="fb-50" prop="confirmPassword">
							<el-input
								name="confirmPassword"
								v-model="signUpFormDataPart3.confirmPassword"
								@keydown="blockEmptyInput"
								type="password"
								class="poppins-light"
								size="large"
								placeholder="Confirm password"
								clearable
								:disabled="signingUp"
								@focus="suppressErrors()"
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
					<div class="d-flex gap-3 mt-2">
						<el-form-item class="fb-45" prop="cultureId">
							<el-select
								class="poppins-light"
								placeholder="Preferred language"
								size="large"
								v-model="signUpFormDataPart3.cultureId"
								@focus="suppressErrors()"
							>
								<template #prefix>
									<font-awesome-icon
										:icon="['fas', 'language']"
										class="fa-lg text-body"
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
					<div class="d-flex gap-3 mt-2">
						<el-form-item class="fb-100 mb-0">
							<input
								v-model="signUpFormDataPart3.acceptedPrivacyPolicy"
								class="compliance-checkbox"
								type="checkbox"
								style="transform: scale(1.3)"
							/>
							<span class="poppins-light pl-2">
								&nbsp;&nbsp;&nbsp;&nbsp;I agree to the
								<b
									><u
										@click="
											(showCompliance = true) &&
												(activeDocument = ComplianceDocuments.PRIVACY_POLICY)
										"
										>Privacy Policy</u
									></b
								>
								and data processing.
							</span>
						</el-form-item>
					</div>
					<div class="d-flex gap-3">
						<el-form-item class="fb-100">
							<input
								v-model="signUpFormDataPart3.acceptedTnC"
								class="compliance-checkbox"
								type="checkbox"
								style="transform: scale(1.3)"
							/>
							<span class="poppins-light pl-2">
								&nbsp;&nbsp;&nbsp;&nbsp;I agree to the
								<b>
									<u
										@click="
											(showCompliance = true) &&
												(activeDocument =
													ComplianceDocuments.TERMS_AND_CONDITIONS)
										"
										>Terms and Conditions</u
									> </b
								>.
							</span>
						</el-form-item>
					</div>
					<div class="d-flex gap-3 mt-2 align-items-center">
						<div class="flex-grow-1 text-danger poppins-light">
							<small v-if="errors.userAlreadyRegistered">
								Account already exists with this email
							</small>
						</div>
						<el-form-item class="mb-0">
							<el-button
								type="primary"
								plain
								size="large"
								@click="goToStep(SignUpSteps.SECOND)"
								:disabled="signingUp"
								>BACK</el-button
							>
						</el-form-item>
						<el-form-item class="mb-0">
							<el-button
								type="primary"
								plain
								size="large"
								@click="!signingUp && signUp()"
								:loading="signingUp"
								:disabled="
									signingUp ||
									!signUpFormDataPart3.acceptedPrivacyPolicy ||
									!signUpFormDataPart3.acceptedTnC
								"
							>
								SIGN UP
							</el-button>
						</el-form-item>
					</div>
				</el-form>
				<div class="d-flex align-items-center gap-2 mt-3">
					<div
						class="login-provider"
						@click="
							authProvider === AuthProviderCodes.NONE &&
								signUpThroughAuthProvider($event, AuthProviderCodes.FACEBOOK)
						"
					>
						<font-awesome-icon
							:icon="['fab', 'facebook-f']"
							class="fa-lg"
							:class="{
								selected: authProvider === AuthProviderCodes.FACEBOOK,
								'not-selected':
									authProvider !== AuthProviderCodes.FACEBOOK &&
									authProvider !== AuthProviderCodes.NONE,
							}"
						/>
					</div>
					<div class="login-provider">
						<font-awesome-icon
							:icon="['fab', 'google']"
							class="fa-lg"
							:class="{
								selected: authProvider === AuthProviderCodes.GOOGLE,
								'not-selected':
									authProvider !== AuthProviderCodes.GOOGLE &&
									authProvider !== AuthProviderCodes.NONE,
							}"
						/>
					</div>
					<div class="login-provider">
						<font-awesome-icon
							:icon="['fab', 'linkedin-in']"
							class="fa-lg"
							:class="{
								selected: authProvider === AuthProviderCodes.LINKEDIN,
								'not-selected':
									authProvider !== AuthProviderCodes.LINKEDIN &&
									authProvider !== AuthProviderCodes.NONE,
							}"
						/>
					</div>
					<div class="flex-grow-1"></div>
					<div>
						<p
							class="poppins-light mb-0 text-btn"
							@click="!signingUp && emit('sign-in')"
						>
							Already have an account ?
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<el-dialog v-model="showCompliance" width="800" :show-close="false">
		<template #footer>
			<el-button
				type="primary"
				size="large"
				@click="showCompliance = false"
				plain
			>
				CLOSE
			</el-button>
		</template>
		<iframe :src="activeDocument" class="w-100" style="height: 500px"></iframe>
	</el-dialog>
</template>

<script setup>
import { reactive, ref, defineEmits, onMounted, watch, computed } from "vue";
import { apiRequest } from "../../services/api.js";
import {
	HttpMethods,
	HttpStatus,
	ErrorCodes,
	Endpoints,
	Genders,
	OAuthCallbacks,
	ApplicationRoutes,
	AuthProviderCodes,
} from "../../constants.js";
import { useGlobalStore } from "../../stores/global/index.js";

const emit = defineEmits(["sign-in"]);
const facebook = reactive({});

const globalStore = useGlobalStore();
const errors = reactive({
	userAlreadyRegistered: false,
});

const authProvider = ref(AuthProviderCodes.NONE);
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

const SignUpSteps = Object.freeze({
	FIRST: 1,
	SECOND: 2,
	THIRD: 3,
});

const ComplianceDocuments = Object.freeze({
	NONE: null,
	TERMS_AND_CONDITIONS:
		"https://res.cloudinary.com/dovtpmzcw/image/upload/v1763406717/Terms_and_Conditions_fgflp4.pdf",
	PRIVACY_POLICY:
		"https://res.cloudinary.com/dovtpmzcw/image/upload/v1763406716/Privacy_Policy_om6vtq.pdf",
});

const activeDocument = ref(ComplianceDocuments.NONE);

const validateCulture = (rule, value, callback) => {
	if (signUpFormDataPart3.cultureId === null) {
		callback(new Error("Please select your preferred language"));
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

const validatePhoneNumber = (rule, value, callback) => {
	if (signUpFormDataPart1.phoneCode === null) {
		callback(new Error("Please select your country code"));
	} else if (value?.length !== 10) {
		callback(new Error("Phone number should be exactly 10 digits"));
	} else {
		callback();
	}
};

const validatePassword = (rule, value, callback) => {
	if (authProvider.value === AuthProviderCodes.NONE) {
		if (!value) {
			return callback(new Error("Password is required"));
		}

		const strongPasswordRegex =
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

		if (!strongPasswordRegex.test(value)) {
			return callback(new Error("Please specify a strong password"));
		}
	}

	callback();
};

const validateConfirmPassword = (rule, value, callback) => {
	if (authProvider.value === AuthProviderCodes.NONE) {
		if (!value) {
			return callback(new Error("Please confirm your password"));
		}

		if (value !== signUpFormDataPart3.password) {
			return callback(new Error("Passwords do not match"));
		}
	}

	callback();
};

const validatePostalCode = (rule, value, callback) => {
	if (value?.length !== 6) {
		callback(new Error("Postal code should be exactly 6 digits"));
	} else {
		callback();
	}
};

const validateCountry = (rule, value, callback) => {
	if (!countries.value.map((c) => c.id).includes(value)) {
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

const subheadings = [
	"Keep all your warranties in one place, anytime, anywhere",
	"Track your purchases effortlessly and stay worry-free",
	"Never lose a warranty again - it's all in your pocket",
	"Manage product lifespans with just a few clicks",
	"Your warranties, your control, always at hand",
	"Simplify your life - one warranty at a time",
	"From purchase to protection, we've got you covered",
	"All your guarantees under one roof, stress-free",
	"Stay organized, stay secure, stay smart",
	"Warranty management made simple and seamless",
];

const currentSubheading = ref(subheadings[0]);
const currentIndex = ref(0);
const fade = ref(true);
const cultures = computed(() => {
	let data = globalStore.cultures || [];
	let cultureCount = 0;
	data = [
		{
			label: "Others",
			options: data.map((cul) => {
				return {
					index: cultureCount++,
					...cul,
				};
			}),
		},
	];
	return data;
});
const regions = ref([]);
const countries = computed(() => {
	const data = globalStore.countries || [];
	return data;
});
const phoneCodes = computed(() => globalStore.phoneCodes || []);
const signingUp = ref(false);
const showCompliance = ref(false);
const activeStep = ref(SignUpSteps.FIRST);
const previouslySelectedCountryId = ref(null);

const signUpFormDataPart1Ref = ref();
const signUpFormDataPart2Ref = ref();
const signUpFormDataPart3Ref = ref();

const signUpFormDataPart1Rules = reactive({
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
});

const signUpFormDataPart2Rules = reactive({
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
});

const signUpFormDataPart3Rules = reactive({
	password: [
		{
			required: true,
			message: "Please enter your password",
			trigger: ["blur", "change"],
		},
		{
			validator: validatePassword,
			trigger: ["blur", "change"],
		},
	],
	confirmPassword: [
		{
			required: true,
			message: "Please confirm your password",
			trigger: ["blur", "change"],
		},
		{
			validator: validateConfirmPassword,
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

const signUpFormDataPart1 = reactive({
	providerUserId: null,
	firstname: "",
	lastname: "",
	email: "",
	phoneCode: null,
	phoneNumber: "",
	gender: null,
	dateOfBirth: null,
});

const signUpFormDataPart2 = reactive({
	addressLine1: "",
	addressLine2: "",
	city: "",
	postalCode: "",
	countryId: null,
	regionId: null,
});

const signUpFormDataPart3 = reactive({
	password: "",
	confirmPassword: "",
	cultureId: null,
	acceptedTnC: false,
	acceptedPrivacyPolicy: false,
});

watch(
	signUpFormDataPart2,
	(newValue, oldValue) => {
		if (newValue.countryId !== null) {
			const availableCultures =
				cultures.value.length > 1
					? cultures.value.flatMap((cul) => cul.options)
					: cultures.value[0].options;

			let recommendedCultures = availableCultures.filter(
				(cul) => cul.countryId === newValue.countryId
			);

			if (recommendedCultures.length === 0) {
				recommendedCultures = availableCultures.filter((cul) =>
					["en-US", "es-ES", "de-DE"].includes(cul.iso)
				);
			}

			if (cultures.value.length > 1) {
				cultures.value[0].options.forEach((cul) => {
					if (!recommendedCultures.includes(cul)) {
						cultures.value[1].options.push(cul);
					}
				});

				cultures.value[1].options = cultures.value[1].options.filter(
					(cul) => !recommendedCultures.includes(cul)
				);

				cultures.value[0] = {
					label: "Recommended",
					options: recommendedCultures,
				};
			} else {
				cultures.value[0].options = cultures.value[0].options.filter(
					(cul) => !recommendedCultures.includes(cul)
				);

				cultures.value.unshift({
					label: "Recommended",
					options: recommendedCultures,
				});
			}

			if (
				previouslySelectedCountryId.value !== null &&
				newValue.countryId !== previouslySelectedCountryId.value
			) {
				signUpFormDataPart2.regionId = null;
			}

			regions.value = countries.value.find(
				(c) => c.id === newValue.countryId
			)?.regions;

			previouslySelectedCountryId.value = newValue.countryId;
		}
	},
	{ deep: true }
);

const goToStep = async (step) => {
	try {
		if (activeStep.value === SignUpSteps.FIRST && step === SignUpSteps.SECOND) {
			await signUpFormDataPart1Ref.value.validate();
		}
		if (activeStep.value === SignUpSteps.SECOND && step === SignUpSteps.THIRD) {
			await signUpFormDataPart2Ref.value.validate();
		}
		activeStep.value = step;
	} catch (error) {
		throw error;
	}
};

const disableMinorDoB = (time) => {
	const todayMinus18 = new Date();
	todayMinus18.setFullYear(todayMinus18.getFullYear() - 18);
	return time.getTime() > todayMinus18.getTime();
};

const getLeastAllowedDoB = () => {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 18);
	return date;
};

const leastAllowedDoB = getLeastAllowedDoB();

const blockEmptyInput = (event) => {
	const propertyName = event.target.name;
	if (
		event.key === " " &&
		(propertyName === "password" || propertyName === "confirmPassword")
	) {
		event.preventDefault();
	} else if (
		event.key === " " &&
		signUpFormDataPart1.hasOwnProperty(propertyName)
	) {
		if (signUpFormDataPart1[propertyName].trim().length === 0) {
			event.preventDefault();
		}
	} else if (
		event.key === " " &&
		signUpFormDataPart2.hasOwnProperty(propertyName)
	) {
		if (signUpFormDataPart2[propertyName].trim().length === 0) {
			event.preventDefault();
		}
	}
};

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

const suppressErrors = () => {
	errors.userAlreadyRegistered = false;
};

const signUp = async () => {
	if (
		!signUpFormDataPart3.acceptedPrivacyPolicy ||
		!signUpFormDataPart3.acceptedTnC
	)
		return;
	let formValidationError = true;
	try {
		await signUpFormDataPart3Ref.value.validate();
		formValidationError = false;
		signingUp.value = true;
		suppressErrors();
		const requestBody = {
			firstname: signUpFormDataPart1.firstname?.trim(),
			lastname: signUpFormDataPart1.lastname?.trim(),
			email: signUpFormDataPart1.email?.trim(),
			phoneNumber: signUpFormDataPart1.phoneNumber?.trim(),
			cultureId: signUpFormDataPart3.cultureId,
			gender: signUpFormDataPart1.gender,
			dateOfBirth: signUpFormDataPart1.dateOfBirth,
			password: signUpFormDataPart3.password?.trim(),
			addressLine1: signUpFormDataPart2.addressLine1?.trim(),
			addressLine2: signUpFormDataPart2.addressLine2?.trim(),
			city: signUpFormDataPart2.city?.trim(),
			postalCode: signUpFormDataPart2.postalCode?.trim(),
			countryId: signUpFormDataPart2.countryId,
			regionId: signUpFormDataPart2.regionId,
			avatarUrl: "",
			phoneCode: signUpFormDataPart1.phoneCode?.trim(),
			hasAcceptedTermsAndConditions: signUpFormDataPart3.acceptedTnC,
			hasAcceptedPrivacyPolicy: signUpFormDataPart3.acceptedPrivacyPolicy,
			provider:
				authProvider.value === AuthProviderCodes.NONE
					? AuthProviderCodes.INTERNAL
					: authProvider.value,
			providerUserId: signUpFormDataPart1.providerUserId,
		};
		const response = await apiRequest(
			HttpMethods.POST,
			Endpoints.SIGN_UP,
			requestBody
		);
		if (response.status === HttpStatus.OK) {
			notifySuccess(
				"Your account was created successfully. You can now sign in to your account."
			);
			emit("sign-in");
		} else {
			throw new this.$WebError(
				"Unexpected error occurred while signing up.",
				response
			);
		}
	} catch (error) {
		if (formValidationError) return;

		if (error?.response?.status === HttpStatus.CONFLICT) {
			if (
				error.response.data?.error?.code === ErrorCodes.USER_ALREADY_REGISTERED
			) {
				errors.userAlreadyRegistered = true;
				return;
			}
		}

		notifyError("Oops! something went wrong. Please try again later.");
		throw error;
	} finally {
		signingUp.value = false;
	}
};

const signUpThroughAuthProvider = async (event, provider) => {
	const redirect = {
		action: OAuthCallbacks.SIGN_UP,
		redirectPending: true,
		handshakePending: true,
		redirectTo: ApplicationRoutes.OAUTH_CALLBACK,
		handshakeWith: ApplicationRoutes.AUTH,
	};
	globalStore.setRedirection(redirect);
	authProvider.value = provider;
	if (provider === AuthProviderCodes.FACEBOOK) {
		window.location.href = Endpoints.FB_SIGN_UP_REDIRECT_URL;
	}
};

const handshakeWithRedirectionSource = () => {
	if (
		globalStore.redirect.signup.handshakePending &&
		globalStore.redirect.signup.handshakeWith == ApplicationRoutes.AUTH
	) {
		globalStore.setRedirection({ action: OAuthCallbacks.SIGN_UP });
		authProvider.value = globalStore.buffer.authProviderResponse.provider;
		signUpFormDataPart1.providerUserId =
			globalStore.buffer.authProviderResponse.id;
		signUpFormDataPart1.email = globalStore.buffer.authProviderResponse.email;
		signUpFormDataPart1.firstname =
			globalStore.buffer.authProviderResponse.firstname;
		signUpFormDataPart1.lastname =
			globalStore.buffer.authProviderResponse.lastname;
		globalStore.setBuffer({ ...globalStore.buffer, authProviderResponse: {} });
	}
};

onMounted(() => {
	setInterval(() => {
		fade.value = false;
		setTimeout(() => {
			currentIndex.value = (currentIndex.value + 1) % subheadings.length;
			currentSubheading.value = subheadings[currentIndex.value];
			fade.value = true;
		}, 500);
	}, 4000);
	handshakeWithRedirectionSource();
});
</script>

<style lang="scss" scoped>
.component-container {
	padding: 60px 40px;

	.component-sub-container {
		.fade-text {
			transition: opacity 0.5s ease-in-out;
			opacity: 0;
		}

		.fade-text.show {
			opacity: 1;
		}

		::v-deep(.el-date-editor .el-input__icon) {
			transform: scale(1.3);
			color: #000000;
		}

		::v-deep(#phone-number .el-input-group__prepend) {
			background-color: #ffffff;
		}

		.login-provider {
			cursor: pointer;
			border: 1px solid #000000;
			border-radius: 8px;
			padding: 5px 10px;
		}

		.login-provider:not(:has(.selector, .not-selected)):hover,
		.login-provider:has(.selected) {
			background: #000000;
			color: #ffffff;
		}

		.login-provider:has(.selected),
		.login-provider:has(.not-selected) {
			cursor: not-allowed;
		}

		.text-btn {
			cursor: pointer;
			font-size: 14px;
			text-decoration: underline;
			text-underline-offset: 10px;
		}

		.compliance-checkbox {
			cursor: pointer;
		}

		.compliance-checkbox + span {
			u {
				cursor: pointer;
			}
		}
	}
}
</style>
