import { ALTERNATION_REGEX, HotkeyInformation, parseHotkey } from './parseHotkey';
import assert from 'node:assert/strict';

function test(hotkey: string, expected: HotkeyInformation) {
    it(hotkey, () => {
        const information = parseHotkey(hotkey);
        assert.deepEqual(information, expected);
    });
}

function positive(shouldMatch: string) {
    it(shouldMatch, () => {
        assert.equal(ALTERNATION_REGEX.test(shouldMatch), true);
    });
}

describe('parseHotkey()', () => {
    describe('alternation regex', () => {
        [
            '[a]',
            '[a|b]',
            '[a|b|]',
            '[tab|enter]',
        ].map(positive);
    });

    test('s', {
        alt: false,
        ctrl: false,
        shift: false,
        keys: ['s']
    });

    test('[c|v]', {
        alt: false,
        ctrl: false,
        shift: false,
        keys: ['c', 'v']
    });

    test('ctrl + s', {
        alt: false,
        ctrl: true,
        shift: false,
        keys: ['s']
    });

    test('ctrl + shift + s', {
        alt: false,
        ctrl: true,
        shift: true,
        keys: ['s']
    });

    test('alt + ctrl + shift + s', {
        alt: true,
        ctrl: true,
        shift: true,
        keys: ['s']
    });

    test('ctrl? + shift + s', {
        alt: false,
        ctrl: null,
        shift: true,
        keys: ['s']
    });
    
    test('ctrl?+shift+s', {
        alt: false,
        ctrl: null,
        shift: true,
        keys: ['s']
    });

    test('ctrl?+shift + [a|s|d]', {
        alt: false,
        ctrl: null,
        shift: true,
        keys: ['a', 's', 'd']
    });
});