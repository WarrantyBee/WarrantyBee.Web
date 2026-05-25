import axios from "axios";
import { getRecaptchaToken } from "./recaptcha";
import { HttpMethods, CacheKeys, Endpoints } from "../constants";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: import.meta.env.VITE_API_TIMEOUT,
	headers: {
		"Content-Type": "application/json",
	},
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

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
	async (error) => {
		const originalRequest = error.config;

		// If 401 and not already retrying
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return apiClient(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshToken = localStorage.getItem(CacheKeys.REFRESH_TOKEN);

			if (!refreshToken) {
				handleForcedLogout();
				return Promise.reject(error);
			}

			try {
				// We use axios instance without interceptors for refresh to avoid loops
				const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${Endpoints.REFRESH_TOKEN || "/auth/refresh"}`, {
					refreshToken: refreshToken,
				});

				const { accessToken, refreshToken: newRefreshToken } = response.data.data;

				localStorage.setItem(CacheKeys.ACCESS_TOKEN, accessToken);
				localStorage.setItem(CacheKeys.REFRESH_TOKEN, newRefreshToken);

				apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
				processQueue(null, accessToken);

				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				handleForcedLogout();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

function handleForcedLogout() {
	localStorage.removeItem(CacheKeys.ACCESS_TOKEN);
	localStorage.removeItem(CacheKeys.REFRESH_TOKEN);
	window.location.href = "/";
}

export async function apiRequest(method, url, data = {}, config = {}) {
	try {
		let recaptchaToken;

		if (method === HttpMethods.POST || method === HttpMethods.PUT) {
			if (url !== Endpoints.ALIVE && !url.includes("refresh")) {
				recaptchaToken = await getRecaptchaToken();
				if (data) {
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
