import React from 'react';

// ヘッダー部分を担当するコンポーネント
function Header() {
    // ヘッダー全体のスタイル設定
    const headerStyle = {
        textAlign: 'center', // テキストを中央寄せ
        // 上下の余白を設定
    };

    // タイトル文字のスタイル設定
    const titleStyle = {
        color: '#190', 
        fontSize: '5.0rem', 
    };

     const titleStyle2 = {
        color: '#190', 
        fontSize: '2.0rem', 
    };

    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>掃除管理アプリ</h1>
            <h2 style={titleStyle2}>Let's start cleaning!</h2>
        </header>
    );
}

export default Header;
