<template>
	<div v-loading="loading">
		<div class="d-flex justify-content-between align-items-center mb-5">
			<h2 class="m-0 fw-bold">Claims Triage Inbox</h2>
			<div class="d-flex gap-2">
				<el-input v-model="search" placeholder="Search Claim # or Customer" style="width: 300px" clearable />
				<el-button @click="loadClaims">Refresh</el-button>
			</div>
		</div>

		<el-table :data="filteredClaims" style="width: 100%; border-radius: 12px; overflow: hidden" shadow="always">
			<el-table-column prop="claimNumber" label="Claim Number" width="200" />
			<el-table-column prop="productName" label="Appliance" />
			<el-table-column prop="customerName" label="Customer" width="200" />
			<el-table-column label="Status" width="150">
				<template #default="{ row }">
					<el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="right">
				<template #default="{ row }">
					<el-button type="primary" @click="triageClaim(row)">Review</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- Triage Detail Drawer -->
		<el-drawer v-model="showTriage" title="Claim Triage" size="600px">
			<div v-if="selectedClaim" class="p-4">
				<div class="mb-5 d-flex justify-content-between align-items-start">
					<div>
						<h3 class="m-0 fs-4 fw-bold">{{ selectedClaim.claimNumber }}</h3>
						<p class="text-muted">{{ selectedClaim.productName }}</p>
					</div>
					<el-tag :type="getStatusType(selectedClaim.status)" size="large">{{ selectedClaim.status }}</el-tag>
				</div>

				<div class="mb-4">
					<h4 class="small fw-bold text-uppercase text-secondary mb-2">Issue Description</h4>
					<div class="p-3 bg-light rounded-3">
						<p class="m-0 mb-2"><b>Category:</b> {{ selectedClaim.issueCategory }}</p>
						<p class="m-0">{{ selectedClaim.issueDescription }}</p>
					</div>
				</div>

				<div class="mb-5">
					<h4 class="small fw-bold text-uppercase text-secondary mb-2">Proof of Defect</h4>
					<div v-if="selectedClaim.defectMediaUrl" class="media-preview rounded-3 border d-flex align-items-center justify-content-center bg-dark">
						<img :src="selectedClaim.defectMediaUrl" class="mw-100" />
					</div>
					<el-empty v-else description="No media attached" :image-size="60" />
				</div>

				<div class="action-section p-4 bg-white border rounded-4 shadow-sm">
					<h4 class="small fw-bold mb-3">Triage Decision</h4>
					<el-form label-position="top">
						<el-form-item label="Internal / Resolution Notes">
							<el-input v-model="triageNotes" type="textarea" rows="4" placeholder="Explain the reasoning for approval or rejection..." />
						</el-form-item>
						<div class="d-flex gap-3 mt-4">
							<el-button type="success" class="flex-grow-1" size="large" @click="handleUpdateStatus('APPROVED')">Approve Claim</el-button>
							<el-button type="danger" plain class="flex-grow-1" size="large" @click="handleUpdateStatus('REJECTED')">Reject</el-button>
						</div>
					</el-form>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { getBusinessClaims, updateClaimStatus } from "../services/vault";

const loading = ref(false);
const claims = ref([]);
const search = ref("");
const showTriage = ref(false);
const selectedClaim = ref(null);
const triageNotes = ref("");

const filteredClaims = computed(() => {
	if (!search.value) return claims.value;
	const s = search.value.toLowerCase();
	return claims.value.filter(c => 
		c.claimNumber.toLowerCase().includes(s) || 
		c.customerName.toLowerCase().includes(s) ||
		c.productName.toLowerCase().includes(s)
	);
});

const loadClaims = async () => {
	loading.value = true;
	try {
		const res = await getBusinessClaims();
		claims.value = res.data;
	} finally {
		loading.value = false;
	}
};

const triageClaim = (claim) => {
	selectedClaim.value = claim;
	triageNotes.value = claim.resolutionNotes || "";
	showTriage.value = true;
};

const handleUpdateStatus = async (status) => {
	try {
		await updateClaimStatus(selectedClaim.value.id, status, triageNotes.value);
		ElMessage.success(`Claim ${status} successfully`);
		showTriage.value = false;
		loadClaims();
	} catch (e) {
		ElMessage.error("Failed to update claim status");
	}
};

const getStatusType = (s) => {
	switch (s) {
		case 'SUBMITTED': return 'info';
		case 'APPROVED': return 'success';
		case 'REJECTED': return 'danger';
		case 'RESOLVED': return 'success';
		default: return '';
	}
};

onMounted(loadClaims);
</script>

<style lang="scss" scoped>
.media-preview {
	height: 250px;
	overflow: hidden;
}
</style>
