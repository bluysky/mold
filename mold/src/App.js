import React from 'react';
import logo from './logo.svg';
import './App.css';
import Auth from './components/Auth'; // Auth 컴포넌트 임포트

function App() {
  // 예시: 인증 상태를 관리하는 state
  const isAuthenticated = false; // 또는 true로 설정하여 테스트

  return (
    <div className="App">
      {isAuthenticated ? (
        // 인증된 경우 기존 App 컴포넌트 내용 렌더링
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      ) : (
        // 인증되지 않은 경우 Auth 컴포넌트 렌더링
        <Auth />
      )}
    </div>
  );
}

export default App;
