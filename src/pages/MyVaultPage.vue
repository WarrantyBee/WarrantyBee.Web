<template>
	<div v-loading="loading">
		<div class="d-flex justify-content-between align-items-center mb-5">
			<div>
				<h2 class="m-0 fw-bold">My Appliance Vault</h2>
				<p class="text-muted m-0">Manage all your digital warranties in one place.</p>
			</div>
			<el-button type="primary" size="large" @click="showRegisterDialog = true">
				<el-icon class="me-2"><Plus /></el-icon> Add New Appliance
			</el-button>
		</div>

		<el-row :gutter="25">
			<el-col v-for="item in vault" :key="item.id" :xs="24" :sm="12" :md="8" class="mb-4">
				<el-card class="vault-card" shadow="hover">
					<div class="status-badge">
						<el-tag :type="getStatusType(item.status)" effect="dark">{{ item.status }}</el-tag>
					</div>
					<div class="product-img mb-3 d-flex align-items-center justify-content-center">
						<img v-if="item.productImageUrl" :src="item.productImageUrl" />
						<div v-else class="fs-1">📦</div>
					</div>
					<h3 class="fs-6 fw-bold mb-1 text-truncate">{{ item.productName }}</h3>
					<p class="small text-muted mb-4">Serial: {{ item.serialNumber }}</p>
					
					<div class="warranty-info p-3 rounded-3 bg-light mb-4">
						<div class="d-flex justify-content-between mb-2">
							<span class="small text-secondary">Purchased</span>
							<span class="small fw-bold">{{ formatDate(item.purchaseDate) }}</span>
						</div>
						<div class="d-flex justify-content-between">
							<span class="small text-secondary">Warranty Ends</span>
							<span class="small fw-bold">{{ formatDate(item.warrantyEndDate) }}</span>
						</div>
					</div>

					<div class="d-flex gap-2">
						<el-button class="flex-grow-1" type="primary" plain @click="handleFileClaim(item)">File Claim</el-button>
						<el-button circle @click="viewReceipt(item.receiptUrl)"><el-icon><Document /></el-icon></el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- Register Dialog -->
		<el-dialog v-model="showRegisterDialog" title="Register New Appliance" width="500px">
			<el-form :model="registerForm" label-position="top">
				<el-form-item label="Product SKU" required>
					<el-input v-model="registerForm.sku" placeholder="e.g. PHILIPS-HD9200" />
				</el-form-item>
				<el-form-item label="Serial Number" required>
					<el-input v-model="registerForm.serialNumber" placeholder="Look for a sticker on the back" />
				</el-form-item>
				<el-form-item label="Purchase Date" required>
					<el-date-picker v-model="registerForm.purchaseDate" type="date" class="w-100" />
				</el-form-item>
				<el-form-item label="Upload Receipt">
					<el-upload
						class="upload-demo"
						drag
						action="#"
						:auto-upload="false"
					>
						<el-icon class="el-icon--upload"><upload-filled /></el-icon>
						<div class="el-upload__text">Drop file here or <em>click to upload</em></div>
					</el-upload>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="showRegisterDialog = false">Cancel</el-button>
				<el-button type="primary" @click="handleRegister">Register</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Plus, Document, UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getVault, registerAppliance } from "../services/vault";

const loading = ref(false);
const vault = ref([]);
const showRegisterDialog = ref(false);
const registerForm = reactive({
	sku: "",
	serialNumber: "",
	purchaseDate: "",
	receiptUrl: null
});

const loadVault = async () => {
	loading.value = true;
	try {
		const res = await getVault();
		vault.value = res.data;
	} finally {
		loading.value = false;
	}
};

const handleRegister = async () => {
	try {
		await registerAppliance(registerForm);
		ElMessage.success("Appliance registered successfully!");
		showRegisterDialog.value = false;
		loadVault();
	} catch (e) {
		ElMessage.error("Registration failed. Please check SKU.");
	}
};

const getStatusType = (s) => s === 'ACTIVE' ? 'success' : 'warning';
const formatDate = (d) => new Date(d).toLocaleDateString();
const viewReceipt = (url) => window.open(url, '_blank');
const handleFileClaim = (item) => ElMessage.info("Claim flow starting for " + item.productName);

onMounted(loadVault);
</script>

<style lang="scss" scoped>
.vault-card {
	border-radius: 16px;
	position: relative;
	.status-badge {
		position: absolute;
		top: 15px;
		right: 15px;
	}
	.product-img {
		height: 120px;
		background: #fdfdfd;
		border-radius: 12px;
		img { max-height: 100%; object-fit: contain; }
	}
}
</style>
