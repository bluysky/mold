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
  const [error, setError] = useState(null);

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
      setError(error.message);
    } else {
      navigate('/mold-list');
    }
  };

  return (
    <div>
      <h2>몰드 추가</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="moldId">몰드 ID:</label>
          <input
            type="text"
            placeholder="몰드 ID"
            value={moldId}
            onChange={(e) => setMoldId(e.target.value)}
            id="moldId"
            name="moldId"
          />
        </div>
        <div>
          <label htmlFor="status">상태:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} id="status" name="status">
            <option value="">상태 선택</option>
            <option value="Received">Received</option>
            <option value="Shipped">Shipped</option>
            {/* 필요한 상태 옵션 추가 */}
          </select>
        </div>
        <div>
          <label htmlFor="inspectionStatus">검사 상태:</label>
          <select
            value={inspectionStatus}
            onChange={(e) => setInspectionStatus(e.target.value)}
            id="inspectionStatus"
            name="inspectionStatus"
          >
            <option value="">검사 상태 선택</option>
            <option value="WAITING">WAITING</option>
            <option value="FAIL">FAIL</option>
            {/* 필요한 검사 상태 옵션 추가 */}
          </select>
        </div>
        <div>
          <label htmlFor="inspector">검사자:</label>
          <input
            type="text"
            placeholder="검사자"
            value={inspector}
            onChange={(e) => setInspector(e.target.value)}
            id="inspector"
            name="inspector"
          />
        </div>
        <div>
          <label htmlFor="moldCount">몰드 카운트:</label>
          <input
            type="number"
            placeholder="몰드 카운트"
            value={moldCount}
            onChange={(e) => setMoldCount(parseInt(e.target.value, 10) || 0)}
            id="moldCount"
            name="moldCount"
          />
        </div>
        <button type="submit">추가</button>
      </form>
    </div>
  );
}

export default MoldCreate;
