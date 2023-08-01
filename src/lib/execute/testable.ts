export function pick<T>(array: T[], a?: any, b?: any) {
    if(typeof a === 'number') {
        let sum = 0;
        const arr: { original: T; weight: number }[] = typeof b === 'function'
            ? array.map((item, i, array) => {
                const weight = b(item, i, array);
                sum += weight;
                return {
                    original: item,
                    weight,
                };
            })
            : array.map((item) => ({
                original: item,
                weight: (sum += 1, 1),
            }));

        const picked = new Array<T>(a);
        for(let n=0;n<a;n++) {
            let walk = 0;
            const target = Math.random() * sum;
            for(let i=0;i<arr.length;i++) {
                const { weight, original } = arr[i];
                walk += weight;
                if(target < walk) {
                    picked[n] = original;
                    arr.splice(i, 1);
                    sum -= weight;
                    break;
                }
            }
        }
        return picked;
    } else {
        const len = array.length;
        if(len === 0) return undefined;

        if(a === undefined) {
            return array[Math.floor(Math.random() * len)];
        } else {
            let sum = 0;
            const mapped = new Array(len);
            for(let i=0;i<len;i++) {
                const weight: number = a(array[i], i, array);
                sum += weight;
                mapped[i] = weight;
            }

            let walk = 0;
            const target = Math.random() * sum;
            for(let i=0;i<len;i++) {
                if(target < walk) {
                    return array[i];
                }
                walk += mapped[i];
            }
        }
    }
}

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
    } else {
        final = mapped.sort((a, b) => a.mapped as number - (b.mapped as number));
    }

    return final.map((item) => item.original);
}