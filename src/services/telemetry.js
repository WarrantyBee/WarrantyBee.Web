import axios from "axios";

export function getBrowserContext() {
	return {
		url: window.location.href,
		userAgent: navigator.userAgent,
		platform: navigator.platform,
		language: navigator.language,
		screen: {
			width: window.screen.width,
			height: window.screen.height,
		},
		viewport: {
			width: window.innerWidth,
			height: window.innerHeight,
		},
		timestamp: new Date().toISOString(),
	};
}

export class WebError extends Error {
	constructor(message, info = {}) {
		super(message);
		this.name = "WebError";
		this.info = info;
		this.context = getBrowserContext();

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, WebError);
		}
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			info: this.info,
			context: this.context,
			stack: this.stack,
		};
	}
}

export class TelemetryService {
	constructor() {
		this.apiUrl = import.meta.env.VITE_BETTERSTACK_SOURCE_URL;
		this.sourceToken = import.meta.env.VITE_BETTERSTACK_ACCESS_TOKEN;

		this.client = axios.create({
			baseURL: this.apiUrl,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.sourceToken}`,
			},
			timeout: 6000,
		});

		this.maxRetries = 3;
		this.isDisabled = false;
	}

	async logError(error) {
		if (this.isDisabled) return;

		const err =
			error instanceof WebError
				? error
				: new WebError(error.message || "Unknown Error", {
						originalError: error,
				  });

		const payload = {
			source: "frontend",
			level: "error",
			message: err.message,
			context: {
				...err.context,
				...err.info,
				stack: err.stack,
			},
		};

		await this.#sendWithRetry(payload);
	}

	async logEvent(eventName, payload = {}) {
		if (this.isDisabled) return;

		const data = {
			source: "frontend",
			level: "info",
			message: `Event: ${eventName}`,
			context: {
				...getBrowserContext(),
				...payload,
			},
		};

		await this.#sendWithRetry(data);
	}

	async #sendWithRetry(data) {
		if (!this.sourceToken || this.isDisabled) {
			return;
		}

		let attempt = 0;
		while (attempt < this.maxRetries) {
			try {
				await this.client.post("", data);
				return;
			} catch (err) {
				if (err.response?.status === 401) {
					console.warn("⚠️ Telemetry unauthorized (401) — disabling service.");
					this.isDisabled = true;
					break;
				}

				attempt++;
				if (attempt >= this.maxRetries) {
					break;
				}
				await new Promise((r) => setTimeout(r, 500 * attempt));
			}
		}
	}
}

const telemetryInstance = new TelemetryService();

export default {
	install(app) {
		app.config.globalProperties.$telemetry = telemetryInstance;
		app.config.globalProperties.$WebError = WebError;

		window.addEventListener("error", (event) => {
			telemetryInstance.logError(
				new WebError("Unhandled Error", {
					message: event.message,
					stack: event.error?.stack,
				})
			);
		});

		window.addEventListener("unhandledrejection", (event) => {
			telemetryInstance.logError(
				new WebError("Unhandled Promise Rejection", { reason: event.reason })
			);
		});

		console.info("✅ TelemetryService successfully initialized.");
	},
};

export { telemetryInstance as telemetry };
