// Uses the current official Windy plugin template's build pipeline.
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import rollupSvelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import ts from 'typescript';
import { transformCodeToESMPlugin, keyPEM, certificatePEM } from '@windycom/plugin-devtools';

// Shared, namespaced panel styles are mounted and removed with the panel.
function cssAsText() {
    return {
        name: 'gnarlypiratte-css-as-text',
        transform(code, id) {
            if (!id.endsWith('.css')) return null;
            return { code: `export default ${JSON.stringify(code)};`, map: { mappings: '' } };
        },
    };
}

// The official template uses SWC here. TypeScript's JavaScript implementation
// avoids an optional native compiler binary and keeps this starter portable.
function transpileTypescript() {
    return {
        name: 'gnarlypiratte-typescript',
        transform(code, id) {
            if (!id.endsWith('.ts')) return null;
            const result = ts.transpileModule(code, {
                fileName: id,
                reportDiagnostics: true,
                compilerOptions: {
                    target: ts.ScriptTarget.ES2022,
                    module: ts.ModuleKind.ESNext,
                    sourceMap: true,
                },
            });
            for (const diagnostic of result.diagnostics ?? []) {
                if (diagnostic.category === ts.DiagnosticCategory.Error) {
                    this.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
                }
            }
            return { code: result.outputText, map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null };
        },
    };
}

export default {
    input: 'src/plugin.svelte',
    output: [
        { file: 'dist/plugin.js', format: 'es', sourcemap: true },
        { file: 'dist/plugin.min.js', format: 'es', plugins: [terser()] },
    ],
    external: id => id.startsWith('@windy/'),
    watch: { include: ['src/**'], exclude: 'node_modules/**', clearScreen: false },
    plugins: [
        cssAsText(),
        rollupSvelte({ emitCss: false, preprocess: sveltePreprocess({ sourceMap: true }) }),
        transpileTypescript(),
        resolve({ browser: true, mainFields: ['module', 'jsnext:main', 'main'], preferBuiltins: false, dedupe: ['svelte'] }),
        commonjs(),
        transformCodeToESMPlugin(),
        process.env.SERVE !== 'false' && serve({
            contentBase: 'dist',
            host: 'localhost',
            port: 9999,
            headers: { 'Access-Control-Allow-Origin': '*' },
            // The devtools package supplies a public development certificate.
            // No account credentials or custom private keys are stored here.
            https: { key: keyPEM, cert: certificatePEM },
        }),
    ].filter(Boolean),
};
