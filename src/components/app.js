// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MoldList from './components/MoldList';
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
    <Router>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/mold-list" /> : <Login />} />
        <Route path="/mold-list" element={session ? <MoldList /> : <Navigate to="/" />} />
        <Route path="/mold-create" element={<MoldCreate />} />
        <Route path="/mold-edit/:id" element={<MoldEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
