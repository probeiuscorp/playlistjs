import React, { useMemo } from 'react';
import { highlight } from './highlight';

export function Code({ code }: { code: string }) {
    const __html = useMemo(() => (
        highlight(code)
    ), [code]);

    return (
        <pre className="language-typescript code" dangerouslySetInnerHTML={{ __html }}/>
    );
}