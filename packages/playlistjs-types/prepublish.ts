import { exec } from "child_process"
import { readFileSync, writeFileSync } from "fs";
import { simpleResolveFileImports, transformTypeScriptSync } from "src/lib/bundle";

const executeDir = '../../src/lib/execute';
exec(`cp ${executeDir}/std.d.ts.txt index.d.ts`);
const testable = readFileSync(`${executeDir}/testable.ts`, 'utf8');
const content = readFileSync(`${executeDir}/worker.js.txt`, 'utf8');

const iShimStart = content.indexOf('/* shim: */');
let iShimEnd = iShimStart;
while(content[++iShimEnd] !== '\n');
const iShip = content.indexOf('/* ship: */');
const shimmedContent = content.slice(0, iShimStart - 1) + content.slice(iShimEnd, iShip - 1);
function insertFunctionsIntoGlobalThis(source: string): string {
    while(true) {
        const match = source.match(/^function (\w+)/m);
        if(match === null) return source;
        const functionName = match[1];
        return source.slice(0, match.index) + `globalThis.${functionName} = f`
            + insertFunctionsIntoGlobalThis(source.slice(match.index! + 1));
    }
}
const minifiedContent = transformTypeScriptSync(simpleResolveFileImports(insertFunctionsIntoGlobalThis(shimmedContent), testable));
writeFileSync('shim.js', minifiedContent);
