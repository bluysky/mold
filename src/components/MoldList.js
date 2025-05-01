import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import { createClient } from '@supabase/supabase-js'; // 이 줄은 제거합니다.
import { supabase } from '../supabaseClient'; // supabaseClient.js에서 export한 supabase 객체를 import 합니다.

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.owner-id`]: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // 이 줄은 제거합니다.
// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // 이 줄은 제거합니다.
// const supabase = createClient(supabaseUrl, supabaseKey); // 이 줄은 제거합니다.

function MoldList() {
  // ... 나머지 MoldList 컴포넌트 코드는 그대로 유지합니다.
  const [molds, setMolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [newMoldId, setNewMoldId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newStatusDate, setNewStatusDate] = useState('');
  const [newInspectionStatus, setNewInspectionStatus] = useState('');
  const [newInspector, setNewInspector] = useState('');
  const [newMoldCount, setNewMoldCount] = useState('');
  const [newUnitId, setNewUnitId] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [loadingSession, setLoadingSession] = useState(true); // 세션 로딩 상태
  const [session, setSession] = useState(null); // 세션 상태

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const fetchMolds = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('molds')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setMolds(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getActiveSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
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
    if (session) { // 세션이 있을 때만 데이터 fetching
      fetchMolds();
    }
  }, [session, fetchMolds]);

  const triggerSearch = () => {
    navigate('/mold-search');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

 const handleDelete = async (id) => {
  if (window.confirm(t('Are you sure you want to delete this mold?'))) {
    try {
      const { error } = await supabase.from('molds').delete().eq('id', id);
      if (error) {
        console.error("Error deleting mold:", error);
        setError(error.message);
        return;
      }
      setMolds(prevMolds => prevMolds.filter((mold) => mold.id !== id));
    } catch (err) {
      console.error("Error deleting mold (catch):", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
    setNewMoldCount('');
    setNewUnitId('');
  };

  const handleSaveNewMold = async () => {
    if (!newMoldId) {
      alert(t('Please enter the mold ID.'));
      return;
    }
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user?.id) {
        alert(t('Please log in to use this feature.'));
        return;
      }
      const currentUserId = sessionData.session.user.id;
      const { error } = await supabase.from('molds').insert([
        {
          mold_id: newMoldId,
          status: newStatus,
          status_date: newStatusDate,
          inspection_status: newInspectionStatus,
          inspector: newInspector,
          owner_id: currentUserId,
          mold_count: parseInt(newMoldCount, 10) || 0,
          unit_id: newUnitId,
        },
      ]);
      if (error) {
        console.error("Error adding new mold:", error);
        setError(error.message);
        return;
      }
      handleCancelAdd();
      await fetchMolds();
      alert(t('New mold added.'));
    } catch (err) {
      console.error("Error adding new mold (catch):", err);
      setError(err.message);
    }
  };

  const goToStatistics = () => {
    navigate('/statistics', { state: { molds } });
  };

  if (loadingSession) return <CircularProgress />;
  if (!session) return null; // 세션이 없으면 아무것도 렌더링하지 않음 (이미 navigate 되었음)
  if (error) return <Alert severity="error">{error}</Alert>;
  if (loading) return <CircularProgress />; // 데이터 로딩 중

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Typography variant="h5">{t('Mold List')}</Typography>
        <Select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ko">한국어</MenuItem>
        </Select>
      </div>
      <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={handleAddNewClick}>
          {t('Add New Mold')}
        </Button>
        <Button variant="outlined" onClick={triggerSearch}>
          {t('Search')}
        </Button>
        <Button variant="outlined" onClick={goToStatistics}>
          {t('Statistics')}
        </Button>
      </Stack>

      {isAddingNew && (
        <Paper style={{ padding: '15px', marginBottom: '10px' }}>
          <Typography variant="h6">{t('Add New Mold')}</Typography>
          <TextField label={t('Mold ID')} value={newMoldId} onChange={(e) => setNewMoldId(e.target.value)}
            fullWidth margin="normal" />
          <Select label={t('Status')} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
            fullWidth margin="normal">
            <MenuItem value="Mounted">{t('Mounted')}</MenuItem>
            <MenuItem value="Received">{t('Received')}</MenuItem>
            <MenuItem value="Shipped">{t('Shipped')}</MenuItem>
          </Select>
          <TextField label={t('Status Date/Time')} type="datetime-local" value={newStatusDate}
            onChange={(e) => setNewStatusDate(e.target.value)} fullWidth margin="normal"
            InputLabelProps={{ shrink: true }} />
          <Select label={t('Inspection Status')} value={newInspectionStatus}
            onChange={(e) => setNewInspectionStatus(e.target.value)} fullWidth margin="normal">
            <MenuItem value="WAITING">{t('WAITING')}</MenuItem>
            <MenuItem value="PASS">{t('PASS')}</MenuItem>
            <MenuItem value="FAIL">{t('FAIL')}</MenuItem>
          </Select>
          <TextField label={t('Inspector')} value={newInspector}
            onChange={(e) => setNewInspector(e.target.value)} fullWidth margin="normal" />
          <TextField label={t('Mold Count')} type="number" value={newMoldCount}
            onChange={(e) => setNewMoldCount(e.target.value)} fullWidth margin="normal" />
          <TextField label={t('UnitID')} value={newUnitId} onChange={(e) => setNewUnitId(e.target.value)}
            fullWidth margin="normal" />
          <Button variant="contained" color="primary" onClick={handleSaveNewMold}
            style={{ marginRight: '10px' }}>
            {t('Save')}
          </Button>
          <Button variant="outlined" onClick={handleCancelAdd}>
            {t('Cancel')}
          </Button>
        </Paper>
      )}

      {molds.length > 0 ? (
        isMobile ? (
          molds.map((mold) => (
            <Paper key={mold.id} style={{ margin: '10px', padding: '15px' }}>
              <Typography variant="subtitle1">{t('Mold ID')}: {mold.mold_id}</Typography>
              <Typography variant="body2">{t('Status')}: {mold.status}</Typography>
              <Typography variant="body2">{t('Status Date')}: {mold.status_date}</Typography>
              <Typography variant="body2">{t('Inspection Status')}: {mold.inspection_status}</Typography>
              <Typography variant="body2">{t('Inspector')}: {mold.inspector}</Typography>
              <Typography variant="body2" className="owner-id">{t('Owner ID')}: {mold.owner_id}</Typography>
              <Typography variant="body2">{t('Mold Count')}: {mold.mold_count}</Typography>
              <Typography variant="body2">{t('UnitID')}: {mold.unit_id}</Typography>
              <Button size="small" color="secondary" onClick={() => handleDelete(mold.id)}
                style={{ marginRight: '5px' }}>
                {t('Delete')}
              </Button>
              <Link to={`/mold-edit/${mold.id}`} style={{ textDecoration: 'none' }}>
                <Button size="small" color="primary">{t('Edit')}</Button>
              </Link>
            </Paper>
          ))
        ) : (
          <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto' }}>
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
                  <TableCell>{t('UnitID')}</TableCell>
                  <TableCell>{t('Delete')}</TableCell>
                  <TableCell>{t('Edit')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {molds.map((mold) => (
                  <TableRow
                    key={mold.id}
                    sx={{
                      ...(mold.status === 'Mounted' && {
                        backgroundColor: '#e6ffe6',
                      }),
                      ...(mold.status === 'Received' && {
                        backgroundColor: '#ffe6e6',
                      }),
                      ...(mold.status === 'Shipped' && {
                        backgroundColor: '#fffacd',
                      }),
                    }}
                  >
                    <TableCell>{mold.id}</TableCell>
                    <TableCell>{mold.mold_id}</TableCell>
                    <TableCell>{mold.status}</TableCell>
                    <TableCell>{mold.status_date}</TableCell>
                    <TableCell>{mold.inspection_status}</TableCell>
                    <TableCell>{mold.inspector}</TableCell>
                    <StyledTableCell className="owner-id">{mold.owner_id}</StyledTableCell>
                    <TableCell>{mold.mold_count}</TableCell>
                    <TableCell>{mold.unit_id}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="secondary"
                        onClick={() => handleDelete(mold.id)} size="small">
                        {t('Delete')}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Link to={`/mold-edit/${mold.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary" size="small">
                          {t('Edit')}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : (
        !loading && <Typography>{t('No search results.')}</Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginTop: '20px' }}>
        {t('Logout')}
      </Button>
    </div>
  );
}

export default MoldList;