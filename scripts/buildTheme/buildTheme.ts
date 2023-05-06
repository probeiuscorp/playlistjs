import fs from 'fs/promises';
import { IVSCodeTheme, convertTheme } from 'monaco-vscode-textmate-theme-converter';
import path from 'path';
import deepmerge from 'deepmerge';

const satisfies = <T>(a: T) => a;

const cwd = process.cwd();
const paths = {
    dark: path.join(cwd, 'scripts', 'buildTheme', 'dark_vs.json'),
    darkPlus: path.join(cwd, 'scripts', 'buildTheme', 'dark_plus.json'),
    theme: path.join(cwd, 'public', 'theme.json'),
};

async function read(path: string) {
    console.log('reading', path);
    const buffer = await fs.readFile(path);
    const content = buffer.toString();

    console.log('parsing as json...');
    const theme: IVSCodeTheme = JSON.parse(content);
    console.log('success!');

    return theme;
}

/**
 * Because Dark+ is based on normal Dark, running `convertTheme` on the raw
 * Dark+ will produce a broken, incomplete theming
 */
function mergeThemes(source: IVSCodeTheme, over: IVSCodeTheme): IVSCodeTheme {
    return deepmerge.all([
        source,
        over,
        satisfies<Partial<IVSCodeTheme>>({
            colors: {
                'editor.background': '#161616',
            },
        }),
    ]) as IVSCodeTheme;
}

void async function main() {
    const dark = await read(paths.dark);
    const darkPlus = await read(paths.darkPlus);
    const completeTheme = mergeThemes(dark, darkPlus);

    console.log('converted');
    const converted = convertTheme(completeTheme);

    console.log('writing...');
    const serialized = JSON.stringify(converted, undefined, 4);
    await fs.writeFile(paths.theme, serialized);
    console.log('success!');
}();