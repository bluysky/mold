// src/components/MoldEdit.js

import React, {useState, useEffect} from 'react';
import {supabase} from '../supabaseClient';
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next'; // useTranslation 훅 import
import i18n from '../i18n'; // i18n 인스턴스 import
import {
    TextField,
    Select,
    MenuItem,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';

function MoldEdit() {
    const {id} = useParams();
    const [moldId, setMoldId] = useState('');
    const [status, setStatus] = useState('');
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [inspector, setInspector] = useState('');
    const [moldCount, setMoldCount] = useState(0);
    const [unitId, setUnitId] = useState(null); // 수정: 상태 변수 이름 및 초기값
    const navigate = useNavigate();
    const {t} = useTranslation(); // useTranslation 훅 사용
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };
    useEffect(() => {
        async function fetchMold() {
            const {data, error} = await supabase.from('molds').select('*').eq('id', id).single();
            if (error) {
                console.error(t('Failed to fetch mold data:'), error); // 번역 적용
            } else {
                setMoldId(data.mold_id);
                setStatus(data.status);
                setInspectionStatus(data.inspection_status);
                setInspector(data.inspector);
                setMoldCount(data.mold_count);
                setUnitId(data.unit_id);
            }
        }

        fetchMold();
    }, [id, t]); // t 의존성 추가

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
                unit_id: unitId, // <--- 수정: 상태 변수 이름과 일치
            })
            .eq('id', id);
        if (error) {
            console.error(t('Failed to update mold:'), error); // 번역 적용
        } else {
            navigate('/mold-list');
        }
    };

    return (
        <Box sx={{maxWidth: 400, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 4}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>{t('Edit Mold')}</Typography> {/* 번역 적용 */}
                <Select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)} size="small">
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ko">한국어</MenuItem>
                </Select>
            </Box>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('Mold ID')} // 번역 적용
                        value={moldId}
                        onChange={(e) => setMoldId(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="status-label">{t('Status')}</InputLabel> {/* 번역 적용 */}
                    <Select
                        labelId="status-label"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value="">{t('Select Status')}</MenuItem> {/* 번역 적용 */}
                        <MenuItem value="Received">{t('Received')}</MenuItem> {/* 번역 적용 */}
                        <MenuItem value="Shipped">{t('Shipped')}</MenuItem> {/* 번역 적용 */}
                        {/* 필요한 상태 옵션 추가 */}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="inspection-status-label">{t('Inspection Status')}</InputLabel> {/* 번역 적용 */}
                    <Select
                        labelId="inspection-status-label"
                        value={inspectionStatus}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                    >
                        <MenuItem value="">{t('Select Inspection Status')}</MenuItem> {/* 번역 적용 */}
                        <MenuItem value="WAITING">{t('WAITING')}</MenuItem> {/* 번역 적용 */}
                        <MenuItem value="FAIL">{t('FAIL')}</MenuItem> {/* 번역 적용 */}
                        {/* 필요한 검사 상태 옵션 추가 */}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('Inspector')} // 번역 적용
                        value={inspector}
                        onChange={(e) => setInspector(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type="number"
                        label={t('Mold Count')} // 번역 적용
                        value={moldCount}
                        onChange={(e) => setMoldCount(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('UnitID')} // 번역 적용
                        value={unitId} // <--- 수정: 상태 변수 이름과 일치
                        onChange={(e) => setUnitId(e.target.value)}
                    />
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth>{t('Update')}</Button> {/* 번역 적용 */}
            </form>
        </Box>
    );
}

export default MoldEdit;