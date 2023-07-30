import prism from 'prismjs';
import 'prismjs/components/prism-typescript';
// import 'prism-themes/themes/prism-darcula.css';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
// import 'prism-themes/themes/prism-gruvbox-dark.css';

export function highlight(code: string) {
    return prism.highlight(code, prism.languages.typescript, 'typescript');
}