<template>
	<div v-loading="loading">
		<h2 class="mb-5 fw-bold">My Claims Tracker</h2>

		<el-empty v-if="!claims.length && !loading" description="You haven't filed any claims yet." />

		<el-table v-else :data="claims" style="width: 100%; border-radius: 12px; overflow: hidden" border>
			<el-table-column prop="claimNumber" label="Claim #" width="180">
				<template #default="{ row }">
					<span class="fw-bold text-primary">{{ row.claimNumber }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="productName" label="Product" />
			<el-table-column label="Submitted On" width="150">
				<template #default="{ row }">
					{{ formatDate(row.createdAt) }}
				</template>
			</el-table-column>
			<el-table-column label="Status" width="150">
				<template #default="{ row }">
					<el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="right">
				<template #default="{ row }">
					<el-button type="primary" link @click="viewClaimDetails(row)">View Details</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- Claim Details Drawer -->
		<el-drawer v-model="showDetails" title="Claim Resolution Timeline" size="500px">
			<div v-if="selectedClaim" class="p-3">
				<div class="mb-4">
					<h3 class="m-0 fs-5 fw-bold">{{ selectedClaim.productName }}</h3>
					<small class="text-muted">{{ selectedClaim.claimNumber }}</small>
				</div>

				<el-timeline>
					<el-timeline-item
						v-for="(activity, index) in timeline"
						:key="index"
						:type="activity.type"
						:timestamp="activity.timestamp"
						size="large"
					>
						{{ activity.content }}
					</el-timeline-item>
				</el-timeline>
				
				<div class="mt-5 pt-4 border-top">
					<h4 class="small fw-bold text-uppercase text-secondary mb-3">Resolution Notes</h4>
					<div class="p-3 bg-light rounded-3 small">
						{{ selectedClaim.resolutionNotes || 'Our team is currently reviewing your claim. We will update you shortly.' }}
					</div>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getMyClaims } from "../services/vault";

const loading = ref(false);
const claims = ref([]);
const showDetails = ref(false);
const selectedClaim = ref(null);

const timeline = [
	{ content: 'Claim Submitted', timestamp: '2026-05-24', type: 'primary' },
	{ content: 'In Review by Brand', timestamp: '2026-05-24', type: 'info' },
	{ content: 'Technician Dispatched', timestamp: 'Pending', type: '' }
];

const loadClaims = async () => {
	loading.value = true;
	try {
		const res = await getMyClaims();
		claims.value = res.data;
	} finally {
		loading.value = false;
	}
};

const viewClaimDetails = (claim) => {
	selectedClaim.value = claim;
	showDetails.value = true;
};

const formatDate = (d) => new Date(d).toLocaleDateString();
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
