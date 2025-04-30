import React, {useCallback, useEffect, useState} from 'react';
import {supabase} from '../supabaseClient';
import {useTranslation} from 'react-i18next';
import i18n from '../i18n'; // i18n 객체 임포트 확인
import {Link, useNavigate} from 'react-router-dom';
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
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@mui/material';

function MoldSearch() {
    const [moldIdPrefix1, setMoldIdPrefix1] = useState('');
    const [moldIdPrefix2, setMoldIdPrefix2] = useState('');
    const [moldIdSuffix, setMoldIdSuffix] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [inspector, setInspector] = useState('');
    const [unitId, setUnitId] = useState('');
    const [moldCount, setMoldCount] = useState('');
    const [moldCountOperator, setMoldCountOperator] = useState(''); // Mold Count 연산자 상태 추가
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {t} = useTranslation(); // useTranslation 훅 사용 확인
    const navigate = useNavigate();
    const [molds, setMolds] = useState([]);
    const [loadingSession, setLoadingSession] = useState(true); // 세션 로딩 상태
    const [session, setSession] = useState(null); // 세션 상태

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const fetchMolds = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const {data, error} = await supabase.from('molds').select('*');
            if (error) throw error;
            setMolds(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        const getActiveSession = async () => {
            const {data: {session: currentSession}} = await supabase.auth.getSession();
            setSession(currentSession);
            setLoadingSession(false);
        };

        getActiveSession();
    }, []);

    useEffect(() => {
        if (!loadingSession && !session) {
            navigate('/login');
        }
    }, [loadingSession, session, navigate]);

    useEffect(() => {
        if (session) {
            fetchMolds();
        }
    }, [session, fetchMolds]);

    const handleNewMoldIdSuffixChange = (event) => {
        const inputValue = event.target.value.toUpperCase();
        if (inputValue === 'M') {
            setMoldIdSuffix('MEB-');
        } else if (inputValue === 'E') {
            setMoldIdSuffix('E603C-');
        } else if (inputValue === 'A') {
            setMoldIdSuffix('ANM');
        } else if (inputValue === 'C') {
            setMoldIdSuffix('CNM');
        } else {
            setMoldIdSuffix(inputValue);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let searchMoldIdParts = [];
        if (moldIdPrefix1) searchMoldIdParts.push(moldIdPrefix1);
        if (moldIdPrefix2) searchMoldIdParts.push(moldIdPrefix2);
        if (moldIdSuffix) searchMoldIdParts.push(moldIdSuffix);
        const searchMoldId = searchMoldIdParts.filter(Boolean).join('-');

        const query = {};
        if (searchMoldId) query.mold_id = searchMoldId;
        if (status) query.status = status;
        if (inspector) query.inspector = inspector;
        if (inspectionStatus) query.inspection_status = inspectionStatus;
        if (unitId) query.unit_id = unitId;

        try {
            let supabaseQuery = supabase.from('molds').select('*');

            if (searchMoldId) supabaseQuery = supabaseQuery.ilike('mold_id', `%${searchMoldId}%`);

            supabaseQuery = supabaseQuery.match(
                Object.keys(query).reduce((obj, key) => {
                    if (key !== 'mold_id' && key !== 'status_date' && query[key] !== null && query[key] !== undefined && query[key] !== '') {
                        obj[key] = query[key];
                    }
                    return obj;
                }, {})
            );

            if (startDate && endDate) {
                supabaseQuery = supabaseQuery
                    .gte('status_date', `${startDate}T00:00:00Z`)
                    .lte('status_date', `${endDate}T23:59:59Z`);
            }

            if (moldCount && moldCountOperator) {
                switch (moldCountOperator) {
                    case 'eq':
                        supabaseQuery = supabaseQuery.eq('mold_count', moldCount);
                        break;
                    case 'gt':
                        supabaseQuery = supabaseQuery.gt('mold_count', moldCount);
                        break;
                    case 'lt':
                        supabaseQuery = supabaseQuery.lt('mold_count', moldCount);
                        break;
                    case 'gte':
                        supabaseQuery = supabaseQuery.gte('mold_count', moldCount);
                        break;
                    case 'lte':
                        supabaseQuery = supabaseQuery.lte('mold_count', moldCount);
                        break;
                    default:
                        // 연산자가 선택되지 않은 경우 moldCount 조건은 무시
                        break;
                }
            } else if (moldCount && !moldCountOperator) {
                // 연산자가 선택되지 않았지만 moldCount 값이 있는 경우 기본적으로 같음(=)으로 처리하거나 사용자에게 알림
                supabaseQuery = supabaseQuery.eq('mold_count', moldCount); // 또는 setError("Mold Count 연산자를 선택해주세요.");
            }

            const {data: fetchedData, error: fetchError} = await supabaseQuery;

            if (fetchError) throw fetchError;

            // 검색 결과를 updated_at 기준으로 내림차순 정렬
            const sortedResults = [...fetchedData].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setSearchResults(sortedResults);

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

    const handleDelete = useCallback(async (id) => {
        console.log('삭제 버튼 클릭됨, 삭제할 ID:', id); // 추가된 로그
        if (window.confirm(t('Are you sure you want to delete this mold?'))) {
            setLoading(true);
            setError(null);
            try {
                const {error} = await supabase.from('molds').delete().eq('id', id);
                console.log('Supabase 삭제 요청 결과:', {error}); // 추가된 로그
                if (error) throw error;
                setSearchResults(searchResults.filter((mold) => mold.id !== id));
                setMolds(molds.filter((mold) => mold.id !== id));
            } catch (err) {
                setError(err.message);
                console.error('삭제 오류 발생:', err.message); // 추가된 로그
            } finally {
                setLoading(false);
            }
        }
    }, [supabase, t, searchResults, molds]);

    const prefix1Options = [
        {value: '', label: t('Select')},
        {value: 'MEB', label: 'MEB-'},
        {value: 'E603C', label: 'E603C-'},
    ];

    const prefix2Options = [
        {value: '', label: t('Select')},
        {value: 'ANM', label: 'ANM-'},
        {value: 'CNM', label: 'CNM-'},
    ];


    const inspectionStatusOptions = [
        {value: '', label: t('Select')},
        {value: '대기', label: t('WAITING')},
        {value: '합격', label: t('PASS')},
        {value: '불합격', label: t('FAIL')},

    ];

    const statusOptions = [
        {value: '', label: t('Select')},
        {value: 'Mounted', label: t('Mounted')},
        {value: 'Received', label: t('Received')},
        {value: 'Shipped', label: t('Shipped')},
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleCancelSearch = () => {
        setMoldIdPrefix1('');
        setMoldIdPrefix2('');
        setMoldIdSuffix('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setInspector('');
        setUnitId('');
        setMoldCount('');
        setMoldCountOperator(''); // 연산자 상태도 초기화
        setInspectionStatus('');
        setSearchResults([]);
        setError(null);
    };

    const handleMoldCountOperatorChange = (event) => {
        setMoldCountOperator(event.target.value);
    };

    if (loadingSession) return <CircularProgress/>;
    if (!session) return navigate('/login');

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <Typography variant="h5">{t('Mold Search')}</Typography>
                <Select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ko">한국어</MenuItem>
                </Select>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center'}}>
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
                    <span>-</span>
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
                        label={t('WILD KEY MEB-CNM-16')}
                        value={moldIdSuffix}
                        onChange={handleNewMoldIdSuffixChange} // 자동 완성 기능 적용
                        style={{flexGrow: 1}}
                    />
                </div>
                {/* 날짜 필드 유지 */}
                <div style={{display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center'}}>
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
                {/* Mold Count 필드와 연산자 선택 유지 */}
                <div style={{display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center'}}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="mold-count-operator"
                            name="moldCountOperator"
                            value={moldCountOperator}
                            onChange={handleMoldCountOperatorChange}
                            style={{flexDirection: 'row'}}
                        >
                            <FormControlLabel value="eq" control={<Radio size="small"/>} label="="/>
                            <FormControlLabel value="gt" control={<Radio size="small"/>} label=">"/>
                            <FormControlLabel value="lt" control={<Radio size="small"/>} label="<"/>
                            <FormControlLabel value="gte" control={<Radio size="small"/>} label=">="/>
                            <FormControlLabel value="lte" control={<Radio size="small"/>} label="<="/>
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        label={t('Mold Count')}
                        type="number"
                        value={moldCount}
                        onChange={(e) => setMoldCount(e.target.value)}
                        style={{flexGrow: 1}}
                    />
                </div>
                {/* 나머지 필드 유지 */}
                <FormControl fullWidth margin="normal" style={{marginBottom: '16px'}}>
                    <InputLabel id="status-label">{t('Status')}</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label={t('Status')}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={t('Inspector')}
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{marginBottom: '16px'}}
                />
                <FormControl fullWidth margin="normal" style={{marginBottom: '16px'}}>
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
                <TextField
                    label={t('Unit ID')}
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{marginBottom: '16px'}}
                />
                <div style={{display: 'flex', gap: '10px'}}>
                    <Button type="submit" variant="contained" color="primary">
                        {t('Search')}
                    </Button>
                    <Button type="button" onClick={handleCancelSearch}>
                        {t('Cancel')}
                    </Button>
                </div>
            </form>

            <Button onClick={handleGoBack} style={{marginTop: '20px'}}>
                {t('Back')}
            </Button>

            {loading && <CircularProgress/>}
            {error && <Alert severity="error">{error}</Alert>}

            {searchResults.length > 0 && (
                <Paper sx={{mt: 3}}>
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
                                    <TableCell>{t('Unit ID')}</TableCell>
                                    <TableCell>{t('Actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchResults.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).map((mold) => (
                                    <TableRow
                                        key={mold.id}
                                        sx={{
                                            ...(mold.status === 'Mounted' && {
                                                backgroundColor: '#e6ffe6', // 연한 초록색
                                            }),
                                            ...(mold.status === 'Received' && {
                                                backgroundColor: '#ffe6e6', // 연한 빨간색
                                            }),
                                            ...(mold.status === 'Shipped' && {
                                                backgroundColor: '#fffacd', // 연한 노란색
                                            }),
                                        }}
                                    >
                                        <TableCell>{mold.id}</TableCell>
                                        <TableCell>{mold.mold_id}</TableCell>
                                        <TableCell>{t(mold.status.charAt(0).toUpperCase() + mold.status.slice(1))}</TableCell> {/* 상태 번역 */}
                                        <TableCell>{mold.status_date}</TableCell>
                                        <TableCell>{t(mold.inspection_status)}</TableCell> {/* 검사 상태*/}
                                        <TableCell>{mold.inspector}</TableCell>
                                        <TableCell>{mold.mold_count}</TableCell>
                                        <TableCell>{mold.unit_id}</TableCell>
                                        <TableCell>
                                            <div style={{display: 'flex', gap: '8px'}}>
                                                <Button variant="outlined" color="secondary"
                                                        onClick={() => handleDelete(mold.id)} size="small">
                                                    {t('Delete')}
                                                </Button>
                                                <Link to={`/mold-edit/${mold.id}`} style={{textDecoration: 'none'}}>
                                                    <Button variant="outlined" color="primary" size="small">
                                                        {t('Edit')}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
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