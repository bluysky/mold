// src/components/MoldList.js

import React, {useState, useEffect, useCallback} from 'react';
import {supabase} from '../supabaseClient';
import {useNavigate, Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import {
    Paper,
    Button,
    CircularProgress,
    Alert,
    Typography,
    TextField,
    useMediaQuery,
    useTheme,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import {styled} from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({theme}) => {
    const isSmallScreen = theme.breakpoints.down('sm');
    return {
        [`&.owner-id`]: {
            display: 'table-cell',
            [isSmallScreen]: {
                display: 'none',
            },
        },
    };
});

const StyledTableRow = styled(TableRow)(() => ({}));

function MoldList() {
    const [molds, setMolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [newMoldId, setNewMoldId] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newStatusDate, setNewStatusDate] = useState('');
    const [newInspectionStatus, setNewInspectionStatus] = useState('');
    const [newInspector, setNewInspector] = useState('');
    // const [newOwnerId, setNewOwnerId] = useState('');
    const [newMoldCount, setNewMoldCount] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchMolds = useCallback(async () => {
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
        fetchMolds();
    }, [fetchMolds]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const handleDelete = async (id) => {
        try {
            const {error} = await supabase.from('molds').delete().eq('id', id);
            if (error) throw error;
            setMolds(molds.filter((mold) => mold.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddNewClick = () => {
        setIsAddingNew(true);
    };

    const handleCancelAdd = () => {
        setIsAddingNew(false);
        setNewMoldId('');
        setNewStatus('');
        setNewStatusDate('');
        setNewInspectionStatus('');
        setNewInspector('');
        // setNewOwnerId('');
        setNewMoldCount('');
    };

    const handleSaveNewMold = async () => {
        if (!newMoldId) {
            alert(t('Please enter Mold ID.'));
            return;
        }
        try {
            const {data: session, error: sessionError} = await supabase.auth.getSession();
            if (sessionError || !session?.session?.user?.id) {
                alert(t('Please log in to continue.'));
                return;
            }
            const currentUserId = session.session.user.id;
            const {error} = await supabase.from('molds').insert([
                {
                    mold_id: newMoldId,
                    status: newStatus,
                    status_date: newStatusDate,
                    inspection_status: newInspectionStatus,
                    inspector: newInspector,
                    owner_id: currentUserId,
                    mold_count: parseInt(newMoldCount, 10) || 0,
                },
            ]);
            if (error) throw error;
            handleCancelAdd();
            fetchMolds();
            alert(t('New mold added successfully.'));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSearchClick = () => {
        navigate('/mold-search');
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h5">{t('Mold List')}</Typography>
                <Select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ko">한국어</MenuItem>
                </Select>
            </div>
            <Button variant="contained" color="primary" onClick={handleAddNewClick} style={{marginBottom: '10px'}}>
                {t('Add New Mold')}
            </Button>
            <Button variant="contained" color="primary" onClick={handleSearchClick} style={{ marginBottom: '10px' }}>
                {t('Search Molds')}
            </Button>
            {isAddingNew && (
                <Paper style={{padding: '15px', marginBottom: '10px'}}>
                    <Typography variant="h6">{t('New Mold')}</Typography>
                    <TextField  label={t('Mold ID')}
                        value={newMoldId}
                        onChange={(e) => setNewMoldId(e.target.value)}
                        fullWidth
                        margin="normal"
                        id="newMoldId"
                        name="newMoldId"
                    />
                    <Select
                        label={t('Status')}
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        fullWidth
                        margin="normal"
                        id="newStatus"
                        name="newStatus"
                        labelId="status-label"
                    >
                        <MenuItem value="Received">{t('Received')}</MenuItem>
                        <MenuItem value="Shipped">{t('Shipped')}</MenuItem>
                        <MenuItem value="WAITING">{t('WAITING')}</MenuItem>
                        <MenuItem value="PASS">{t('PASS')}</MenuItem>
                        <MenuItem value="FAIL">{t('FAIL')}</MenuItem>
                        {/* 필요한 상태 옵션 추가 */}
                    </Select>
                    <TextField
                        label={t('Status Date/Time')}
                        type="datetime-local"
                        value={newStatusDate}
                        onChange={(e) => setNewStatusDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{shrink: true}}
                        id="newStatusDate"
                        name="newStatusDate"
                    />
                    <Select
                        label={t('Inspection Status')}
                        value={newInspectionStatus}
                        onChange={(e) => setNewInspectionStatus(e.target.value)}
                        fullWidth
                        margin="normal"
                        id="newInspectionStatus"
                        name="newInspectionStatus"
                    >
                        <MenuItem value="WAITING">{t('WAITING')}</MenuItem>
                        <MenuItem value="PASS">{t('PASS')}</MenuItem>
                        <MenuItem value="FAIL">{t('FAIL')}</MenuItem>
                        {/* 필요한 검사 상태 옵션 추가 */}
                    </Select>
                    <TextField
                        label={t('Inspector')}
                        value={newInspector}
                        onChange={(e) => setNewInspector(e.target.value)}
                        fullWidth
                        margin="normal"
                        id="newInspector"
                        name="newInspector"
                    />
                    <TextField
                        label={t('Mold Count')}
                        type="number"
                        value={newMoldCount}
                        onChange={(e) => setNewMoldCount(e.target.value)}
                        fullWidth
                        margin="normal"
                        id="newMoldCount"
                        name="newMoldCount"
                    />
                    <Button variant="contained" color="primary" onClick={handleSaveNewMold}
                            style={{marginRight: '10px'}}>
                        {t('Save')}
                    </Button>
                    <Button variant="outlined" onClick={handleCancelAdd}>
                        {t('Cancel')}
                    </Button>
                </Paper>
            )}

            {isMobile ? (
                molds.map((mold) => (
                    <Paper key={mold.id} style={{margin: '10px', padding: '15px'}}>
                        <Typography variant="subtitle1">{t('Mold ID')}: {mold.mold_id}</Typography>
                        <Typography variant="body2">{t('Status')}: {mold.status}</Typography>
                        <Typography variant="body2">{t('Status Date')}: {mold.status_date}</Typography>
                        <Typography
                            variant="body2">{t('Inspection Status')}: {mold.inspection_status}</Typography>
                        <Typography variant="body2">{t('Inspector')}: {mold.inspector}</Typography>
                        <Typography variant="body2"
                                    className="owner-id">{t('Owner ID')}: {mold.owner_id}</Typography>
                        <Typography variant="body2">{t('Mold Count')}: {mold.mold_count}</Typography>
                        <Button size="small" color="secondary" onClick={() => handleDelete(mold.id)}
                                style={{marginRight: '5px'}}>
                            {t('Delete')}</Button>
                        <Link to={`/mold-edit/${mold.id}`} style={{textDecoration: 'none'}}>
                            <Button size="small" color="primary">{t('Edit')}</Button>
                        </Link>
                    </Paper>
                ))
            ) : (
                <TableContainer component={Paper} style={{marginTop: '20px', overflowX: 'auto'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('ID')}</TableCell>
                                <TableCell>{t('Mold ID')}</TableCell>
                                <TableCell>{t('Status')}</TableCell>
                                <TableCell>{t('Status Date')}</TableCell>
                                <TableCell>{t('Inspection Status')}</TableCell>
                                <TableCell>{t('Inspector')}</TableCell>
                                <StyledTableCell className="owner-id">{t('Owner ID')}</StyledTableCell>
                                <TableCell>{t('Mold Count')}</TableCell>
                                <TableCell>{t('Delete')}</TableCell>
                                <TableCell>{t('Edit')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {molds.map((mold) => (
                                <StyledTableRow key={mold.id}>
                                    <TableCell>{mold.id}</TableCell>
                                    <TableCell>{mold.mold_id}</TableCell>
                                    <TableCell>{mold.status}</TableCell>
                                    <TableCell>{mold.status_date}</TableCell>
                                    <TableCell>{mold.inspection_status}</TableCell>
                                    <TableCell>{mold.inspector}</TableCell>
                                    <StyledTableCell className="owner-id">{mold.owner_id}</StyledTableCell>
                                    <TableCell>{mold.mold_count}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="secondary"
                                                onClick={() => handleDelete(mold.id)} size="small">
                                            {t('Delete')}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/mold-edit/${mold.id}`} style={{textDecoration: 'none'}}>
                                            <Button variant="outlined" color="primary" size="small">
                                                {t('Edit')}
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Button variant="contained" color="primary" onClick={handleLogout} style={{marginTop: '20px'}}>
                {t('Logout')}</Button>
        </div>
    );
}

export default MoldList;
