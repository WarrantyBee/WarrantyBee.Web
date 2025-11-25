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
								<img :src="globalStore.getAvatarUrl" class="profile-picture" />
								<font-awesome-icon
									:icon="['fas', 'camera']"
									class="profile-picture-edit fa-lg"
								/>
							</div>
							<div class="d-flex flex-column">
								<h3 class="poppins-semibold">
									{{ globalStore.getUserFullName }}
								</h3>
								<p class="text-muted mb-0 poppins-light">
									{{ globalStore.getUserEmail }}
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
									@click="inEditMode = false"
								>
									SAVE
								</el-button>
							</div>
							<div v-if="inEditMode" class="d-flex">
								<el-button
									class="poppins-light"
									size="large"
									@click="inEditMode = false"
									plain
								>
									CANCEL
								</el-button>
							</div>
							<div v-if="!inEditMode" class="d-flex">
								<el-button
									class="poppins-light"
									type="primary"
									size="large"
									@click="inEditMode = true"
								>
									EDIT
								</el-button>
							</div>
						</div>
					</div>
					<div class="d-flex flex-column profile-form-row mt-4">
						<el-form>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="First Name">
										<el-input
											v-model="user.firstname"
											size="large"
											disabled
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="Last Name">
										<el-input
											v-model="user.lastname"
											size="large"
											disabled
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-50">
									<el-form-item class="w-100" label="Address Line 1">
										<el-input
											v-model="user.profile.address.addressLine1"
											size="large"
											:disabled="!inEditMode"
										></el-input>
									</el-form-item>
								</div>
							</div>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="Email">
										<el-input
											v-model="user.email"
											size="large"
											disabled
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="Phone Number">
										<el-input
											v-model="user.profile.phoneNumber"
											size="large"
											:disabled="!inEditMode"
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-50">
									<el-form-item class="w-100" label="Address Line 2">
										<el-input
											v-model="user.profile.address.addressLine2"
											size="large"
											:disabled="!inEditMode"
										></el-input>
									</el-form-item>
								</div>
							</div>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="Postal Code">
										<el-input
											v-model="user.email"
											size="large"
											disabled
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="City">
										<el-input
											v-model="user.profile.phoneNumber"
											size="large"
											:disabled="!inEditMode"
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex gap-5 fb-50">
									<div class="d-flex fb-50">
										<el-form-item class="w-100" label="Region">
											<el-input
												v-model="user.profile.address.addressLine2"
												size="large"
												:disabled="!inEditMode"
											></el-input>
										</el-form-item>
									</div>
									<div class="d-flex fb-50">
										<el-form-item class="w-100" label="Country">
											<el-input
												v-model="user.profile.address.addressLine2"
												size="large"
												:disabled="!inEditMode"
											></el-input>
										</el-form-item>
									</div>
								</div>
							</div>
							<div class="d-flex gap-5">
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="Date Of Birth">
										<el-input
											v-model="user.email"
											size="large"
											disabled
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-25">
									<el-form-item class="w-100" label="Gender">
										<el-input
											v-model="user.profile.phoneNumber"
											size="large"
											:disabled="!inEditMode"
										></el-input>
									</el-form-item>
								</div>
								<div class="d-flex fb-50"></div>
							</div>
						</el-form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import MenuBar from "../components/MenuBar.vue";
import { useGlobalStore } from "../stores/global";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const inEditMode = ref(false);
const { user } = storeToRefs(globalStore);
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
