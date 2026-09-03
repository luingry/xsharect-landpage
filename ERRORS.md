# Errors and solutions

## Vercel preview tried to build the `gh-pages` artifact branch (2026-08-12)

- Symptom: Vercel preview deployments for `gh-pages` artifact commits failed, while the production deployment for `main` succeeded.
- Root cause: The GitHub Pages action publishes only `dist` to `gh-pages`, so Vercel received a static artifact branch without the source files or build dependencies it expects.
- Solution: Added a Vercel `ignoreCommand` that exits `0` only for `VERCEL_GIT_COMMIT_REF=gh-pages`; placed it both at the source root and in `public/` so Vite copies it into the deployed `dist` artifact.
- Guard: For repository branches that contain only deployment artifacts, ensure Vercel's skip configuration is itself included in that artifact while leaving source branches buildable.

## Hero link arrow rendered as mojibake (2026-08-12)

- Symptom: The "Ver o produto" link displayed `â†“` instead of a down arrow.
- Root cause: The UTF-8 arrow character was previously decoded and saved with the wrong encoding.
- Solution: Render the arrow through the encoding-independent JSX escape `{"\\u2193"}`.
- Guard: For isolated UI symbols in files that may have encoding churn, prefer Unicode escapes over copy-pasted glyphs.

## Build failed after motion removal (2026-08-10)

- Symptom: `vite build` failed with `Could not resolve entry module "framer-motion"`.
- Root cause: `vite.config.ts` still declared a manual Rollup chunk for the removed dependency.
- Solution: Removed the obsolete `motion` manual chunk along with the unused package.
- Guard: When removing a bundled dependency, check Vite's `manualChunks` configuration as well as source imports.

## Reveal fade completed instantly (2026-08-10)

- Symptom: Scroll reveals received `is-visible`, but appeared at full opacity instead of fading over 600ms.
- Root cause: The `transition` declaration lived only on `.reveal.is-ready:not(.is-visible)`. Adding `is-visible` removed that selector at the same style update, so the browser had no persisted transition to interpolate. Some readout parallax keyframes also owned opacity.
- Solution: Moved the opacity/transform transition to persistent `.reveal.is-ready` and kept the hidden values on the narrower selector. Removed opacity from the readout parallax keyframes so reveal owns opacity while parallax owns transform.
- Guard: When class state changes initiate a transition, declare the transition on a selector that remains matched after the class change; do not let scroll-parallax and reveal compete for the same property.

## Capability text blurred during scroll (2026-08-10)

- Symptom: Text in "Capacidades na mesma sessão" looked blurred while scrolling.
- Root cause: Scroll-driven `readout-left` and `readout-right` keyframes applied fractional `translate3d` transforms to the same wrappers that render the capability text.
- Solution: Moved readout parallax to a separate, low-opacity number marker inside each capability. Text wrappers and their `dt`/`dd` remain static while the decorative marker moves.
- Guard: Do not apply scroll transforms to wrappers that render dense text; use a dedicated decorative layer for parallax.

## Vercel deployment returned 404 for built assets (2026-08-10; regression guarded 2026-09-03)

- Symptom: The Vercel custom domain loaded its HTML but all JavaScript and CSS requests below `/xsharect-landpage/assets/` returned 404, leaving the React root empty.
- Root cause: The site is generated from a seed that hardcodes the GitHub Pages base. Vercel serves the custom domain from `/`, while GitHub Pages serves it below `/xsharect-landpage/`; a seed refresh therefore produced broken root-domain asset URLs.
- Solution: Preserve the GitHub Pages base in source, but make Vercel's root `vercel.json` override its build with `npm run build -- --base=/`. The Vite CLI option takes precedence over the seed configuration and the root configuration is not replaced by the seed refresh.
- Guard: For every Vite base-path change, run the ordinary Pages build and the Vercel-equivalent `npm run build -- --base=/`, then inspect both generated asset paths before publishing. Keep `public/vercel.json` limited to the `gh-pages` ignore rule: it is copied into the static artifact for that branch and never performs its own build.
