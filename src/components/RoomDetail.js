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

    // --- 掃除場所一覧を取得（lists ベース） ---
    const fetchPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.get(`/lists/${roomId}/places`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('受け取ったデータ:', res.data);

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

    // --- 掃除場所削除 ---
    const handleDelete = async (placeId) => {
        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/lists/places/${placeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlaces((prev) => prev.filter((p) => p.id !== placeId));
        } catch (err) {
            alert('削除できませんでした');
        }
    };

    // --- 掃除場所追加 ---
    const handleAddPlace = async () => {
        const name = newPlaceName.trim();
        if (!name) return;

        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.post(
                `/lists/${roomId}/places`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPlaces((prev) => [...prev, res.data]);
            setNewPlaceName('');
            setShowAddForm(false);
        } catch (err) {
            alert('追加できませんでした');
        }
    };

    const goBack = () => navigate('/home');

    if (loading) return <p>読み込み中...</p>;

    return (
        <div style={container}>
            <h2>{roomTitle || '（部屋名なし）'} の掃除場所一覧</h2>
            <button style={backButton} onClick={goBack}>戻る</button>

            {places.length === 0 ? (
                <p>掃除場所が登録されていません。</p>
            ) : (
                <ul style={listStyle}>
                    {places.map((place) => (
                        <li key={place.id} style={itemStyle}>
                            <h3>{place.name}</h3>
                            <button style={deleteButton} onClick={() => handleDelete(place.id)}>
                                削除
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {showAddForm ? (
                <div style={formContainer}>
                    <input
                        type="text"
                        placeholder="掃除場所名"
                        value={newPlaceName}
                        onChange={(e) => setNewPlaceName(e.target.value)}
                        style={inputStyle}
                    />
                    <button style={submitButton} onClick={handleAddPlace}>追加</button>
                    <button style={cancelButton} onClick={() => setShowAddForm(false)}>キャンセル</button>
                </div>
            ) : (
                <button style={addButton} onClick={() => setShowAddForm(true)}>
                    掃除場所を追加する
                </button>
            )}
        </div>
    );
}

// --- styles ---
const container = { padding: '20px' };
const listStyle = { listStyle: 'none', padding: 0 };
const itemStyle = { padding: '15px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '10px' };
const deleteButton = { backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const backButton = { marginBottom: '15px', backgroundColor: '#6c757d', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const addButton = { padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const formContainer = { marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' };
const inputStyle = { padding: '5px', flex: 1 };
const submitButton = { padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelButton = { padding: '5px 10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default RoomDetail;
