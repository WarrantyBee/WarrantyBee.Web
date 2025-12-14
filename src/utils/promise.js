/**
 * Executes a callback after a specified delay.
 *
 * @param {Function} callback - Function to execute after the delay.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Promise<*>} Resolves with the callback result.
 */
export async function run(callback, delay) {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
				const result = await callback();
				resolve(result);
			} catch (err) {
				reject(err);
			}
		}, delay);
	});
}
