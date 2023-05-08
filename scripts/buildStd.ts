import { all } from ':/util';
import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import uglify from 'uglify-js';
import chalk from 'chalk';

const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    declaration: true,
    stripInternal: true,
};

async function read(path: string): Promise<string> {
    const buffer = await fs.readFile(path);
    return buffer.toString();
}

function transpile(content: string) {
    let transpiled = 'um';
    let declaration  = 'um';

    const host = ts.createCompilerHost(compilerOptions);
    host.readFile = () => content;
    host.writeFile = (file, content) => {
        if(file.endsWith('.d.ts')) {
            declaration = content;
        } else if(file.endsWith('.js')) {
            transpiled = content;
        }
    };
    const program = ts.createProgram([__filename], compilerOptions, host);
    program.emit();
    
    return {
        transpiled,
        declaration,
    };
}

void async function() {
    const vm = path.join(process.cwd(), 'src', 'lib', 'vm');

    const paths = {
        src: path.join(vm, 'std.ts.txt'),
        testable: path.join(vm, 'testable.ts'),
        types: path.join(vm, 'std.d.ts.txt'),
        transpiled: path.join(vm, 'std.js.txt'),
    };

    const content = await all({
        src: read(paths.src).then(content => content.replaceAll(/import.*?\n/g, '')),
        testable: read(paths.testable).then(content => content.replaceAll(/export /g, '')),
    });

    const src = transpile(content.src);
    const testable = transpile(content.testable);

    const { code: completeTranspiledFile, error } = uglify.minify(testable.transpiled + src.transpiled);
    if(error) {
        console.log(chalk.redBright('Uh oh! Uglify.js failed to minify:'));
        console.log(error);
        console.log('---');
        console.log(testable.transpiled);
        console.log('---');
        console.log(src.transpiled);
        console.log(chalk.redBright('Failed!'));
        return;
    }

    await fs.writeFile(paths.types, src.declaration);
    await fs.writeFile(paths.transpiled, completeTranspiledFile);
}();