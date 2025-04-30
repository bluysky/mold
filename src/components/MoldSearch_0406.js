import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    CircularProgress,
    Typography,
} from '@mui/material';

function MoldSearch() {
    const [moldIdPrefix1, setMoldIdPrefix1] = useState('');
    const [moldIdPrefix2, setMoldIdPrefix2] = useState('');
    const [moldIdSuffix, setMoldIdSuffix] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [inspector, setInspector] = useState('');
    const [moldCount, setMoldCount] = useState('');
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let searchMoldId = '';
        if (moldIdPrefix1) {
            searchMoldId += moldIdPrefix1;
        }
        if (moldIdPrefix2) {
            searchMoldId += (searchMoldId ? '-' : '') + moldIdPrefix2;
        }
        if (moldIdSuffix) {
            searchMoldId += (searchMoldId ? '-' : '') + moldIdSuffix;
        }

        const query = {};
        if (searchMoldId) {
            query.mold_id = searchMoldId;
        }
        if (status) query.status = status;
        if (startDate && endDate) {
            query.status_date = `gte.${startDate}T00:00:00,lte.${endDate}T23:59:59`;
        }
        if (inspector) query.inspector = inspector;
        if (moldCount !== null && moldCount !== undefined && moldCount !== '') query.mold_count = moldCount;
        if (inspectionStatus) query.inspection_status = inspectionStatus;

        try {
            let supabaseQuery = supabase.from('molds').select('*');

            if (searchMoldId) {
                supabaseQuery = supabaseQuery.ilike('mold_id', `%${searchMoldId}%`);
            }

            supabaseQuery = supabaseQuery.match(
                Object.keys(query).reduce((obj, key) => {
                    if (key !== 'mold_id' && key !== 'status_date' && query[key] !== null && query[key] !== undefined && query[key] !== '') {
                        obj[key] = query[key];
                    }
                    return obj;
                }, {})
            );

            // if (query.status_date) {
            //
            //             con   supabaseQuery = supabaseQuery.filter('status_date', query.status_date);
            // }

            if (startDate && endDate) {
                supabaseQuery = supabaseQuery
                    .gte('status_date', `${startDate}T00:00:00Z`)
                    .lte('status_date', `${endDate}T23:59:59Z`);
            }
            const { data, error: fetchError } = await supabaseQuery;

            if (fetchError) {
                throw fetchError;
            }
            setSearchResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
    };

    const prefix1Options = [
        { value: '', label: t('Select') },
        { value: 'MEB-', label: 'MEB-' },
        { value: 'E603C-', label: 'E603C-' },
    ];

    const prefix2Options = [
        { value: '', label: t('Select') },
        { value: 'ANM', label: 'ANM' },
        { value: 'CNM', label: 'CNM' },
    ];

    const inspectionStatusOptions = [
        { value: '', label: t('All') },
        { value: '양호', label: t('Good') },
        { value: '불량', label: t('Bad') },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h5">{t('Mold Search')}</Typography>
                <Select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ko">한국어</MenuItem>
                </Select>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
                    <FormControl>
                        <InputLabel id="mold-id-prefix1-label">{t('Prefix 1')}</InputLabel>
                        <Select
                            labelId="mold-id-prefix1-label"
                            id="moldIdPrefix1"
                            value={moldIdPrefix1}
                            onChange={(e) => setMoldIdPrefix1(e.target.value)}
                            label={t('Prefix 1')}
                        >
                            {prefix1Options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <span>-</span> {/* 하이픈 추가 */}
                    <FormControl>
                        <InputLabel id="mold-id-prefix2-label">{t('Prefix 2')}</InputLabel>
                        <Select
                            labelId="mold-id-prefix2-label"
                            id="moldIdPrefix2"
                            value={moldIdPrefix2}
                            onChange={(e) => setMoldIdPrefix2(e.target.value)}
                            label={t('Prefix 2')}
                        >
                            {prefix2Options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <span>-</span>
                    <TextField
                        label={t('Suffix')}
                        value={moldIdSuffix}
                        onChange={(e) => setMoldIdSuffix(e.target.value)}
                        style={{ flexGrow: 1 }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
                    <TextField
                        label={t('Start Date')}
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label={t('End Date')}
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button onClick={handleClearDates}>{t('Clear Dates')}</Button>
                </div>
                <TextField
                    label={t('Status')}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ marginBottom: '16px' }}
                />
                {/* <TextField // statusDate 필드 제거 */}
                {/* label={t('Status Date/Time')}*/}
                {/* type="datetime-local"*/}
                {/* value={statusDate}*/}
                {/* onChange={(e) => setStatusDate(e.target.value)}*/}
                {/* fullWidth*/}
                {/* margin="normal"*/}
                {/* InputLabelProps={{*/}
                {/* shrink: true,*/}
                {/* }}*/}
                {/* style={{ marginBottom: '16px' }}*/}
                {/* /> */}
                <TextField
                    label={t('Inspector')}
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ marginBottom: '16px' }}
                />
                <TextField
                    label={t('Mold Count')}
                    type="number"
                    value={moldCount}
                    onChange={(e) => setMoldCount(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ marginBottom: '16px' }}
                />
                <FormControl fullWidth margin="normal" style={{ marginBottom: '16px' }}>
                    <InputLabel id="inspection-status-label">{t('Inspection Status')}</InputLabel>
                    <Select
                        labelId="inspection-status-label"
                        id="inspectionStatus"
                        value={inspectionStatus}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                        label={t('Inspection Status')}
                    >
                        {inspectionStatusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    {t('Search')}
                </Button>
            </form>

            {/* "뒤로" 버튼 추가 및 onClick 핸들러 수정 */}
            <Button onClick={handleGoBack} style={{ marginTop: '20px' }}>
                {t('Back')}
            </Button>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {searchResults.length > 0 && (
                <Paper sx={{ mt: 3 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('ID')}</TableCell>
                                    <TableCell>{t('Mold ID')}</TableCell>
                                    <TableCell>{t('Status')}</TableCell>
                                    <TableCell>{t('Status Date')}</TableCell>
                                    <TableCell>{t('Inspection Status')}</TableCell>
                                    <TableCell>{t('Inspector')}</TableCell>
                                    <TableCell>{t('Mold Count')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchResults.map((mold) => (
                                    <TableRow key={mold.id}>
                                        <TableCell>{mold.id}</TableCell>
                                        <TableCell>{mold.mold_id}</TableCell>
                                        <TableCell>{mold.status}</TableCell>
                                        <TableCell>{mold.status_date}</TableCell>
                                        <TableCell>{mold.inspection_status}</TableCell>
                                        <TableCell>{mold.inspector}</TableCell>
                                        <TableCell>{mold.mold_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
            {searchResults.length === 0 && !loading && !error && (
                <p>{t('No search results.')}</p>
            )}
        </div>
    );
}

export default MoldSearch;
