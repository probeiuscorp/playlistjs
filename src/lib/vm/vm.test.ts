import { split, rehead, mapsort, shuffle } from './testable';
import assert from 'node:assert/strict';

describe('vm', () => {
    it('Array.prototype.shuffle', () => {
        const counts: Record<string, number> = {
            '012': 0,
            '021': 0,
            '102': 0,
            '120': 0,
            '201': 0,
            '210': 0,
        };
        
        const runs = 10e3;
        const source = [0, 1, 2];
        for(let i=0;i<runs;i++) {
            counts[shuffle(source).join('')]++;
        }
        
        const expanded = Object.entries(counts);
        const min = expanded.reduce((currentMin, [permutation, count]) => Math.min(currentMin, count), Number.MAX_VALUE);
        const max = expanded.reduce((currentMax, [permutation, count]) => Math.max(currentMax, count), 0);
        
        const expected = runs / 6;
        const slice = expected * 0.05;
        const lowAcceptableBound = expected - slice;
        const highAcceptableBound = expected + slice; 
        assert(min > lowAcceptableBound, `Expected ${expected}, but the lowest was ${min}! (${lowAcceptableBound} is the lowest acceptable)`);
        assert(max < highAcceptableBound, `Expected ${expected}, but the highest was ${max}! (${highAcceptableBound} is the highest acceptable)`);
    });

    it('Array.prototype.split', () => {
        const [before, after] = split([0, 1, 2, 3, 4], 2);
        assert.deepEqual(before, [0, 1]);
        assert.deepEqual(after, [2, 3, 4]);
    });

    it('Array.prototype.rehead', () => {
        const reheaded = rehead([0, 1, 2, 3, 4], 2);
        assert.deepEqual(reheaded, [2, 3, 4, 0, 1]);
    });

    it('Array.prototype.mapsort', () => {
        const data = [
            { a: 1, b: 2, key: 'second' },
            { a: 1, b: 3, key: 'third' },
            { a: 3, b: 2, key: 'fourth' },
            { a: 1, b: 1, key: 'first' },
        ];

        it('without compare', () => {
            const mapsorted = mapsort(data, ({ a, b }) => a * b).map(entry => entry.key);
            assert.deepEqual(mapsorted, [
                'first',
                'second',
                'third',
                'fourth',
            ]);
        });

        it('with compare', () => {
            const mapsorted = mapsort(data, ({ a, b }) => a * b, (a, b) => a - b).map(entry => entry.key);
            assert.deepEqual(mapsorted, [
                'fourth',
                'third',
                'second',
                'first',
            ]);
        });
    });
});