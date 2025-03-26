// src/components/MoldCreate.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function MoldCreate() {
  const [moldId, setMoldId] = useState('');
  const [status, setStatus] = useState('');
  const [status_date, setstatus_date] = useState(''); // 상태 날짜 상태 추가
  const [inspectionStatus, setInspectionStatus] = useState('');
  const [inspector, setInspector] = useState('');
  const [moldCount, setMoldCount] = useState(0);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

    // useEffect(() => {
    // 컴포넌트가 마운트될 때 현재 날짜와 시간을 기본값으로 설정
    // const now = new Date();
    // const formattedDateTime = formatDate(now);
    // setstatus_date(formattedDateTime);
    // }, []);

    // const formatDate = (date) => {
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');
    // const hours = String(date.getHours()).padStart(2, '0');
    // const minutes = String(date.getMinutes()).padStart(2, '0');
    // return `${year}-${month}-${day} ${hours}:${minutes}`; // 또는 원하는 포맷
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('status_date:', status_date); // 제출되는 status_date 값 확인
    const { error } = await supabase.from('molds').insert([
      {
        mold_id: moldId,
        status: status,
        status_date: status_date,
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
          <label htmlFor="status">stock status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} id="status" name="status">
            <option value="Received">Received</option>
            <option value="Shipped">Shipped</option>
            {/* 필요한 상태 옵션 추가 */}
          </select>
        </div>
        <div>
          <label htmlFor="status_date">상태 날짜/시간:</label>
          <input
            type="datetime-local" // 직접 날짜와 시간을 선택할 수 있는 input 타입 사용
            value={status_date}
            onChange={(e) => setstatus_date(e.target.value)}
            id="status_date"
            name="status_date"
          />
        </div>
        <div>
          <label htmlFor="inspectionStatus">inspectionStatus:</label>
          <select value={inspectionStatus} onChange={(e) => setInspectionStatus(e.target.value)} id="inspectionStatus" name="inspectionStatus">
            <option value="WAITING">WAITING</option>
            <option value="PASS">PASS</option>
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
