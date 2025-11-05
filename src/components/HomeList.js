import React from 'react';
import HomeItem from './HomeItem';

function HomeList({ tasks, onDelete, onUpdate }) {
    if (!tasks || tasks.length === 0) return <p>リストがありません　追加してください</p>;

    const listStyle = {
        marginTop: '5px',
        fontSize: '20px',
        listStyle: 'none',
        padding: 0,
    };

    return (
        <ul style={listStyle}>
            {tasks.map((task) => (
                <HomeItem key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
        </ul>
    );
}

export default HomeList;
