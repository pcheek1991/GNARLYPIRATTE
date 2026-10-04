import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';

const projectDir = fileURLToPath(new URL('../', import.meta.url));
const distDir = path.join(projectDir, 'dist');
await mkdir(distDir, { recursive: true });

const rollupEntry = path.join(projectDir, 'node_modules', 'rollup', 'dist', 'bin', 'rollup');
const child = spawn(process.execPath, [rollupEntry, '-c'], {
    cwd: projectDir,
    env: { ...process.env, SERVE: 'false' },
    stdio: 'inherit',
});
const code = await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', value => resolve(value ?? 1));
});
if (code !== 0) process.exit(code);
await Promise.all(['package.json', 'LICENSE', 'THIRD_PARTY_NOTICES.md'].map(name =>
    copyFile(path.join(projectDir, name), path.join(distDir, name))
));
console.log('Built dist/plugin.js and dist/plugin.min.js.');
