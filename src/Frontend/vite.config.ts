
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import dotenv from "dotenv";

import { babel } from "@rollup/plugin-babel";

dotenv.config();

process.env.II_URL = process.env.VITE_IDENTITY_PROVIDER;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		environment(["II_URL"]),
		babel({ babelHelpers: "bundled" }),
	],
	build: {
		target: ["EsNext"],
		minify: "terser",
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
});
