import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';

const compilerOptions: ts.CompilerOptions = {
    declaration: true,
    stripInternal: true,
    // emitDeclarationOnly: true
};

void async function() {
    const vm = path.join(process.cwd(), 'src', 'lib', 'vm');
    const src = path.join(vm, 'std.ts.txt');
    const types = path.join(vm, 'std.d.ts.txt');
    const transpiled = path.join(vm, 'std.js.txt');

    const buffer = await fs.readFile(src);
    const content = buffer.toString();

    const host = ts.createCompilerHost(compilerOptions);
    host.readFile = () => content;
    host.writeFile = (file, content) => {
        if(file.endsWith('.d.ts')) {
            fs.writeFile(types, content);
        } else if(file.endsWith('.js')) {
            fs.writeFile(transpiled, content);
        }
    };

    const program = ts.createProgram([__filename], compilerOptions, host);
    program.emit();
}();