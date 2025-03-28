import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Button,
    CircularProgress,
    Alert,
    Typography,
    TextField,
    Select,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';

function MoldList() {
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
    const [isAddingNew, setIsAddingNew] = useState(false);

    const fetchMolds = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('molds').select('*');
            if (error) throw error;
            setMolds(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMolds();
    }, [fetchMolds]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
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
    };

    const handleSaveNewMold = async () => {
        if (!newMoldId) {
            alert('Please enter Mold ID.');
            return;
        }
        try {
            const { data: session, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session?.session?.user?.id) {
                alert('Please log in to continue.');
                return;
            }
            const currentUserId = session.session.user.id;

            const { error } = await supabase.from('molds').insert([
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
            alert('New mold added successfully.');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div>
            <h2>Mold List</h2>
            <Button variant="contained" color="primary" onClick={handleAddNewClick} style={{ marginBottom: '10px' }}>
                Add New Mold
            </Button>

            {isAddingNew && (
                <Paper style={{ padding: '15px', marginBottom: '10px' }}>
                    <Typography variant="h6">Add New Mold</Typography>
                    <TextField
                        label="Mold ID"
                        value={newMoldId}
                        onChange={(e) => setNewMoldId(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        label="Status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Received">Received</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                    </Select>
                    <TextField
                        label="Status Date/Time"
                        type="datetime-local"
                        value={newStatusDate}
                        onChange={(e) => setNewStatusDate(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        label="Inspection Status"
                        value={newInspectionStatus}
                        onChange={(e) => setNewInspectionStatus(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="WAITING">WAITING</MenuItem>
                        <MenuItem value="PASS">PASS</MenuItem>
                        <MenuItem value="FAIL">FAIL</MenuItem>
                    </Select>
                    <TextField
                        label="Inspector"
                        value={newInspector}
                        onChange={(e) => setNewInspector(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mold Count"
                        type="number"
                        value={newMoldCount}
                        onChange={(e) => setNewMoldCount(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveNewMold}
                        style={{ marginRight: '10px' }}
                    >
                        Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelAdd}>
                        Cancel
                    </Button>
                </Paper>
            )}

            <div>
                {/* Display Mold List */}
                <Paper style={{ padding: '15px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mold ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Inspection Status</TableCell>
                                <TableCell>Inspector</TableCell>
                                <TableCell>Mold Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {molds.map((mold) => (
                                <TableRow key={mold.id}>
                                    <TableCell>{mold.mold_id}</TableCell>
                                    <TableCell>{mold.status}</TableCell>
                                    <TableCell>{mold.inspection_status}</TableCell>
                                    <TableCell>{mold.inspector}</TableCell>
                                    <TableCell>{mold.mold_count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>

            <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginTop: '20px' }}>
                Logout
            </Button>
        </div>
    );
}

export default MoldList;

