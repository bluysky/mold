// src/components/MoldCreate.js

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function MoldCreate() {
  const [moldId, setMoldId] = useState('');
  const [status, setStatus] = useState('');
  const [inspectionStatus, setInspectionStatus] = useState('');
  const [inspector, setInspector] = useState('');
  const [moldCount, setMoldCount] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('molds').insert([
      {
        mold_id: moldId,
        status: status,
        inspection_status: inspectionStatus,
        inspector: inspector,
        mold_count: moldCount,
      },
    ]);
    if (error) {
      console.error('몰드 추가 실패:', error);
    } else {
      navigate('/mold-list');
    }
  };

  return (
    <div>
      <h2>몰드 추가</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="몰드 ID"
          value={moldId}
          onChange={(e) => setMoldId(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">상태 선택</option>
          <option value="Received">Received</option>
          <option value="Shipped">Shipped</option>
          {/* 필요한 상태 옵션 추가 */}
        </select>
        <select value={inspectionStatus} onChange={(e) => setInspectionStatus(e.target.value)}>
          <option value="">검사 상태 선택</option>
          <option value="WAITING">WAITING</option>
          <option value="FAIL">FAIL</option>
          {/* 필요한 검사 상태 옵션 추가 */}
        </select>
        <input
          type="text"
          placeholder="검사자"
          value={inspector}
          onChange={(e) => setInspector(e.target.value)}
        />
        <input
          type="number"
          placeholder="몰드 카운트"
          value={moldCount}
          onChange={(e) => setMoldCount(e.target.value)}
        />
        <button type="submit">추가</button>
      </form>
    </div>
  );
}

export default MoldCreate;
