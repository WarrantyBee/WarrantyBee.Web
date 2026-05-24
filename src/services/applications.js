import { apiRequest } from "./api";
import { HttpMethods, Endpoints } from "../constants";

const getApplications = async () => {
	return await apiRequest(HttpMethods.GET, Endpoints.APPLICATIONS);
};

const createApplication = async (data) => {
	return await apiRequest(HttpMethods.POST, Endpoints.APPLICATIONS, data);
};

const getApplicationKeys = async (appId) => {
	return await apiRequest(HttpMethods.GET, `${Endpoints.APPLICATIONS}/${appId}/keys`);
};

const generateApiKey = async (appId, expiryMonths = 1) => {
	return await apiRequest(HttpMethods.POST, `${Endpoints.APPLICATIONS}/${appId}/keys/generate`, { expiryMonths });
};

const revokeApiKey = async (keyId) => {
	return await apiRequest(HttpMethods.DELETE, `${Endpoints.APPLICATIONS}/keys/${keyId}`);
};

const updateKeyEndpoints = async (keyId, endpoints) => {
	return await apiRequest(HttpMethods.PUT, `${Endpoints.APPLICATIONS}/keys/${keyId}/endpoints`, { endpoints });
};

export {
	getApplications,
	createApplication,
	getApplicationKeys,
	generateApiKey,
	revokeApiKey,
	updateKeyEndpoints,
};
