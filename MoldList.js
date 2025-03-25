// src/components/MoldList.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function MoldList() {
  const [molds, setMolds] = useState([]);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // 로그인 페이지로 이동
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('molds').delete().eq('id', id);
    if (error) {
      console.error('몰드 삭제 실패:', error);
    } else {
      setMolds(molds.filter((mold) => mold.id !== id));
    }
  };

  return (
    <div>
      <h2>몰드 목록</h2>
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
            <th>삭제</th>
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
              <td>
                <button onClick={() => handleDelete(mold.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default MoldList;
