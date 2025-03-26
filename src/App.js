// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MoldList from './components/MoldList';
import MoldCreate from './components/MoldCreate'; // Import 추가 (파일이 존재해야 함)
import MoldEdit from './components/MoldEdit';   // Import 추가 (파일이 존재해야 함)[[O
import SignUp from './components/SignUp'; // SignUp 컴포넌트 import 추가
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
    <Router basename="/mold/"> {/* basename prop이 추가되었습니다. */}
      <Routes>
        <Route path="/" element={session ? <Navigate to="/mold-list" replace /> : <Login />} />
        <Route path="/mold-list" element={session ? <MoldList /> : <Navigate to="/" replace />} />
        <Route path="/mold-create" element={<MoldCreate />} />
        <Route path="/signup" element={<SignUp />} /> {/* 회원가입 Route 추가 */
	<Route path="/mold-edit/:id" element={<MoldEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
