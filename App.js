// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MoldList from './components/MoldList';
import MoldCreate from './components/MoldCreate';
import MoldEdit from './components/MoldEdit';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router basename="/mold">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} /> {/* 초기 접속 시 /login으로 리다이렉트 */}
        <Route path="/login" element={<Login />} /> {/* /login 경로에 Login 컴포넌트 연결 */}
        <Route path="/mold-list" element={session ? <MoldList /> : <Navigate to="/login" replace />} /> {/* 로그인 안된 경우 /login으로 리다이렉트 */}
        <Route path="/mold-create" element={<MoldCreate />} />
        <Route path="/mold-edit/:id" element={<MoldEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
