import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
	const isDebug = mode === "debug";

	return {
		plugins: [vue()],

		build: {
			sourcemap: isDebug,

			rollupOptions: {
				output: {
					entryFileNames: isDebug ? `[name].js` : `[name]-[hash].js`,
					chunkFileNames: isDebug ? `[name].js` : `[name]-[hash].js`,
					assetFileNames: isDebug ? `[name].[ext]` : `[name]-[hash].[ext]`,
				},
			},
		},
	};
});
