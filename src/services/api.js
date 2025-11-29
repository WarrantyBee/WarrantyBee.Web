import axios from "axios";
import { getRecaptchaToken } from "./recaptcha";
import { HttpMethods, CacheKeys, Endpoints } from "../constants";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: import.meta.env.VITE_API_TIMEOUT,
	headers: {
		Authorization: `Bearer ${localStorage.getItem(CacheKeys.ACCESS_TOKEN)}`,
	},
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(CacheKeys.ACCESS_TOKEN);
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
		let recaptchaToken;
		const isFormData = data instanceof FormData;

		if (
			method === HttpMethods.POST ||
			method === HttpMethods.PUT ||
			method === HttpMethods.PATCH
		) {
			if (url !== Endpoints.ALIVE) {
				recaptchaToken = await getRecaptchaToken();
				if (isFormData) {
					data.append("captchaResponse", recaptchaToken);
				} else if (data) {
					data.captchaResponse = recaptchaToken;
				} else {
					data = { captchaResponse: recaptchaToken };
				}
			}
		}

		const response = await apiClient.request({ method, url, data, ...config });
		return response;
	} catch (error) {
		throw error;
	}
}

export default apiClient;
