<template>
  <div class="admin-keys-page">
    <header class="page-header">
      <h1>API Key Management</h1>
      <p>Generate and manage credentials for microservices and third-party integrations.</p>
    </header>

    <div class="content-card">
      <div class="controls">
        <div class="select-group">
          <label>Select Application</label>
          <select v-model="selectedClientId" @change="fetchKeys">
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }} ({{ client.appId }})
            </option>
          </select>
        </div>
        <button class="btn-primary" @click="showCreateModal = true">Generate New Key</button>
      </div>

      <div class="table-container">
        <table v-if="keys.length > 0">
          <thead>
            <tr>
              <th>Prefix</th>
              <th>Created At</th>
              <th>Expires At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="key in keys" :key="key.id">
              <td><code>{{ key.keyPrefix }}...</code></td>
              <td>{{ formatDate(key.createdAt) }}</td>
              <td>{{ formatDate(key.expiresAt) }}</td>
              <td>
                <span :class="['status-tag', key.isRevoked ? 'revoked' : 'active']">
                  {{ key.isRevoked ? 'Revoked' : 'Active' }}
                </span>
              </td>
              <td>
                <button v-if="!key.isRevoked" class="btn-outline-danger" @click="confirmRevoke(key)">Revoke</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <p>No active API keys found for this application.</p>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-card">
        <h2>Generate API Key</h2>
        <div class="form-group">
          <label>Expiration</label>
          <select v-model="createRequest.expiryMonths">
            <option :value="1">1 Month</option>
            <option :value="3">3 Months</option>
            <option :value="12">1 Year</option>
            <option :value="120">Never</option>
          </select>
        </div>
        
        <div v-if="generatedKey" class="secret-display">
          <p class="warning">Warning: Store this secret safely. You will not be able to see it again.</p>
          <div class="copy-box">
            <input type="text" readonly :value="generatedKey.appSecret" />
            <button @click="copyToClipboard(generatedKey.appSecret)">Copy</button>
          </div>
          <p class="meta">App ID: {{ generatedKey.appId }}</p>
        </div>

        <div class="modal-actions">
          <button v-if="!generatedKey" class="btn-text" @click="showCreateModal = false">Cancel</button>
          <button v-if="!generatedKey" class="btn-primary" @click="handleGenerate">Generate</button>
          <button v-if="generatedKey" class="btn-primary" @click="closeModal">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import adminService from '../services/admin';

const clients = ref([]);
const selectedClientId = ref(null);
const keys = ref([]);
const showCreateModal = ref(false);
const generatedKey = ref(null);

const createRequest = reactive({
  expiryMonths: 1
});

const fetchClients = async () => {
  try {
    clients.value = await adminService.getClients();
    if (clients.value.length > 0) {
      selectedClientId.value = clients.value[0].id;
      await fetchKeys();
    }
  } catch (err) {
    console.error('Failed to fetch clients', err);
  }
};

const fetchKeys = async () => {
  if (!selectedClientId.value) return;
  try {
    keys.value = await adminService.getClientKeys(selectedClientId.value);
  } catch (err) {
    console.error('Failed to fetch keys', err);
  }
};

const handleGenerate = async () => {
  try {
    const response = await adminService.generateKey({
      clientId: selectedClientId.value,
      expiryMonths: createRequest.expiryMonths
    });
    generatedKey.value = response;
    await fetchKeys();
  } catch (err) {
    alert('Failed to generate key');
  }
};

const confirmRevoke = async (key) => {
  if (confirm(`Are you sure you want to revoke key ${key.keyPrefix}...?`)) {
    try {
      await adminService.revokeKey(key.id);
      await fetchKeys();
    } catch (err) {
      alert('Failed to revoke key');
    }
  }
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
};

const closeModal = () => {
  showCreateModal.value = false;
  generatedKey.value = null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString();
};

onMounted(fetchClients);
</script>

<style scoped>
.admin-keys-page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.page-header { margin-bottom: 3rem; }
.page-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
.page-header p { color: #64748b; }

.content-card { background: white; border-radius: 1rem; border: 1px solid #e2e8f0; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.controls { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
.select-group { display: flex; flex-direction: column; gap: 0.5rem; }
select, input { padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; min-width: 250px; }

table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 1rem; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 0.875rem; text-transform: uppercase; }
td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }

.status-tag { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.status-tag.active { background: #dcfce7; color: #166534; }
.status-tag.revoked { background: #fee2e2; color: #991b1b; }

.btn-primary { background: #1a1a1a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
.btn-outline-danger { background: transparent; color: #dc2626; border: 1px solid #dc2626; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal-card { background: white; padding: 2.5rem; border-radius: 1.5rem; width: 90%; max-width: 500px; }
.secret-display { background: #fffbeb; border: 1px solid #fef3c7; padding: 1.5rem; border-radius: 1rem; margin: 1.5rem 0; }
.warning { color: #92400e; font-weight: 700; font-size: 0.875rem; margin-bottom: 1rem; }
.copy-box { display: flex; gap: 0.5rem; }
.copy-box input { flex: 1; }
.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
</style>
