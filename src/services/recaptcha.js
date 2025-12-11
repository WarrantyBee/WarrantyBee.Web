const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Loads the Google reCAPTCHA v3 script dynamically if it is not already loaded.
 * @returns {Promise<void>} A promise that resolves when reCAPTCHA is ready.
 */
export function loadRecaptcha() {
	return new Promise((resolve, reject) => {
		if (window.grecaptcha && window.grecaptcha.ready) {
			return resolve();
		}

		const existing = document.querySelector('script[src*="recaptcha"]');
		if (existing) {
			existing.onload = resolve;
			existing.onerror = reject;
			return;
		}

		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
		script.async = true;
		script.defer = true;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
}

/**
 * Retrieves a reCAPTCHA v3 token for the specified action.
 *
 * Ensures the script is loaded first, then waits for grecaptcha.ready()
 * before executing reCAPTCHA.
 *
 * @param {string} [action="submit"] - The action name to associate with the token.
 * @returns {Promise<string>} A promise that resolves to the reCAPTCHA token.
 */
export async function getRecaptchaToken(action = "submit") {
	await loadRecaptcha();

	return new Promise((resolve) => {
		window.grecaptcha.ready(async () => {
			const token = await window.grecaptcha.execute(siteKey, { action });
			resolve(token);
		});
	});
}
