<template>
	<div class="page-container" v-loading="loading">
		<div class="menubar d-flex align-items-center px-4">
			<div class="d-flex align-items-center gap-2" style="cursor: pointer" @click="router.push('/dashboard')">
				<el-icon :size="20"><ArrowLeft /></el-icon>
				<h2 class="m-0 fs-5">Applications</h2>
			</div>
			<div class="flex-grow-1"></div>
			<el-button type="primary" @click="showCreateDialog = true">Register Application</el-button>
		</div>

		<div class="content p-4">
			<el-empty v-if="!applications.length && !loading" description="No applications registered yet" />

			<el-row :gutter="20">
				<el-col v-for="app in applications" :key="app.id" :xs="24" :sm="12" :md="8" :lg="8" class="mb-4">
					<el-card class="app-card" shadow="hover">
						<template #header>
							<div class="d-flex justify-content-between align-items-center">
								<span class="fw-bold">{{ app.name }}</span>
								<el-tag :type="getAppTypeTag(app.appType)">{{ getAppTypeName(app.appType) }}</el-tag>
							</div>
						</template>
						<p class="text-muted small mb-3">{{ app.description || 'No description provided' }}</p>
						<div class="mb-2">
							<small class="text-uppercase fw-bold text-secondary">App ID</small>
							<div class="d-flex align-items-center gap-2">
								<code class="bg-light p-1 rounded">{{ app.appId }}</code>
								<el-button link @click="copyToClipboard(app.appId)"><el-icon><CopyDocument /></el-icon></el-button>
							</div>
						</div>
						<div class="d-flex justify-content-end gap-2 mt-3">
							<el-button type="primary" plain @click="viewKeys(app)">Manage Keys</el-button>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>

		<!-- Create App Dialog -->
		<el-dialog v-model="showCreateDialog" title="Register New Application" width="500px">
			<el-form :model="createForm" label-position="top">
				<el-form-item label="Application Name" required>
					<el-input v-model="createForm.name" placeholder="e.g. My External Integration" />
				</el-form-item>
				<el-form-item label="Description">
					<el-input v-model="createForm.description" type="textarea" rows="3" />
				</el-form-item>
				<el-form-item label="Application Type">
					<el-select v-model="createForm.appType" class="w-100">
						<el-option :value="1" label="Microservice" />
						<el-option :value="2" label="API" />
						<el-option :value="3" label="External Application" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="showCreateDialog = false">Cancel</el-button>
				<el-button type="primary" :loading="creating" @click="handleCreateApp">Register</el-button>
			</template>
		</el-dialog>

		<!-- Manage Keys Drawer -->
		<el-drawer v-model="showKeysDrawer" :title="'Manage Keys: ' + (selectedApp?.name || '')" size="600px">
			<div class="p-3">
				<div class="d-flex justify-content-between align-items-center mb-4">
					<h3 class="m-0">API Keys</h3>
					<el-button type="success" @click="handleGenerateKey">Generate New Key</el-button>
				</div>

				<el-table :data="keys" style="width: 100%">
					<el-table-column label="Prefix" width="120">
						<template #default="{ row }">
							<code>{{ row.keyPrefix }}...</code>
						</template>
					</el-table-column>
					<el-table-column label="Expires" width="150">
						<template #default="{ row }">
							{{ new Date(row.expiresAt).toLocaleDateString() }}
						</template>
					</el-table-column>
					<el-table-column label="Status">
						<template #default="{ row }">
							<el-tag :type="row.isRevoked ? 'danger' : 'success'">
								{{ row.isRevoked ? 'Revoked' : 'Active' }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="right" width="150">
						<template #default="{ row }">
							<el-button v-if="!row.isRevoked" type="danger" link @click="handleRevokeKey(row.id)">Revoke</el-button>
							<el-button type="primary" link @click="showEndpointsDialog(row)">Endpoints</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-drawer>

		<!-- New Key Credentials Dialog (Show once) -->
		<el-dialog v-model="showCredentialsDialog" title="API Key Generated Successfully" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-alert title="Security Warning" type="warning" description="This is the only time these credentials will be shown. Please copy and store them securely." show-icon :closable="false" class="mb-4" />
			
			<div class="mb-3">
				<label class="fw-bold d-block mb-1">Application ID</label>
				<el-input v-model="newCredentials.appId" readonly>
					<template #append>
						<el-button @click="copyToClipboard(newCredentials.appId)"><el-icon><CopyDocument /></el-icon></el-button>
					</template>
				</el-input>
			</div>

			<div class="mb-3">
				<label class="fw-bold d-block mb-1">Application Secret</label>
				<el-input v-model="newCredentials.appSecret" readonly show-password>
					<template #append>
						<el-button @click="copyToClipboard(newCredentials.appSecret)"><el-icon><CopyDocument /></el-icon></el-button>
					</template>
				</el-input>
			</div>

			<div class="mb-3">
				<label class="fw-bold d-block mb-1">API Key</label>
				<el-input v-model="newCredentials.apiKey" readonly show-password>
					<template #append>
						<el-button @click="copyToClipboard(newCredentials.apiKey)"><el-icon><CopyDocument /></el-icon></el-button>
					</template>
				</el-input>
			</div>

			<template #footer>
				<el-button type="primary" @click="showCredentialsDialog = false">I have saved these</el-button>
			</template>
		</el-dialog>

		<!-- Endpoints Mapping Dialog -->
		<el-dialog v-model="showEndpointMappingDialog" title="Map Key to Endpoints" width="500px">
			<p class="text-muted small mb-3">Define which API paths this key is allowed to access. Use '*' as a wildcard (e.g., /api/events/*).</p>
			
			<div v-for="(path, index) in endpointPaths" :key="index" class="d-flex gap-2 mb-2">
				<el-input v-model="endpointPaths[index]" placeholder="/api/..." />
				<el-button type="danger" circle @click="endpointPaths.splice(index, 1)"><el-icon><Delete /></el-icon></el-button>
			</div>
			<el-button class="mt-2 w-100" @click="endpointPaths.push('')">+ Add Path</el-button>

			<template #footer>
				<el-button @click="showEndpointMappingDialog = false">Cancel</el-button>
				<el-button type="primary" :loading="updatingEndpoints" @click="handleUpdateEndpoints">Save Mappings</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { CopyDocument, ArrowLeft, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { 
	getApplications, 
	createApplication, 
	getApplicationKeys, 
	generateApiKey, 
	revokeApiKey, 
	updateKeyEndpoints 
} from "../services/applications";

const router = useRouter();
const loading = ref(false);
const creating = ref(false);
const applications = ref([]);
const showCreateDialog = ref(false);
const createForm = reactive({
	name: "",
	description: "",
	appType: 1
});

const showKeysDrawer = ref(false);
const selectedApp = ref(null);
const keys = ref([]);

const showCredentialsDialog = ref(false);
const newCredentials = reactive({
	appId: "",
	appSecret: "",
	apiKey: ""
});

const showEndpointMappingDialog = ref(false);
const selectedKeyId = ref(null);
const endpointPaths = ref([]);
const updatingEndpoints = ref(false);

const loadApplications = async () => {
	loading.value = true;
	try {
		const response = await getApplications();
		applications.value = response.data;
	} catch (error) {
		ElMessage.error("Failed to load applications");
	} finally {
		loading.value = false;
	}
};

const handleCreateApp = async () => {
	if (!createForm.name) return ElMessage.warning("Name is required");
	creating.value = true;
	try {
		await createApplication(createForm);
		ElMessage.success("Application registered successfully");
		showCreateDialog.value = false;
		createForm.name = "";
		createForm.description = "";
		await loadApplications();
	} catch (error) {
		ElMessage.error("Failed to create application");
	} finally {
		creating.value = false;
	}
};

const viewKeys = async (app) => {
	selectedApp.value = app;
	loading.value = true;
	try {
		const response = await getApplicationKeys(app.id);
		keys.value = response.data;
		showKeysDrawer.value = true;
	} catch (error) {
		ElMessage.error("Failed to load keys");
	} finally {
		loading.value = false;
	}
};

const handleGenerateKey = async () => {
	if (!selectedApp.value) return;
	try {
		const response = await generateApiKey(selectedApp.value.id);
		newCredentials.appId = response.data.appId;
		newCredentials.appSecret = response.data.appSecret;
		newCredentials.apiKey = response.data.apiKey;
		
		showCredentialsDialog.value = true;
		// Reload keys
		const keysRes = await getApplicationKeys(selectedApp.value.id);
		keys.value = keysRes.data;
	} catch (error) {
		ElMessage.error("Failed to generate API Key");
	}
};

const handleRevokeKey = async (keyId) => {
	try {
		await ElMessageBox.confirm("Are you sure you want to revoke this key? This action cannot be undone.", "Revoke API Key", {
			type: "warning",
			confirmButtonText: "Revoke",
			confirmButtonClass: "el-button--danger"
		});
		
		await revokeApiKey(keyId);
		ElMessage.success("Key revoked");
		const response = await getApplicationKeys(selectedApp.value.id);
		keys.value = response.data;
	} catch (error) {
		if (error !== 'cancel') ElMessage.error("Failed to revoke key");
	}
};

const showEndpointsDialog = (key) => {
	selectedKeyId.value = key.id;
	endpointPaths.value = [...(key.allowedEndpoints || [])];
	if (!endpointPaths.value.length) endpointPaths.value = [''];
	showEndpointMappingDialog.value = true;
};

const handleUpdateEndpoints = async () => {
	updatingEndpoints.value = true;
	try {
		const filtered = endpointPaths.value.filter(p => !!p.trim());
		await updateKeyEndpoints(selectedKeyId.value, filtered);
		ElMessage.success("Endpoints updated");
		showEndpointMappingDialog.value = false;
		// Refresh keys
		const response = await getApplicationKeys(selectedApp.value.id);
		keys.value = response.data;
	} catch (error) {
		ElMessage.error("Failed to update endpoints");
	} finally {
		updatingEndpoints.value = false;
	}
};

const getAppTypeName = (type) => {
	switch (type) {
		case 1: return "Microservice";
		case 2: return "API";
		case 3: return "External Application";
		default: return "Unknown";
	}
};

const getAppTypeTag = (type) => {
	switch (type) {
		case 1: return "info";
		case 2: return "warning";
		case 3: return "success";
		default: return "info";
	}
};

const copyToClipboard = (text) => {
	navigator.clipboard.writeText(text);
	ElMessage.success("Copied to clipboard");
};

onMounted(loadApplications);
</script>

<style lang="scss" scoped>
.page-container {
	width: 100vw;
	min-height: 100vh;
	background: #f8f9fa;

	.menubar {
		height: 64px;
		background: #ffffff;
		border-bottom: 1px solid #dee2e6;
	}

	.content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.app-card {
		height: 100%;
		border-radius: 12px;
		
		:deep(.el-card__header) {
			border-bottom: 1px solid #f1f2f3;
			padding: 15px 20px;
		}
	}
}
</style>
