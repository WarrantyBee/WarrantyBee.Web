import { apiRequest } from "./api";
import { HttpMethods, Endpoints } from "../constants";

const getVault = async () => {
	return await apiRequest(HttpMethods.GET, "/vault");
};

const registerAppliance = async (data) => {
	return await apiRequest(HttpMethods.POST, "/vault/register", data);
};

const getMyClaims = async () => {
	return await apiRequest(HttpMethods.GET, "/claims/my-claims");
};

const fileClaim = async (data) => {
	return await apiRequest(HttpMethods.POST, "/claims", data);
};

const getClaimDetails = async (id) => {
	return await apiRequest(HttpMethods.GET, `/claims/${id}`);
};

const getClaimMessages = async (id) => {
	return await apiRequest(HttpMethods.GET, `/claims/${id}/messages`);
};

const sendClaimMessage = async (id, message, attachmentUrl = null) => {
	return await apiRequest(HttpMethods.POST, `/claims/${id}/messages`, { message, attachmentUrl });
};

// B2B Endpoints
const getBusinessClaims = async () => {
	return await apiRequest(HttpMethods.GET, "/claims/b2b");
};

const updateClaimStatus = async (id, status, notes = null) => {
	return await apiRequest(HttpMethods.PATCH, `/claims/${id}/status`, { status, notes });
};

const getCatalogProducts = async () => {
	return await apiRequest(HttpMethods.GET, "/catalog/products");
};

const addCatalogProduct = async (data) => {
	return await apiRequest(HttpMethods.POST, "/catalog/products", data);
};

export {
	getVault,
	registerAppliance,
	getMyClaims,
	fileClaim,
	getClaimDetails,
	getClaimMessages,
	sendClaimMessage,
	getBusinessClaims,
	updateClaimStatus,
	getCatalogProducts,
	addCatalogProduct,
};
