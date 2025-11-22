import axios from "axios";

function getBrowserContext() {
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

class WebError extends Error {
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

class TelemetryService {
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
	}

	async logError(error) {
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
		if (!this.sourceToken) {
			console.warn("⚠️ Better Stack source token missing — telemetry skipped.");
			return;
		}

		let attempt = 0;
		while (attempt < this.maxRetries) {
			try {
				await this.client.post("", data);
				return;
			} catch (err) {
				attempt++;
				if (attempt >= this.maxRetries) {
					console.warn("⚠️ Telemetry failed after retries:", err.message);
					break;
				}
				await new Promise((r) => setTimeout(r, 500 * attempt));
			}
		}
	}
}

export default {
	install(app) {
		const telemetry = new TelemetryService();

		app.config.globalProperties.$telemetry = telemetry;
		app.config.globalProperties.$WebError = WebError;

		window.addEventListener("error", (event) => {
			telemetry.logError(
				new WebError("Unhandled Error", {
					message: event.message,
					stack: event.error?.stack,
				})
			);
		});

		window.addEventListener("unhandledrejection", (event) => {
			telemetry.logError(
				new WebError("Unhandled Promise Rejection", { reason: event.reason })
			);
		});

		console.info("✅ TelemetryService successfully initialized.");
	},
};
