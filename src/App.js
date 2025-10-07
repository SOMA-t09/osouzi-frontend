import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import OsouziHome from './components/OsouziHome';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理
    const [username, setUsername] = useState(''); // ログイン中のユーザー名

    // ログイン処理
    const handleLogin = (username) => {
        setIsLoggedIn(true); // ログイン状態を更新
        setUsername(username); // ユーザー名を記録
    };

    // ログアウト処理
    const handleLogout = () => {
        setIsLoggedIn(false); // ログイン状態をリセット
        setUsername(''); // ユーザー名をリセット
    };

    const appStyle = {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box',
    };

    return (
    
        <Router>
            <div style={appStyle}>
                <Header />
                <Routes>
                    {/* ログイン画面 */}
                    <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                    {/* アカウント作成画面 */}
                    <Route path="/signup" element={<SignUpForm />} />
                    {/* ToDoホーム画面 */}
                    <Route
                        path="/home"
                        element={
                            isLoggedIn ? (
                                <OsouziHome onLogout={handleLogout} username={username} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    {/* デフォルトはログイン画面へ */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}
 



export default App;
