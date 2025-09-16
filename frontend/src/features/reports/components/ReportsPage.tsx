import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getChartData, type ChartData } from '../services/reportService';
import axiosClient from '../../../services/axiosClient';

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

const dataKeyToName: { [key: string]: string } = {
    profit: 'Kar',
    sales: 'Satış',
    purchases: 'Alış',
    collections: 'Tahsilat',
    payments: 'Tediye',
};

const ReportsPage: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [data, setData] = useState<ChartData[]>([]);
    const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['profit', 'sales']);

    const handleFetchData = async () => {
        if (startDate && endDate) {
            const startOfDayUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0));
            const endOfDayUTC = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999));

            const start = startOfDayUTC.toISOString();
            const end = endOfDayUTC.toISOString();
            try {
                const chartData = await getChartData(axiosClient, start, end, selectedDataTypes);
                setData(chartData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        }
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                Raporlar
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <DatePicker
                            label="Başlangıç Tarihi"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                        <DatePicker
                            label="Bitiş Tarihi"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                        />
                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel>Veri Tipi</InputLabel>
                            <Select
                                multiple
                                value={selectedDataTypes}
                                onChange={(e) => setSelectedDataTypes(e.target.value as string[])}
                                renderValue={(selected) => (selected as string[]).join(', ')}
                            >
                                <MenuItem value="profit">Kar</MenuItem>
                                <MenuItem value="sales">Satış</MenuItem>
                                <MenuItem value="purchases">Alış</MenuItem>
                                <MenuItem value="collections">Tahsilat</MenuItem>
                                <MenuItem value="payments">Tediye</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleFetchData}>
                            Raporu Getir
                        </Button>
                    </Box>
                </LocalizationProvider>
            </Paper>
            <Paper sx={{ p: 2, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' })} />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        {selectedDataTypes.map((dataType, index) => (
                            <Line
                                key={dataType}
                                yAxisId={index % 2 === 0 ? 'left' : 'right'}
                                type="monotone"
                                dataKey={dataType}
                                stroke={colors[index % colors.length]}
                                name={dataKeyToName[dataType] || dataType}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Container>
    );
};

export default ReportsPage;