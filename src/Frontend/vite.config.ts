import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import dotenv from 'dotenv';


dotenv.config();

process.env.II_URL = process.env.VITE_IDENTITY_PROVIDER;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		legacy(),
		environment(["II_URL"]),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
});
