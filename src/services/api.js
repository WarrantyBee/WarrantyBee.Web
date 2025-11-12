import axios from "axios";
import { getRecaptchaToken } from "./recaptcha";
import { HttpMethods } from "../constants";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
		}

		return Promise.reject(error);
	}
);

export async function apiRequest(method, url, data = {}, config = {}) {
	try {
		if (method === HttpMethods.POST || method === HttpMethods.PUT) {
			const recaptchaToken = await getRecaptchaToken();
			if (data) {
				data.captchaResponse = recaptchaToken;
			} else {
				data = { captchaResponse: recaptchaToken };
			}
		}

		const response = await apiClient.request({ method, url, data, ...config });
		return response.data;
	} catch (error) {
		throw error;
	}
}

export default apiClient;
