// 로그인 컴포넌트 (Login.js)
import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // supabaseClient.js에서 supabase 클라이언트 초기화

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // 로그인 성공 시, 사용자 정보 저장 및 몰드 조회 페이지로 이동
      console.log('로그인 성공:', user);
      window.location.href = '/mold-list'; // 몰드 조회 페이지로 이동
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;

// 몰드 조회 컴포넌트 (MoldList.js)
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function MoldList() {
  const [molds, setMolds] = useState([]);

  useEffect(() => {
    async function fetchMolds() {
      const { data, error } = await supabase.from('molds').select('*');
      if (error) {
        console.error('몰드 데이터 가져오기 실패:', error);
      } else {
        setMolds(data);
      }
    }
    fetchMolds();
  }, []);

  return (
    <div>
      <h1>몰드 목록</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>몰드 ID</th>
            <th>상태</th>
            <th>상태 날짜</th>
            <th>검사 상태</th>
            <th>검사자</th>
            <th>소유자 ID</th>
            <th>몰드 카운트</th>
          </tr>
        </thead>
        <tbody>
          {molds.map((mold) => (
            <tr key={mold.id}>
              <td>{mold.id}</td>
              <td>{mold.mold_id}</td>
              <td>{mold.status}</td>
              <td>{mold.status_date}</td>
              <td>{mold.inspection_status}</td>
              <td>{mold.inspector}</td>
              <td>{mold.owner_id}</td>
              <td>{mold.mold_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MoldList;
