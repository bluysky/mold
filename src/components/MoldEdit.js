// src/components/MoldEdit.js

import React, {useState, useEffect} from 'react';
import {supabase} from '../supabaseClient';
import {useNavigate, useParams} from 'react-router-dom';

function MoldEdit() {
    const {id} = useParams();
    const [moldId, setMoldId] = useState('');
    const [status, setStatus] = useState('');
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [inspector, setInspector] = useState('');
    const [moldCount, setMoldCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMold() {
            const {data, error} = await supabase.from('molds').select('*').eq('id', id).single();
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
        const {error} = await supabase
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
            console.error('mold edit 실패:', error);
        } else {
            navigate('/mold-list');
        }
    };
    
    return (
        <div>
            <h2>mold edit</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="moldId">mold ID:</label>
                    <input
                        type="text"
                        placeholder="mold ID"
                        value={moldId}
                        onChange={(e) => setMoldId(e.target.value)}
                        id="moldId"
                        name="moldId"
                    />
                </div>
                <div>
                    <label htmlFor="status">status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} id="status" name="status">
                        <option value="Received">Received</option>
                        <option value="Shipped">Shipped</option>
                        {/* 필요한 상태 옵션 추가 */}
                    </select>
                </div>
                <div>
                    <label htmlFor="inspectionStatus">Inspection Status:</label>
                    <select
                        value={inspectionStatus}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                        id="inspectionStatus"
                        name="inspectionStatus"
                    >
                        <option value="PASS">PASS</option>
                        <option value="WAITING">WAITING</option>
                        <option value="FAIL">FAIL</option>
                        {/* 필요한 Inspection Status 옵션 추가 */}
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
                    <label htmlFor="moldCount">mold count:</label>
                    <input
                        type="number"
                        placeholder="count"
                        value={moldCount}
                        onChange={(e) => setMoldCount(e.target.value)}
                        id="moldCount"
                        name="moldCount"
                    />
                </div>
                <button type="submit">edit</button>
            </form>
        </div>
    );
}

export default MoldEdit;
