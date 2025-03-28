// src/App.js
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp'; // SignUp 컴포넌트 import
import MoldList from './components/MoldList';
import MoldSearch from './components/MoldSearch';
import MoldCreate from './components/MoldCreate';
import MoldEdit from './components/MoldEdit';
import {supabase} from './supabaseClient';

function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <Router basename="/mold">
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace/>}/> {/* 초기 접속 시 /login으로 리다이렉트 */}
                <Route path="/login" element={<Login/>}/> {/* /login 경로에 Login 컴포넌트 연결 */}
                <Route path="/signup" element={<SignUp/>}/> {/* 회원가입 라우트 추가 */}
                <Route path="/mold-list" element={session ? <MoldList/> :
                    <Navigate to="/login" replace/>}/> {/* 로그인 안된 경우 /login으로 리다이렉트 */}
                <Route path="/mold-search" element={<MoldSearch/>}/>
                <Route path="/mold-create" element={<MoldCreate/>}/>
                <Route path="/mold-edit/:id" element={<MoldEdit/>}/>
            </Routes>
        </Router>
    );
}

export default App;

