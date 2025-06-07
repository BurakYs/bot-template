import 'dotenv/config.js';
import fs from 'node:fs';
import path from 'node:path';

const base = process.cwd();

const tsconfigPath = path.resolve(base, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

const baseUrl = tsconfig.compilerOptions?.baseUrl || '.';
const paths = tsconfig.compilerOptions?.paths || {};

const aliases = Object.entries(paths).reduce((acc, [key, values]) => {
    acc[key] = values.map((v) => path.resolve(base, baseUrl, v));
    return acc;
}, {});

function matchAlias(specifier) {
    for (const aliasPattern of Object.keys(aliases)) {
        if (aliasPattern.includes('*')) {
            const regexPattern = aliasPattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '(.*)');
            const regex = new RegExp(`^${regexPattern}$`);
            const match = specifier.match(regex);

            if (match) {
                return { aliasPattern, wildcardMatch: match[1] };
            }
        } else if (specifier === aliasPattern) {
            return { aliasPattern, wildcardMatch: null };
        }
    }

    return null;
}

export const resolve = (specifier, parentModuleURL, defaultResolve) => {
    const matched = matchAlias(specifier);
    if (!matched) return defaultResolve(specifier, parentModuleURL);

    const { aliasPattern, wildcardMatch } = matched;
    const targetPaths = aliases[aliasPattern];
    let newSpecifier = wildcardMatch !== null ? targetPaths[0].replace(/\*/g, wildcardMatch) : targetPaths[0];

    if (specifier.startsWith('@/') && !['ts', 'json'].includes(newSpecifier.split('.').pop())) {
        try {
            if (fs.statSync(newSpecifier).isDirectory()) {
                newSpecifier = path.join(newSpecifier, 'index.ts');
            }
        } catch {
            newSpecifier = `${newSpecifier}.ts`;
        }
    }

    return defaultResolve(`file://${newSpecifier}`, parentModuleURL);
};
