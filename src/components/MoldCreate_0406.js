// src/components/MoldCreate.js

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function MoldCreate() {
    const [moldId, setMoldId] = useState('');
    const [status, setStatus] = useState('');
    const [status_date, setstatus_date] = useState(''); // 상태 날짜 상태 추가
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [inspector, setInspector] = useState('');
    const [moldCount, setMoldCount] = useState(0);
    const [UnitID, setUnitId] = useState(''); // Changed to string, consistent with other text inputs.  Important!
    const navigate = useNavigate();
    const [error, setError] = useState(null);



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('status_date:', status_date);
        const { error: insertError } = await supabase.from('molds').insert([ // Renamed error to insertError
            {
                mold_id: moldId,
                status: status,
                status_date: status_date,
                inspection_status: inspectionStatus,
                inspector: inspector,
                mold_count: moldCount,
                unit_id: UnitID, // Changed to UnitID to match state variable
            },
        ]);
        if (insertError) { // Use insertError here
            console.error('몰드 추가 실패:', insertError);
            setError(insertError.message);
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
                        type="datetime-local"
                        value={status_date}
                        onChange={(e) => setstatus_date(e.target.value)}
                        id="status_date"
                        name="status_date"
                    />
                </div>
                <div>
                    <label htmlFor="inspectionStatus">inspectionStatus:</label>
                    <select value={inspectionStatus} onChange={(e) => setInspectionStatus(e.target.value)}
                        id="inspectionStatus" name="inspectionStatus">
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
                <div>
                    <label htmlFor="UnitID">장비번호:</label>
                    <input
                        type="text"
                        placeholder="장비 번호"
                        value={UnitID}
                        onChange={(e) => setUnitId(e.target.value)} // Corrected setUnitId
                        id="UnitID"
                        name="UnitID"
                    />
                </div>
                <button type="submit">추가</button>
            </form>
        </div>
    );
}

export default MoldCreate;
