import { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import Sidebar from '../../components/sideBar/sideBar'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Divider,
  useTheme,
  CircularProgress,
  LinearProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function MonitoringReportsPage() {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(true)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  }))

  const StatCard = styled(Card)(({ theme }) => ({
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  }))

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const response = await api.get('monitor/logs')
        setLogs(response.data)
      } catch (error) {
        console.error('Log verisi alınamadı:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const chartData = (log) => [
    { name: 'Başarılı', value: log.logs.successRequests, color: '#4caf50' },
    { name: 'Başarısız', value: log.logs.failedRequests, color: '#f44336' },
  ]

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ width: '240px' }}>
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Box>
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Monitor Reports.
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {logs.map((log) => (
            <Grid item xs={12} md={6} lg={4} key={log.id}>
              <StatCard>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {log.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {log.host}
                  </Typography>
                  
                  <Box sx={{ height: 200, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData(log)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={theme.palette.primary.main}>
                          {chartData(log).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Metrik</StyledTableCell>
                          <StyledTableCell align="right">Değer</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <StyledTableRow>
                          <StyledTableCell>Toplam İstek</StyledTableCell>
                          <StyledTableCell align="right">{log.logs.totalRequests}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Başarılı İstek</StyledTableCell>
                          <StyledTableCell align="right">{log.logs.successRequests}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Başarısız İstek</StyledTableCell>
                          <StyledTableCell align="right">{log.logs.failedRequests}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Ortalama Yanıt Süresi</StyledTableCell>
                          <StyledTableCell align="right">{log.logs.avgResponseTime} ms</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Başarı Oranı</StyledTableCell>
                          <StyledTableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={parseFloat(log.logs.successRate)} 
                                sx={{ 
                                  flexGrow: 1,
                                  backgroundColor: '#ffcdd2',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#4caf50'
                                  }
                                }}
                              />
                              <Typography variant="body2">{log.logs.successRate}</Typography>
                            </Box>
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                </CardActions>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
