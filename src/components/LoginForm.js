import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function LoginForms({ onLogin }) {
    const [username, setUsername] = useState(''); // ユーザー名
    const [password, setPassword] = useState(''); // パスワード
    const [error, setError] = useState(''); // エラーメッセージ
    const navigate = useNavigate(); // ページ遷移用のフック

    // ログインフォームの送信処理
    const handleLogin = async (e) => {
        e.preventDefault(); // デフォルトの送信動作を防止
        try {
            const response = await apiClient.post('/auth/login', { username, password }); // ログインリクエスト
            const { token } = response.data; // トークンを取得
            localStorage.setItem('token', token); // トークンをローカルストレージに保存
            onLogin(username); // 親コンポーネントにログインイベントを伝達
            navigate('/home'); // ホーム画面に遷移
        } catch {
            setError('ログインに失敗しました。ユーザー名またはパスワードを確認してください。');
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                maxWidth: '400px',
                margin: '20px auto',
            }}
        >
            {/* ユーザー名入力 */}
            <input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ padding: '10px', fontSize: '16px' }}
            />
            {/* パスワード入力 */}
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '10px', fontSize: '16px' }}
            />
            {/* エラーメッセージ */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* ログインボタン */}
            <button
                type="submit"
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                }}
            >
                ログイン
            </button>
            {/* アカウント作成画面への遷移ボタン */}
            <button
                type="button"
                onClick={() => navigate('/signup')}
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    backgroundColor: 'transparent',
                    color: '#ff8400ff',
                    border: 'none',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                }}
            >
                アカウント作成はこちらから👈
            </button>
        </form>
    );
}


export default LoginForms;
