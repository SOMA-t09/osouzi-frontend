import React from 'react';
import HomeItem from './HomeItem';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function HomeList({ tasks, onDelete, onUpdate, onReorder }) {
    if (!tasks || tasks.length === 0) {
        return <p>リストがありません　追加してください</p>;
    }

    // ✅ flex で3列（DnD安定）
    const listStyle = {
        marginTop: '6px',
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newOrder = Array.from(tasks);
        const [moved] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, moved);

        onReorder(newOrder);
    };

    return (
        <>
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                ☰ をドラッグして並び替えできます
            </p>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="taskList">
                    {(provided) => (
                        <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={listStyle}
                        >
                            {tasks.map((task, index) => (
                                <Draggable
                                    key={task.id}
                                    draggableId={String(task.id)}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                flex: '0 0 calc(33.333% - 4px)', // ✅ 3列
                                                maxWidth: 'calc(33.333% - 4px)',
                                                boxSizing: 'border-box',
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "4px",
                                                fontSize: "16px",
                                                background: snapshot.isDragging
                                                    ? "#e0f7fa"
                                                    : "#f5f5f5",
                                                borderRadius: "6px",
                                                boxShadow: snapshot.isDragging
                                                    ? "0 3px 6px rgba(0,0,0,0.2)"
                                                    : "none",
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            {/* ドラッグハンドル */}
                                            <span
                                                {...provided.dragHandleProps}
                                                style={{
                                                    cursor: "grab",
                                                    marginRight: "6px",
                                                    color: "#888",
                                                    fontSize: "16px",
                                                    userSelect: "none",
                                                }}
                                                title="ドラッグして並び替え"
                                            >
                                                ☰
                                            </span>

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
        </>
    );
}

export default HomeList;
