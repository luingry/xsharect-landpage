# Errors and solutions

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

## Vercel deployment returned 404 for built assets (2026-08-10)

- Symptom: The landing page deployed to Vercel returned 404s because the generated asset URLs included the GitHub Pages repository prefix.
- Root cause: Vite used `/xsharect-landpage/` as its base for every environment, while a Vercel project is served from `/`.
- Solution: Detect the Vercel build environment through `VERCEL` or `VERCEL_ENV` and set Vite's base to `/`; retain `/xsharect-landpage/` everywhere else for GitHub Pages.
- Guard: When a Vite app serves from more than one host root, make the build base explicit per deployment environment and verify the generated asset paths.
