import { split, rehead, mapsort } from './testable';
import assert from 'node:assert/strict';

describe('vm', () => {
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