# Errors and solutions

## Build failed after motion removal (2026-08-10)

- Symptom: `vite build` failed with `Could not resolve entry module "framer-motion"`.
- Root cause: `vite.config.ts` still declared a manual Rollup chunk for the removed dependency.
- Solution: Removed the obsolete `motion` manual chunk along with the unused package.
- Guard: When removing a bundled dependency, check Vite's `manualChunks` configuration as well as source imports.
