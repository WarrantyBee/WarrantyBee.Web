const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
window.reCaptchaLoaded = false;

export async function loadRecaptcha() {
	if (window.grecaptcha || window.reCaptchaLoaded) {
		return;
	} else {
		await new Promise((resolve, reject) => {
			const s = document.createElement("script");
			s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
			s.async = true;
			s.defer = true;
			s.onload = resolve;
			s.onerror = reject;
			document.head.appendChild(s);
			window.reCaptchaLoaded = true;
		});
	}
}

export async function getRecaptchaToken(action = "submit") {
	await loadRecaptcha();
	return await window.grecaptcha.execute(siteKey, { action });
}
