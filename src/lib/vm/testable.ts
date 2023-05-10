export function shuffle<T>(array: T[]): T[] {
    const copy = array.slice();
    let currentIndex = copy.length, randomIndex: number;
    
    while(currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
    }
    
    return copy;
}

export function split<T>(array: T[], index: number): [T[], T[]] {
    return [
        array.slice(0, index),
        array.slice(index),
    ];
}

export function rehead<T>(array: T[], index: number): T[] {
    const [before, after] = split(array, index);
    return [...after, ...before];
}

export function mapsort<T, R>(
    array: T[],
    map: (item: T, index: number, array: T[]) => R,
    compare?: (a: R, b: R) => number,
): T[] {
    let final: { original: any }[];
    const mapped = final = array.map((value, index, array) => ({
        original: value,
        mapped: map(value, index, array),
    }));
    
    if(compare) {
        final = mapped.sort((a, b) => {
            const comparison = compare(a.mapped, b.mapped);
            return typeof comparison === 'number'
                ? comparison
                : comparison
                    ? 1
                    : -1;
        });
    }

    return final.map((item) => item.original);
}