// src/components/MoldEdit.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

function MoldEdit() {
  const { id } = useParams();
  const [moldId, setMoldId] = useState('');
  const [status, setStatus] = useState('');
  const [inspectionStatus, setInspectionStatus] = useState('');
  const [inspector, setInspector] = useState('');
  const [moldCount, setMoldCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMold() {
      const { data, error } = await supabase.from('molds').select('*').eq('id', id).single();
      if (error) {
        console.error('몰드 데이터 가져오기 실패:', error);
      } else {
        setMoldId(data.mold_id);
        setStatus(data.status);
        setInspectionStatus(data.inspection_status);
        setInspector(data.inspector);
        setMoldCount(data.mold_count);
      }
    }
    fetchMold();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('molds')
      .update({
        mold_id: moldId,
        status: status,
        inspection_status: inspectionStatus,
        inspector: inspector,
        mold_count: moldCount,
      })
      .eq('id', id);
    if (error) {
      console.error('몰드 수정 실패:', error);
    } else {
      navigate('/mold-list');
    }
  };

  return (
    <div>
      <h2>몰드 수정</h2>
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
        <button type="submit">수정</button>
      </form>
    </div>
  );
}

export default MoldEdit;
