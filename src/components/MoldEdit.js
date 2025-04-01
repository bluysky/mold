// src/components/MoldEdit.js

import React, {useState, useEffect} from 'react';
import {supabase} from '../supabaseClient';
import {useNavigate, useParams} from 'react-router-dom';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
} from '@mui/material';

const engToKorMap = {
    'Mold Edit': '몰드 수정',
    'Mold ID': '몰드 ID',
    'Status': '상태',
    'Inspection Status': '검사 상태',
    'Inspector': '검사자',
    'Mold Count': '몰드 카운트',
    'Edit': '수정',
    'Received': '접수됨',
    'Shipped': '배송됨',
    'PASS': '합격',
    'WAITING': '대기',
    'FAIL': '불합격',
};

function MoldEdit() {
    const {id} = useParams();
    const [moldId, setMoldId] = useState('');
    const [status, setStatus] = useState('');
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [inspector, setInspector] = useState('');
    const [moldCount, setMoldCount] = useState(0);
    const navigate = useNavigate();
    const [currentLanguage, setCurrentLanguage] = useState('en');

    useEffect(() => {
        async function fetchMold() {
            const {data, error} = await supabase.from('molds').select('*').eq('id', id).single();
            if (error) {
                console.error(translate('Failed to fetch mold data:'), error);
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
            console.error(translate('Failed to edit mold:'), error);
        } else {
            navigate('/mold-list');
        }
    };
    const toggleLanguage = () => {
        setCurrentLanguage(prevLang => (prevLang === 'ko' ? 'en' : 'en'));
    };

    const translate = (key) => {
        return engToKorMap[key] || key;
    };
    return (
        <Box sx={{maxWidth: 600, margin: '0 auto', mt: 4, p: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h5">{translate('Mold Edit')}</Typography>
                <Button variant="outlined" onClick={toggleLanguage}>
                    {currentLanguage === 'ko' ? 'English' : '한국어'}
                </Button>
            </Box>
            <form onSubmit={handleSubmit}>
                <TextField
                    label={translate('Mold ID')}
                    value={moldId}
                    onChange={(e) => setMoldId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="status-label">{translate('Status')}</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label={translate('Status')}
                    >
                        <MenuItem value="Received">{translate('Received')}</MenuItem>
                        <MenuItem value="Shipped">{translate('Shipped')}</MenuItem>
                        {/* 필요한 상태 옵션 추가 */}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="inspectionStatus-label">{translate('Inspection Status')}</InputLabel>
                    <Select
                        labelId="inspectionStatus-label"
                        id="inspectionStatus"
                        value={inspectionStatus}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                        label={translate('Inspection Status')}
                    >
                        <MenuItem value="PASS">{translate('PASS')}</MenuItem>
                        <MenuItem value="WAITING">{translate('WAITING')}</MenuItem>
                        <MenuItem value="FAIL">{translate('FAIL')}</MenuItem>
                        {/* 필요한 Inspection Status 옵션 추가 */}
                    </Select>
                </FormControl>
                <TextField
                    label={translate('Inspector')}
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label={translate('Mold Count')}
                    type="number"
                    value={moldCount}
                    onChange={(e) => setMoldCount(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{mt: 2}}>
                    {translate('Edit')}
                </Button>
            </form>
        </Box>
    );
}

export default MoldEdit;
