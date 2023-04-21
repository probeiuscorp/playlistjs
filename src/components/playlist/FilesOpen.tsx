import produce from 'immer';
import { useAtom } from 'jotai/react';
import React from 'react';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { playlist } from ':/state/playlist';
import { FileOpenFile } from './FileOpenFile';
import styles from './FilesOpen.module.css';

export interface FilesOpenProps {
    
}

export function FilesOpen({ }: FilesOpenProps) {
    const [open, setOpen] = useAtom(playlist.open);

    const handleDragEnd: OnDragEndResponder = ({ source, destination }) => {
        if(destination) {
            setOpen(produce(open, open => {
                const [reorderedItem] = open.splice(source.index, 1);
                open.splice(destination.index, 0, reorderedItem);
            }));
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="open" direction="horizontal">
                {provided => (
                    <div
                        className={styles.container}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {open.map((id, i) => (
                            <Draggable index={i} draggableId={id} key={id}>
                                {provided => (
                                    <FileOpenFile
                                        id={id}
                                        handle={provided.dragHandleProps}
                                        props={{ ref: provided.innerRef, ...provided.draggableProps }}
                                    />
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}