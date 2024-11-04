import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  external: ["react"],
  format: ["cjs", "esm"],
  minify: true,
  sourcemap: true,
  treeshake: true,
  outDir: "dist",
}); 