import React, { useState, useEffect } from 'react';
import HomeList from './HomeList';
import apiClient from '../api/client';

function OsouziHome({ onLogout, username }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // ✅ ページ読み込み時にDBからリストを取得
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('トークンがありません。ログインが必要です。');
            setLoading(false);
            return;
        }
        fetchTasks(token);
    }, []);

    const fetchTasks = async (token) => {
        try {
            const res = await apiClient.get('/lists/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data);
        } catch (err) {
            console.error('リスト取得エラー:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('部屋名を入力してください');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.post(
                '/lists/',
                { title },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, res.data]);
            setTitle('');
            setError('');
        } catch (err) {
            console.error('追加エラー:', err);
            setError('リストを追加できませんでした');
        }
    };

    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm('本当に削除しますか？');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/lists/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (err) {
            console.error('削除エラー:', err);
        }
    };

    const handleUpdateTask = async (taskId, updatedTitle) => {
        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.put(
                `/lists/${taskId}`,
                { title: updatedTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(tasks.map((t) => (t.id === taskId ? res.data : t)));
        } catch (err) {
            console.error('更新エラー:', err);
        }
    };

    const containerStyle = { width: '600px', margin: '0 auto', padding: '20px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
    const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' };
    const inputStyle = { padding: '10px', fontSize: '20px', width: '100%', boxSizing: 'border-box' };
    const errorStyle = { color: 'red', fontSize: '14px' };
    const logoutButtonStyle = { padding: '10px', fontSize: '16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' };

    if (loading) return <p>読み込み中...</p>;

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <div>{username}でログイン中</div>
                <button style={logoutButtonStyle} onClick={onLogout}>
                    ログアウト
                </button>
            </header>

            <form style={formStyle} onSubmit={handleAddTask}>
                <input
                    type="text"
                    placeholder="部屋名を入力して下さい"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                />
                {error && <p style={errorStyle}>{error}</p>}
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    リストに追加
                </button>
            </form>

            <HomeList tasks={tasks} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
        </div>
    );
}

export default OsouziHome;
