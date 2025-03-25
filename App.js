// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MoldList from './components/MoldList';
import MoldCreate from './components/MoldCreate';
import MoldEdit from './components/MoldEdit'; // Import 수정
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
    <Router basename="/mold"> {/* basename prop 추가 */}
      <Routes>
        <Route path="/" element={session ? <Navigate to="/mold-list" replace /> : <Login />} />
        <Route path="/mold-list" element={session ? <MoldList /> : <Navigate to="/" replace />} />
        <Route path="/mold-create" element={<MoldCreate />} />
        <Route path="/mold-edit/:id" element={<MoldEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
