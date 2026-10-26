import { defineConfig } from "tsdown";

export default defineConfig({
	outDir: "./dist",
	entry: ["./src/index.ts"],
	sourcemap: "hidden",
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	minify: true,
});
