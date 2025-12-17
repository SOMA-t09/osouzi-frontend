import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeItem({ task, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title || '');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    if (!task || !task.id) return null;

    const handleDetail = () => {
        navigate(`/rooms/${task.id}`);
    };

    const handleSave = () => {
        if (!editedTitle.trim()) {
            setError('部屋名を入力してください');
            return;
        }

        onUpdate(task.id, editedTitle);
        setIsEditing(false);
        setError('');
    };

    // --- styles（元サイズ） ---
    const itemStyle = {
        padding: '15px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '10px',
    };

    const textStyle = { margin: 0 };

    const inputStyle = {
        padding: '5px',
        fontSize: '16px',
        width: '100%',
        marginBottom: '5px',
    };

    const buttonStyle = {
        padding: '5px 10px',
        marginTop: '4px',
        marginRight: '5px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#fff',
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
    };

    const detailButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#17a2b8',
    };

    const editButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#007bff',
    };

    const saveButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#28a745',
    };

    const cancelButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
    };

    const errorStyle = {
        color: 'red',
        fontSize: '14px',
        marginBottom: '5px',
    };

    return (
        <li style={itemStyle}>
            {isEditing ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => {
                            setEditedTitle(e.target.value);
                            setError('');
                        }}
                        style={inputStyle}
                        autoFocus
                    />

                    {error && <p style={errorStyle}>{error}</p>}

                    <button type="submit" style={saveButtonStyle}>
                        保存
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(false);
                            setEditedTitle(task.title);
                            setError('');
                        }}
                        style={cancelButtonStyle}
                    >
                        キャンセル
                    </button>
                </form>
            ) : (
                <>
                    <h3 style={textStyle}>{task.title}</h3>

                    <button onClick={handleDetail} style={detailButtonStyle}>
                        詳細一覧
                    </button>

                    <button
                        onClick={() => setIsEditing(true)}
                        style={editButtonStyle}
                    >
                        編集
                    </button>

                    <button
                        onClick={() => onDelete(task)}
                        style={deleteButtonStyle}
                    >
                        削除
                    </button>
                </>
            )}
        </li>
    );
}

export default HomeItem;
