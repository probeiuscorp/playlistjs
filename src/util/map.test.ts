import assert from 'assert/strict';
import { map } from '../util';

describe('map', () => {
    it('mapping records', () => {
        const mapped = map({
            a: 1,
            b: 2,
        }, (value) => value * 2);

        assert.deepEqual(mapped, {
            a: 2,
            b: 4,
        });
    });
});