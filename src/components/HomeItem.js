import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeItem({ task = {}, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title || '');
    const [error, setError] = useState(''); // ← エラーメッセージ管理用
    const navigate = useNavigate();

    const handleSave = () => {
        const trimmedTitle = editedTitle.trim();
        if (!trimmedTitle) {
            setError('部屋名を入力してください。');
            return;
        }

        onUpdate(task.id, trimmedTitle);
        setIsEditing(false);
        setError(''); // 保存成功時にエラーを消す
    };

    const handleDetail = () => {
        navigate(`/rooms/${task.id}`);
    };

    const itemStyle = {
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '10px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    };

    const textStyle = {
        whiteSpace: 'pre-wrap',
        marginBottom: '10px',
    };

    const inputStyle = {
        padding: '10px',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '10px',
    };

    const buttonStyle = {
        padding: '5px 10px',
        fontSize: '14px',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        marginRight: '5px',
        borderRadius: '5px',
    };

    const editButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#007bff',
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
    };

    const detailButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#17a2b8',
    };

    const saveButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#28a745',
    };

    const errorStyle = {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px',
    };

    if (!task || !task.id) return null;

    return (
        <li style={itemStyle}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => {
                            setEditedTitle(e.target.value);
                            setError(''); // 入力中にエラーをリセット
                        }}
                        style={inputStyle}
                    />
                    {error && <p style={errorStyle}>{error}</p>}

                    <button onClick={handleSave} style={saveButtonStyle}>
                        保存
                    </button>
                </>
            ) : (
                <>
                    <h3 style={textStyle}>{task.title}</h3>

                    <button onClick={handleDetail} style={detailButtonStyle}>
                        掃除場所の一覧を見る
                    </button>
                    <button onClick={() => setIsEditing(true)} style={editButtonStyle}>
                        部屋名を編集
                    </button>
                    <button onClick={() => onDelete(task.id)} style={deleteButtonStyle}>
                        削除
                    </button>
                </>
            )}
        </li>
    );
}

export default HomeItem;
