// src/components/StatisticsView.js
import React, {useState, useEffect, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {
    Typography,
    Button,
    Paper,
    Alert,
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {calculateInspectorStats} from '../utils/calculateInspectorStats';  // calculateInspectorStats import 추가
import {getDailyRange, getWeeklyRange, getMonthlyRange} from '../utils/rangeUtils';  // 이미 import 됨

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function StatisticsView() {
    const location = useLocation();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [molds, setMolds] = useState(location.state?.molds || []);

    useEffect(() => {
        const initialMolds = location.state?.molds || [];
        // 초기 데이터를 가공하는 로직 (예: 필터링, 매핑 등)
        const processedMolds = initialMolds.map(mold => ({...mold, processed: true}));
        setMolds(processedMolds); // 가공된 데이터로 상태 업데이트
    }, [location.state?.molds]);
    const [error, setError] = useState(null);   // 에러 상태만 남김
    const [dailyStats, setDailyStats] = useState({});
    const [weeklyStats, setWeeklyStats] = useState({});
    const [monthlyStats, setMonthlyStats] = useState({});

    const calculateAllStats = useCallback(() => {
        if (molds.length > 0) {
            const today = new Date();
            const dailyRange = getDailyRange(today);
            const weeklyRange = getWeeklyRange(today);
            const monthlyRange = getMonthlyRange(today);

            setDailyStats(calculateInspectorStats(molds, dailyRange.start, dailyRange.end));
            setWeeklyStats(calculateInspectorStats(molds, weeklyRange.start, weeklyRange.end));
            setMonthlyStats(calculateInspectorStats(molds, monthlyRange.start, monthlyRange.end));
        }
    }, [molds]);

    useEffect(() => {
        if (!molds || molds.length === 0) {
            console.error("No mold data received for statistics.");
            setError(t("Failed to load statistics data. Please go back and try again."));
        } else {
            calculateAllStats();
        }
    }, [molds, calculateAllStats, t]);

    const chartData = (stats) => ({
        labels: Object.keys(stats),
        datasets: [
            {
                label: t('Number of Molds (Shipped & Count >= 1,500,000)'),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: Object.values(stats),
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: (period) => t(`${period} Statistics by Inspector`),
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: t('Number of Molds'),
                },
            },
            x: {
                title: {
                    display: true,
                    text: t('Inspector'),
                },
            },
        },
    };

    const handleGoBack = () => {
        navigate('/mold-list');
    };

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Paper sx={{p: 3, mt: 2}}>
            <Typography variant="h5" gutterBottom>{t('Mold Statistics')}</Typography>

            <Typography variant="h6">{t('Daily Statistics')}</Typography>
            {Object.keys(dailyStats).length > 0 ? (
                <Bar data={chartData(dailyStats)} options={{
                    ...chartOptions,
                    plugins: {title: {...chartOptions.plugins.title, text: t('Daily Statistics by Inspector')}}
                }}/>
            ) : (
                <Typography>{t('No daily statistics available.')}</Typography>
            )}

            <Typography variant="h6" sx={{mt: 2}}>{t('Weekly Statistics')}</Typography>
            {Object.keys(weeklyStats).length > 0 ? (
                <Bar data={chartData(weeklyStats)} options={{
                    ...chartOptions,
                    plugins: {title: {...chartOptions.plugins.title, text: t('Weekly Statistics by Inspector')}}
                }}/>
            ) : (
                <Typography>{t('No weekly statistics available.')}</Typography>
            )}

            <Typography variant="h6" sx={{mt: 2}}>{t('Monthly Statistics')}</Typography>
            {Object.keys(monthlyStats).length > 0 ? (
                <Bar data={chartData(monthlyStats)} options={{
                    ...chartOptions,
                    plugins: {title: {...chartOptions.plugins.title, text: t('Monthly Statistics by Inspector')}}
                }}/>
            ) : (
                <Typography>{t('No monthly statistics available.')}</Typography>
            )}

            <Button variant="outlined" onClick={handleGoBack} sx={{mt: 3}}>
                {t('Go Back to Mold List')}
            </Button>
        </Paper>
    );
}

export default StatisticsView;