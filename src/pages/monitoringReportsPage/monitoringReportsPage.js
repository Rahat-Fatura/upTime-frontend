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
  TextField,
  InputAdornment,
  IconButton,
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
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'

export default function MonitoringReportsPage() {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(true)
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (!logs || logs.length === 0) {
      setFilteredLogs([])
      return
    }

    const searchLower = searchQuery.toLowerCase().trim()
    
    if (searchLower === '') {
      setFilteredLogs(logs)
      return
    }

    const filtered = logs.filter(log => {
      const nameMatch = log.name?.toLowerCase().includes(searchLower)
      const hostMatch = log.host?.toLowerCase().includes(searchLower)
      return nameMatch || hostMatch
    })

    setFilteredLogs(filtered)
  }, [searchQuery, logs])

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
        const response = await api.get('monitors/logs')
        setLogs(response.data)
        setFilteredLogs(response.data)
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
      <Box
        sx={{
          width: { xs: isOpen ? '100%' : 0, sm: isOpen ? 240 : 0 },
          flexShrink: 0,
          transition: 'width 0.3s',
          position: { xs: 'fixed', sm: 'relative' },
          zIndex: 1000,
          height: { xs: '100vh', sm: 'auto' },
          display: { xs: isOpen ? 'block' : 'none', sm: 'block' },
        }}
      >
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          maxWidth: '1800px',
          margin: '0 auto',
          ml: { xs: 0, sm: isOpen ? '240px' : 0 },
          transition: 'margin-left 0.3s',
          width: { xs: '100%', sm: `calc(100% - ${isOpen ? '240px' : '0px'})` },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          mb: 3,
          gap: 2
        }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            Monitor Reports
          </Typography>
          <IconButton
            onClick={toggleSidebar}
            sx={{ 
              display: { xs: 'flex', sm: 'none' },
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Monitor adı ile arama yapın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {filteredLogs.map((log) => (
            <Grid item xs={12} sm={6} md={4} key={log.id}>
              <StatCard>
                <CardContent>
                  <Typography 
                    variant="h5" 
                    component="div" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    {log.name}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      wordBreak: 'break-all'
                    }}
                  >
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
