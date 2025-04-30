// src/components/MoldEdit.js

import React, {useState, useEffect} from 'react';
import {supabase} from '../supabaseClient';
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import i18n from '../i18n';
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
    // status_date 상태를 Date 객체로 관리합니다.
    const [statusDate, setStatusDate] = useState(null);
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [inspector, setInspector] = useState('');
    const [moldCount, setMoldCount] = useState(0);
    const [unitId, setUnitId] = useState('');
    const navigate = useNavigate();
    const {t} = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    useEffect(() => {
        async function fetchMold() {
            const {data, error} = await supabase.from('molds').select('*').eq('id', id).single();
            if (error) {
                console.error(t('Failed to fetch mold data:'), error);
            } else {
                setMoldId(data.mold_id);
                setStatus(data.status);
                // 불러온 status_date가 있으면 Date 객체로 변환하여 상태에 저장
                setStatusDate(data.status_date ? new Date(data.status_date) : null);
                setInspectionStatus(data.inspection_status);
                setInspector(data.inspector);
                setMoldCount(data.mold_count);
                setUnitId(data.unit_id === null ? '' : data.unit_id);
            }
        }

        fetchMold();
    }, [id, t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const now = new Date(); // 현재 날짜 및 시간 (사용자 로컬 시간 기준)
        const nowISO = now.toISOString(); // 서버에 저장하기 위해 UTC 형식으로 변환

        const {error} = await supabase
            .from('molds')
            .update({
                mold_id: moldId,
                status: status,
                status_date: nowISO, // 수정 시 현재 로컬 시간을 UTC 형식으로 저장
                inspection_status: inspectionStatus,
                inspector: inspector,
                mold_count: moldCount,
                unit_id: unitId,
            })
            .eq('id', id);
        if (error) {
            console.error(t('Failed to update mold:'), error);
        } else {
            navigate('/mold-list');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={{maxWidth: 400, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 4}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>{t('Edit Mold')}</Typography>
                <Select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)} size="small"
                        id="language-select"
                        name="language-select"
                >
                    <MenuItem value="en" id="en-option">English</MenuItem>
                    <MenuItem value="ko" id="ko-option">한국어</MenuItem>
                </Select>
            </Box>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('Mold ID')}
                        value={moldId}
                        onChange={(e) => setMoldId(e.target.value)}
                        id="moldId"
                        name="moldId"
                        InputLabelProps={{ htmlFor: 'moldId' }}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="status">{t('Status')}</InputLabel>
                    <Select
                        labelId="status-label"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        id="status"
                        name="status"
                    >
                        <MenuItem value="">{t('Status')}</MenuItem>
                        <MenuItem value="Mounted">{t('Mounted')}</MenuItem>
                        <MenuItem value="Received">{t('Received')}</MenuItem>
                        <MenuItem value="Shipped">{t('Shipped')}</MenuItem>
                        {/* 필요한 상태 옵션 추가 */}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('Status Date')}
                        // statusDate가 있으면 사용자의 로컬 시간 형식으로 표시
                        value={statusDate ? statusDate.toLocaleString() : ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        id="status_date"
                        name="Status_date"
                        InputLabelProps={{ htmlFor: 'Status_date' }}
                        helperText={t('Updated automatically on save')}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="inspectionStatus">{t('Inspection Status')}</InputLabel>
                    <Select
                        labelId="inspection-status-label"
                        value={inspectionStatus}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                        id="inspectionStatus"
                        name="inspectionStatus"
                    >
                        <MenuItem value="">{t('Inspection Status')}</MenuItem>
                        <MenuItem value="WAITING">{t('WAITING')}</MenuItem>
                        <MenuItem value="PASS">{t('PASS')}</MenuItem>
                        <MenuItem value="FAIL">{t('FAIL')}</MenuItem>
                        {/* 필요한 검사 상태 옵션 추가 */}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('Inspector')}
                        value={inspector}
                        onChange={(e) => setInspector(e.target.value)}
                        id="inspector"
                        name="inspector"
                        InputLabelProps={{ htmlFor: 'inspector' }}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        type="number"
                        label={t('Mold Count')}
                        value={moldCount}
                        onChange={(e) => setMoldCount(e.target.value)}
                        id="moldCount"
                        name="moldCount"
                        InputLabelProps={{ htmlFor: 'moldCount' }}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label={t('UnitID')}
                        value={unitId}
                        onChange={(e) => setUnitId(e.target.value)}
                        id="unitId"
                        name="unitId"
                        InputLabelProps={{ htmlFor: 'unitId' }}
                    />
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button onClick={handleGoBack} variant="outlined" fullWidth>
                        {t('Back')}
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" fullWidth>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {t('Update')}
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default MoldEdit;