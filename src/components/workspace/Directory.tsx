import React from 'react';
import styles from './Directory.module.css';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { VscHome, VscNewFile, VscNewFolder, VscSave } from 'react-icons/vsc';
import Tippy from '@tippyjs/react';
import { useAtom, useAtomValue } from 'jotai/react';
import { workspace } from ':/state/workspace';
import produce from 'immer';
import { DirectoryFile } from './DirectoryFile';
import { action, click, useAction } from ':/util';
import { Modals } from ':/components/modal';
import { ModalChangeName } from './ModalChangeName';
import { useHotkey } from ':/hooks/useHotkey'; 
import { useFocus } from ':/hooks/useFocus';
import { FileKind } from ':/models/Workspaces';
import { workspaceIdAtom } from './PageWorkspace';
import { useInterval } from '@chakra-ui/react';

const saveAction = action((get, set) => {
    const isDirty = get(workspace.isDirty);
    if(!isDirty) return;

    const id = get(workspaceIdAtom);
    const directory = set(workspace.serialize);

    set(workspace.isDirty, false);
    fetch(`/api/workspaces/${id}`, {
        method: 'PUT',
        body: JSON.stringify(directory),
    });
});

export function Directory() {
    const [directory, setDirectory] = useAtom(workspace.directory);
    const addFile = useAction(workspace.addFile);
    const save = useAction(saveAction);

    const addGenericFile = async (kind: FileKind) => {
        const name = await Modals.open(ModalChangeName);
        if(name) {
            addFile({
                kind,
                name,
            });
        }    
    };

    const handleAddFile = () => addGenericFile('file');
    const handleAddNote = () => addGenericFile('note');
    const handleDragEnd: OnDragEndResponder = ({ source, destination }) => {
        if(destination) {
            setDirectory(produce(files => {
                const [reorderedItem] = files.splice(source.index, 1);
                files.splice(destination.index, 0, reorderedItem);
            }));
        }
    };

    const container = useFocus();
    useHotkey('alt + shift? + n', ({ shift }) => {
        if(shift) {
            handleAddNote();
        } else {
            handleAddFile();
        }
    });
    useHotkey('alt + d', () => {
        container.focus();
    });
    useHotkey('ctrl + s', save);
    useInterval(save, 3e3);
    
    return (
        <div className={styles.wrapper} ref={container.ref}>
            <div className={styles.actions}>
                <Tippy content="Home" placement="bottom" animation="shift-away">
                    <a className="action" href="/">
                        <VscHome/>
                    </a>
                </Tippy>
                <DirectorySaveButton/>
                <div className={styles.actionsSpacer}/>
                <Tippy content="New file" placement="bottom" animation="shift-away">
                    <span className="action" {...click(handleAddFile)}>
                        <VscNewFile/>
                    </span>
                </Tippy>
                <Tippy content="New note" placement="bottom" animation="shift-away">
                    <span className="action" {...click(handleAddNote)}>
                        <VscNewFolder/>
                    </span>
                </Tippy>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="file-tree">
                    {provided => (
                        <div
                            className={styles.container}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {directory.map((id, i) => (
                                <Draggable index={i} draggableId={id} key={id}>
                                    {provided => (
                                        <DirectoryFile
                                            id={id}
                                            props={{ ref: provided.innerRef, ...provided.draggableProps }}
                                            handle={provided.dragHandleProps}
                                        />
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

function DirectorySaveButton() {
    const isDirty = useAtomValue(workspace.isDirty);
    const save = useAction(saveAction);

    if(isDirty) {
        return (
            <Tippy content="Save" placement="bottom" animation="shift-away">
                <span className="action" {...click(save)} style={{ opacity: 0.5 }}>
                    <VscSave/>
                </span>
            </Tippy>
        );
    } else {
        return null;
    }
}