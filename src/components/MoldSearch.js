// src/components/MoldSearch.js
import React, {useState} from 'react';
import {supabase} from '../supabaseClient';
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
} from '@mui/material';

function MoldSearch() {
    const [moldId, setMoldId] = useState('');
    const [status, setStatus] = useState('');
    const [statusDate, setStatusDate] = useState('');
    const [inspector, setInspector] = useState('');
    const [moldCount, setMoldCount] = useState('');
    const [inspectionStatus, setInspectionStatus] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const query = {};
        if (moldId) query.mold_id = moldId;
        if (status) query.status = status;
        // if (statusDate) query.status_date = statusDate;
        if (statusDate) query.status_date = statusDate; // 변경된 state 이름 사용
        if (inspector) query.inspector = inspector;
        if (moldCount) query.mold_count = moldCount;
        if (inspectionStatus) query.inspection_status = inspectionStatus;

        try {
            const {data, error} = await supabase
                .from('molds')
                .select('*')
                .match(query); // 정확한 매칭

            if (error) {
                throw error;
            }
            setSearchResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>몰드 검색</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="몰드 ID"
                    value={moldId}
                    onChange={(e) => setMoldId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="상태"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="상태 날짜 및 시간"
                    type="datetime-local"
                    value={statusDate}
                    onChange={(e) => setStatusDate(e.target.value)} // 상태 업데이트 함수 이름 통일
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="검사자"
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="몰드 카운트"
                    type="number"
                    value={moldCount}
                    onChange={(e) => setMoldCount(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="inspection-status-label">검사 상태</InputLabel>
                    <Select
                        labelId="inspection-status-label"
                        id="inspectionStatus"
                        value={inspectionStatus}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                        label="검사 상태"
                    >
                        <MenuItem value=""><em>전체</em></MenuItem>
                        <MenuItem value="양호">양호</MenuItem>
                        <MenuItem value="불량">불량</MenuItem>
                        {/* 필요한 검사 상태 옵션 추가 */}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    검색
                </Button>
            </form>

            {loading && <CircularProgress/>}
            {error && <Alert severity="error">{error}</Alert>}

            {searchResults.length > 0 && (
                <Paper sx={{mt: 3}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>몰드 ID</TableCell>
                                    <TableCell>상태</TableCell>
                                    <TableCell>상태 날짜</TableCell>
                                    <TableCell>검사 상태</TableCell>
                                    <TableCell>검사자</TableCell>
                                    <TableCell>몰드 카운트</TableCell>
                                    {/* 필요하다면 다른 필드 추가 */}
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
                                        {/* 필요하다면 다른 필드 추가 */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
            {searchResults.length === 0 && !loading && !error && (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
}

export default MoldSearch;
