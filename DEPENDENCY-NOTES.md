# Dependency review

Checked on 2026-10-03 against npm's advisory service and the linked upstream
security advisories. This is a starter with the official Windy devtools 3.0.4
dependency stack; it is not a claim of zero vulnerabilities.

## Changes applied

- Windy devtools is updated from **3.0.3 to 3.0.4**, the current compatible
  patch release, which retains the same compiler/runtime dependency ranges.
- The vulnerable minimatch 9.x dependency is overridden to **9.0.9**, retaining
  its major version and leaving the unrelated minimatch 3.x and 5.x packages
  alone. This removes the minimatch findings reported by npm, including
  [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26).
- The Rollup minifier's serialize-javascript dependency is overridden to
  **7.1.2**, fixing its
  [code-injection advisory](https://github.com/advisories/GHSA-5c6j-r48x-rmvq)
  and [CPU-exhaustion advisory](https://github.com/advisories/GHSA-qj8w-gfj5-8c6v).
  This package requires Node 20+, matching this starter's existing engine
  requirement. Its use with the existing minifier passed the full build.

The installation used `--ignore-scripts`; no native-addon permission changes
were made. No force upgrade or devtools downgrade was applied.

## Remaining findings and scope

The complete audit changed from **14 package findings (12 high, 2 moderate)**
to **12 package findings (11 high, 1 moderate)**. Counts include vulnerable
dependencies propagated to their parent packages; they are not counts of
independent vulnerabilities.

**Build/lint tooling:**
[braces GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects the currently published braces 3.0.3 and has no patched release listed
in the advisory. Its deeply nested pattern input can exhaust the Node stack.
This propagates through micromatch, fast-glob, globby, the TypeScript ESLint
packages, and Windy devtools. These packages are not included in the browser
plugin bundle. Current build patterns are fixed project patterns; the starter
does not accept remote glob patterns. Building or linting modified/untrusted
projects is a separate exposure and requires review.

**Bundled runtime:** Svelte **4.2.20** remains in the plugin's browser bundle.
The reported Svelte SSR advisories describe server rendering, which this
starter does not perform. For example, the upstream
[dynamic-tag advisory](https://github.com/sveltejs/svelte/security/advisories/GHSA-m56q-vw4c-c2cp)
explicitly excludes client rendering. The separate
[DOM-clobbering advisory](https://github.com/sveltejs/svelte/security/advisories/GHSA-rcqx-6q8c-2c42)
requires simultaneously user-controlled form attribute spreading and input or
button attribute/name control. This starter's Svelte wrapper does not use
those features. This source-based scope assessment does not remove the audit
finding or establish safety after future feature changes.

The relevant patches are in Svelte 5; replacing Svelte 4 with Svelte 5 is a
compiler/runtime migration that has not been verified inside Windy's client.
It was not forced into this starter to silence the audit. Future SSR or
attribute-spreading changes must revisit these advisories.

`npm audit --omit=dev` reports **0** because npm classifies all installed
packages as development dependencies. That number does **not** describe the
bundled Svelte runtime and is not used here as a claim of zero runtime risk.
The generated source map confirms that only Svelte runtime modules, rather
than braces, minimatch, or serialize-javascript, are bundled third-party code.

## Verification after changes

- `npm test`: 8 tests passed.
- `npm run check`: passed.
- `npm run build`: passed, including the minified plugin.
- `npm ls`: confirmed the two overridden versions and unchanged Svelte 4.2.20.

The Svelte runtime version and its existing third-party license notice remain
unchanged. Live Windy installation and integration testing are separate from
these local build and source checks.
