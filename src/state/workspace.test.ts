import { workspace } from './workspace';
import { createStore } from 'jotai/vanilla';
import assert from 'node:assert/strict';

describe('workspace', () => {
    it('closeFile', () => {
        const store = createStore();
        const coreNote = store.set(workspace.addFile, {
            name: 'Core',
            kind: 'note',
        });
        const mainFile = store.set(workspace.addFile, {
            name: 'main',
            kind: 'file',
        });
        store.set(workspace.openFile, mainFile);
        store.set(workspace.openFile, coreNote);
        assert.equal(store.get(workspace.activeFile), coreNote, 'Sanity check failed');

        store.set(workspace.closeFile, coreNote);
        assert.equal(store.get(workspace.activeFile), mainFile, 'Expected activeFile to be mainFile');

        store.set(workspace.closeFile, mainFile);
        assert.equal(store.get(workspace.activeFile), null);
    });
});