import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function RoomDetail() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [places, setPlaces] = useState([]);
    const [roomTitle, setRoomTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newPlaceName, setNewPlaceName] = useState('');

    // 編集用
    const [editingPlaceId, setEditingPlaceId] = useState(null);
    const [editingName, setEditingName] = useState('');

    // エラー表示用
    const [error, setError] = useState('');

    // =============================
    // 重複チェック（編集時は自分を除外）
    // =============================
    const isDuplicateName = (name, excludeId = null) => {
        return places.some(
            p =>
                p.name.trim() === name.trim() &&
                (excludeId === null || p.id !== excludeId)
        );
    };

    // --- 掃除場所一覧取得 ---
    const fetchPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.get(`/lists/${roomId}/places`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPlaces(res.data.places || []);
            setRoomTitle(res.data.title || '');
        } catch (err) {
            console.error('取得エラー:', err);
            setPlaces([]);
            setRoomTitle('');
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);

    // --- 削除 ---
    const handleDelete = async (place) => {
        if (!window.confirm(`「${place.name}」を削除しますか？`)) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/lists/places/${place.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPlaces(prev => prev.filter(p => p.id !== place.id));
            setError('');
        } catch {
            setError('削除できませんでした');
        }
    };

    // --- 追加 ---
    const handleAddPlace = async (e) => {
        e.preventDefault();

        const name = newPlaceName.trim();
        if (!name) {
            setError('掃除場所名を入力してください');
            return;
        }

        if (isDuplicateName(name)) {
            setError('同じ掃除場所名がすでに存在します');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.post(
                `/lists/${roomId}/places`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPlaces(prev => [...prev, res.data]);
            setNewPlaceName('');
            setShowAddForm(false);
            setError('');
        } catch {
            setError('追加できませんでした');
        }
    };

    // --- 編集開始 ---
    const startEdit = (place) => {
        setError('');
        setEditingPlaceId(place.id);
        setEditingName(place.name);
    };

    // --- 編集保存 ---
    const handleUpdatePlace = async (e) => {
        e.preventDefault();

        const name = editingName.trim();
        if (!name) {
            setError('掃除場所名を入力してください');
            return;
        }

        if (isDuplicateName(name, editingPlaceId)) {
            setError('同じ掃除場所名がすでに存在します');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.put(
                `/lists/places/${editingPlaceId}`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPlaces(prev =>
                prev.map(p => (p.id === editingPlaceId ? res.data : p))
            );

            setEditingPlaceId(null);
            setEditingName('');
            setError('');
        } catch {
            setError('更新に失敗しました');
        }
    };

    // --- 編集キャンセル ---
    const cancelEdit = () => {
        setEditingPlaceId(null);
        setEditingName('');
        setError('');
    };

    if (loading) return <p>読み込み中...</p>;

    return (
        <div style={container}>
            <h2>{roomTitle || '（部屋名なし）'} の掃除場所一覧</h2>

            {error && (
                <p style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </p>
            )}

            <button style={backButton} onClick={() => navigate('/home')}>
                部屋一覧に戻る
            </button>

            {places.length === 0 ? (
                <p>掃除場所が登録されていません。</p>
            ) : (
                <ul style={listStyle}>
                    {places.map(place => (
                        <li key={place.id} style={itemStyle}>
                            {editingPlaceId === place.id ? (
                                <form onSubmit={handleUpdatePlace} style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        value={editingName}
                                        onChange={e => setEditingName(e.target.value)}
                                        style={inputStyle}
                                        autoFocus
                                    />
                                    <button type="submit" style={submitButton}>
                                        保存
                                    </button>
                                    <button
                                        type="button"
                                        style={cancelButton}
                                        onClick={cancelEdit}
                                    >
                                        キャンセル
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <h3>{place.name}</h3>
                                    <button
                                        style={deleteButton}
                                        onClick={() => handleDelete(place)}
                                    >
                                        削除
                                    </button>
                                    <button
                                        style={editButton}
                                        onClick={() => startEdit(place)}
                                    >
                                        編集
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {showAddForm ? (
                <form style={formContainer} onSubmit={handleAddPlace}>
                    <input
                        placeholder="掃除場所名"
                        value={newPlaceName}
                        onChange={e => setNewPlaceName(e.target.value)}
                        style={inputStyle}
                        autoFocus
                    />
                    <button type="submit" style={submitButton}>
                        追加
                    </button>
                    <button
                        type="button"
                        style={cancelButton}
                        onClick={() => {
                            setShowAddForm(false);
                            setError('');
                        }}
                    >
                        キャンセル
                    </button>
                </form>
            ) : (
                <button
                    style={addButton}
                    onClick={() => {
                        setShowAddForm(true);
                        setError('');
                    }}
                >
                    追加
                </button>
            )}
        </div>
    );
}

/* ---------- styles ---------- */
const container = { padding: '20px' };
const listStyle = { listStyle: 'none', padding: 0 };
const itemStyle = {
    padding: '15px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '10px'
};
const deleteButton = { backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px' };
const editButton = { backgroundColor: '#007bff', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px', marginLeft: '10px' };
const backButton = { marginBottom: '15px', backgroundColor: '#6c757d', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px' };
const addButton = { padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px' };
const formContainer = { marginTop: '15px', display: 'flex', gap: '10px' };
const inputStyle = { padding: '5px', flex: 1 };
const submitButton = { padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' };
const cancelButton = { padding: '5px 10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px' };

export default RoomDetail;
