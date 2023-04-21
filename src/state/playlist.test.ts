import { playlist } from './playlist';
import { createStore } from 'jotai/vanilla';
import assert from 'node:assert/strict';

describe('playlist', () => {
    it('closeFile', () => {
        const store = createStore();
        const coreNote = store.set(playlist.addFile, {
            name: 'Core',
            kind: 'note',
        });
        const mainFile = store.set(playlist.addFile, {
            name: 'main',
            kind: 'file',
        });
        store.set(playlist.openFile, mainFile);
        store.set(playlist.openFile, coreNote);
        assert.equal(store.get(playlist.activeFile), coreNote, 'Sanity check failed');

        store.set(playlist.closeFile, coreNote);
        assert.equal(store.get(playlist.activeFile), mainFile, 'Expected activeFile to be mainFile');

        store.set(playlist.closeFile, mainFile);
        assert.equal(store.get(playlist.activeFile), null);
    });
});