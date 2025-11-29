/**
 * Normalizes a value before comparison.
 * - Trims string values.
 * - Returns all other types as-is.
 *
 * @param {*} value - The value to normalize.
 * @returns {*} The normalized value.
 */
function normalizeValue(value) {
	if (typeof value === "string") return value.trim();
	return value;
}

/**
 * Deeply compares two values and determines the exact difference.
 *
 * Comparison rules:
 * - Trims string values before comparison.
 * - Recursively compares nested objects.
 * - Arrays are compared by value; differences return the new array.
 * - Primitive differences return the new value.
 * - If values are equal after normalization, returns `undefined`.
 *
 * @param {*} oldVal - The original value.
 * @param {*} newVal - The updated value.
 * @returns {undefined|*|Object}
 *          - `undefined` if no difference,
 *          - the new primitive value if changed,
 *          - or a nested diff object for deep changes.
 */
function deepCompare(oldVal, newVal) {
	oldVal = normalizeValue(oldVal);
	newVal = normalizeValue(newVal);

	if (oldVal === newVal) return undefined;

	if (
		typeof oldVal !== "object" ||
		typeof newVal !== "object" ||
		oldVal === null ||
		newVal === null
	) {
		return newVal;
	}

	if (Array.isArray(oldVal) && Array.isArray(newVal)) {
		if (
			oldVal.length !== newVal.length ||
			JSON.stringify(oldVal.map(normalizeValue)) !==
				JSON.stringify(newVal.map(normalizeValue))
		) {
			return newVal;
		}
		return undefined;
	}

	const diff = {};
	const allKeys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);

	allKeys.forEach((key) => {
		const nestedDiff = deepCompare(oldVal[key], newVal[key]);
		if (nestedDiff !== undefined) {
			diff[key] = nestedDiff;
		}
	});

	return Object.keys(diff).length > 0 ? diff : undefined;
}

/**
 * Computes a deep JSON difference object between two structures.
 *
 * String values are trimmed before comparison, and nested objects
 * are recursively processed to return only changed values.
 *
 * @param {Object} oldObj - The original JSON object.
 * @param {Object} newObj - The updated JSON object.
 * @returns {Object} A deep diff object containing only changed fields.
 */
export function getDifference(oldObj, newObj) {
	const diff = deepCompare(oldObj, newObj);
	return diff || {};
}

/**
 * Determines whether two JSON structures differ.
 *
 * Performs a deep comparison and returns a boolean indicating
 * if any value (including nested) has changed after trimming string values.
 *
 * @param {Object} oldObj - The original JSON object.
 * @param {Object} newObj - The updated JSON object.
 * @returns {boolean} `true` if any difference exists, otherwise `false`.
 */
export function hasDifference(oldObj, newObj) {
	return deepCompare(oldObj, newObj) !== undefined;
}
