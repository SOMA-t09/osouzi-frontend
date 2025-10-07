import React from 'react';

function OsouziHome({ onLogout }) {
    const buttonStyle = {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        margin: '20px auto',
        display: 'block',
    };

    return (
        <div>
            <h2>ようこそ！お掃除アプリへ</h2>
            <button style={buttonStyle} onClick={onLogout}>
                ログアウト
            </button>
        </div>
    );
}

export default OsouziHome;
