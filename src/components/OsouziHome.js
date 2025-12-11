import React, { useState, useEffect } from 'react';
import HomeList from './HomeList';
import apiClient from '../api/client';

function OsouziHome({ onLogout, username }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // 🔽 DBから読み込み
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
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

    // 🔽 リスト追加
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('部屋名を入力してください');
            return;
        }

        const exists = tasks.some(
            (task) => task.title === title.trim()
        );
        if (exists) {
            setError('同じ部屋名は登録できません');
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

    // 🔽 削除
    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm('本当に削除しますか？');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/lists/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((t) => t.id !== taskId));
        } catch (err) {
            console.error('削除エラー:', err);
        }
    };

    // 🔽 編集更新
    const handleUpdateTask = async (taskId, updatedTitle) => {
        if (!updatedTitle?.trim) return; // ← ここで undefined.trim を防止！

        const trimmed = updatedTitle.trim();

        if (!trimmed) {
            alert("部屋名を入力してください");
            return;
        }

        const exists = tasks.some(
            (t) => t.id !== taskId && t.title === trimmed
        );
        if (exists) {
            alert("同じ部屋名は登録できません");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await apiClient.put(
                `/lists/${taskId}`,
                { title: trimmed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(tasks.map((t) => (t.id === taskId ? res.data : t)));
        } catch (err) {
            console.error('更新エラー:', err);
            alert(err?.response?.data?.detail || "更新に失敗しました");
        }
    };

    // 🔽 並び替え専用（サーバー保存なし版）
    const handleReorder = (newOrder) => {
        setTasks(newOrder);
        // ★必要ならバックエンドに保存APIを追加できる
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
                <button style={logoutButtonStyle} onClick={onLogout}>ログアウト</button>
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

            <HomeList
                tasks={tasks}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
                onReorder={handleReorder}   
            />
        </div>
    );
}

export default OsouziHome;
