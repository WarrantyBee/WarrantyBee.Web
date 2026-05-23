import api from './api';

/**
 * Service for administrative operations.
 */
export default {
    /**
     * Retrieves all API clients.
     * @returns {Promise<Array>}
     */
    async getClients() {
        const response = await api.get('/admin/keys/clients');
        return response.data.data;
    },

    /**
     * Retrieves all API keys for a client.
     * @param {number} clientId 
     * @returns {Promise<Array>}
     */
    async getClientKeys(clientId) {
        const response = await api.get(`/admin/keys/clients/${clientId}`);
        return response.data.data;
    },

    /**
     * Generates a new API key.
     * @param {Object} request { clientId, expiryMonths }
     * @returns {Promise<Object>}
     */
    async generateKey(request) {
        const response = await api.post('/admin/keys/generate', request);
        return response.data.data;
    },

    /**
     * Revokes an API key.
     * @param {number} keyId 
     */
    async revokeKey(keyId) {
        await api.delete(`/admin/keys/${keyId}`);
    }
};
