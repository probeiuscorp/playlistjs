import React from 'react';
import styles from './Directory.module.css';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';
import Tippy from '@tippyjs/react';
import { useAtom } from 'jotai/react';
import { playlist } from ':/state/playlist';
import produce from 'immer';
import { DirectoryFile } from './DirectoryFile';
import { click, useAction } from ':/util';
import { Modals } from ':/components/modal';
import { ModalChangeName } from './ModalChangeName';
import { useHotkeys } from ':/hooks/useHotkeys';
import { useFocus } from ':/hooks/useFocus';
import { FileKind } from ':/models/Playlists';

export function Directory() {
    const [directory, setDirectory] = useAtom(playlist.directory);
    const addFile = useAction(playlist.addFile);

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
    useHotkeys({
        'alt + shift? + n'({ shift }) {
            if(shift) {
                handleAddNote();
            } else {
                handleAddFile();
            }
        },
        'alt + d'() {
            container.focus();
        }
    });
    
    return (
        <div className={styles.wrapper} ref={container.ref}>
            <div className={styles.actions}>
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