import fs from 'node:fs';
import path from 'node:path';

const extensions = ['.ts', '/index.ts', '.json', ''];

const srcPath = path.resolve(process.cwd(), 'src');
const srcPrefix = '@/';

function resolvePath(specifier) {
    const filePath = specifier.slice(srcPrefix.length);

    for (const ext of extensions) {
        const fullPath = path.resolve(srcPath, filePath + ext);
        if (fs.existsSync(fullPath)) {
            if (!fs.statSync(fullPath).isDirectory()) {
                return `file://${fullPath}`;
            }
        }
    }

    return null;
}

export function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
        const resolved = resolvePath(specifier);

        if (resolved) {
            return {
                url: resolved,
                shortCircuit: true
            };
        }
    }

    return nextResolve(specifier, context);
}
