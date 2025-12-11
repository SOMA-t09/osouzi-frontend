import React from 'react';
import HomeItem from './HomeItem';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function HomeList({ tasks, onDelete, onUpdate, onReorder }) {
    if (!tasks || tasks.length === 0) return <p>リストがありません　追加してください</p>;

    const listStyle = {
        marginTop: '5px',
        fontSize: '20px',
        listStyle: 'none',
        padding: 0,
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newOrder = Array.from(tasks);
        const [moved] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, moved);

        // 並び替え専用処理
        onReorder(newOrder);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="taskList">
                {(provided) => (
                    <ul
                        style={listStyle}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                {(provided) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            padding: "4px",
                                            marginBottom: "6px",
                                            background: "#f5f5f5",
                                            borderRadius: "5px",
                                            ...provided.draggableProps.style,
                                        }}
                                    >
                                        <HomeItem
                                            task={task}
                                            onDelete={onDelete}
                                            onUpdate={onUpdate}
                                        />
                                    </li>
                                )}
                            </Draggable>
                        ))}

                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default HomeList;
