import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function SignUpForm() {
    const [formData, setFormData] = useState({
        username: '', // ユーザー名入力値
        password: '', // パスワード入力値
    });
    const [error, setError] = useState(''); // エラーメッセージの状態
    const navigate = useNavigate(); // ページ遷移用のフック

    // 入力フィールドの値を更新
    const handleChange = (e) => {
        const { name, value } = e.target; // 入力フィールドの名前と値を取得
        setFormData({ ...formData, [name]: value }); // 現在のフォームデータに新しい値をセット
    };

    // フォーム送信処理
    const handleSubmit = async (e) => {
        e.preventDefault(); // フォームのデフォルト動作（ページリロード）を防止
        try {
            await apiClient.post('/auth/signup', formData); // バックエンドにアカウント作成リクエストを送信
            alert('アカウントが作成されました！ログイン画面に進んでください。');
            navigate('/login'); // ログイン画面に遷移
        } catch (err) {
            // エラーメッセージを取得
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail); // バックエンドからのエラーを表示
            } else {
                setError('アカウント作成に失敗しました。入力内容を確認してください。');
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                maxWidth: '400px',
                margin: '20px auto',
            }}
        >
            {/* ユーザー名入力フィールド */}
            <input
                type="text"
                name="username"
                placeholder="ユーザー名"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ padding: '10px', fontSize: '16px' }}
            />
            {/* パスワード入力フィールド */}
            <input
                type="password"
                name="password"
                placeholder="パスワード"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ padding: '10px', fontSize: '16px' }}
            />
            {/* エラーメッセージの表示 */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* アカウント作成ボタン */}
            <button
                type="submit"
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    backgroundColor: '#ff8400ff',
                    color: '#fff',
                    border: 'none',
                }}
            >
                アカウント作成
            </button>
            {/* ログイン画面に戻るボタン */}
            <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    backgroundColor: 'transparent',
                    color: '#007bff',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                }}
            >
                ログイン画面に戻る
            </button>
        </form>
    );
}

export default SignUpForm;

