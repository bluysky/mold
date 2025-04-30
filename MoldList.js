// src/components/MoldList.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

function MoldList() {
  const [molds, setMolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMolds() {
      try {
        const { data, error } = await supabase.from('molds').select('*');
        if (error) throw error;
        setMolds(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMolds();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('molds').delete().eq('id', id);
      if (error) throw error;
      setMolds(molds.filter((mold) => mold.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <h2>몰드 목록</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>몰드 ID</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>상태 날짜</TableCell>
              <TableCell>검사 상태</TableCell>
              <TableCell>검사자</TableCell>
              <TableCell>소유자 ID</TableCell>
              <TableCell>몰드 카운트</TableCell>
              <TableCell>삭제</TableCell>
              <TableCell>수정</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {molds.map((mold) => (
              <TableRow key={mold.id}>
                <TableCell>{mold.id}</TableCell>
                <TableCell>{mold.mold_id}</TableCell>
                <TableCell>{mold.status}</TableCell>
                <TableCell>{mold.status_date}</TableCell>
                <TableCell>{mold.inspection_status}</TableCell>
                <TableCell>{mold.inspector}</TableCell>
                <TableCell>{mold.owner_id}</TableCell>
                <TableCell>{mold.mold_count}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(mold.id)}>
                    삭제
                  </Button>
                </TableCell>
                <TableCell>
                  <Link to={`/mold-edit/${mold.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="primary">
                      수정
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}

export default MoldList;
