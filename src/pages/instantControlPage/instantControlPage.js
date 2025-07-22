import { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Button,
  useTheme,
  Collapse,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import SpeedIcon from '@mui/icons-material/Speed'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import InfoIcon from '@mui/icons-material/Info'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'

const StatusCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}))

const MethodChip = styled(Chip)(({ theme, method }) => ({
  backgroundColor:
    method === 'GET'
      ? '#4caf50'
      : method === 'POST'
      ? '#ff9800'
      : method === 'PUT'
      ? '#2196f3'
      : method === 'DELETE'
      ? '#f44336'
      : method === 'PATCH'
      ? '#9c27b0'
      : '#9e9e9e',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 8,
}))

const StatusIndicator = styled(Box)(({ theme, status }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: status ? '#4caf50' : status == null ? '#000000' : '#f44336',
  marginRight: 8,
}))

export default function InstantControlPage() {
  const theme = useTheme()
  const [statusPages, setStatusPages] = useState([])
  const [filteredPages, setFilteredPages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [requestResults, setRequestResults] = useState({})
  const [loadingRequests, setLoadingRequests] = useState({})


  useEffect(() => {
    if (!statusPages || statusPages.length === 0) {
      setFilteredPages([])
      return
    }

    const searchLower = searchQuery.toLowerCase().trim()
    
    if (searchLower === '') {
      setFilteredPages(statusPages)
      return
    }

    const filtered = statusPages.filter(page => {
      const nameMatch = page.name?.toLowerCase().includes(searchLower)
      const hostMatch = page.host?.toLowerCase().includes(searchLower)
      return nameMatch || hostMatch
    })

    setFilteredPages(filtered)
  }, [searchQuery, statusPages])

  useEffect(() => {
    const fetchStatusPages = async () => {
      try {
        setLoading(true)
        const response = await api.get('monitors/instant-Control')
        console.log(response.data)
        // Monitörleri ID'ye göre sırala
        const sortedPages = response.data.sort((a, b) => a.id - b.id)
        setStatusPages(sortedPages)
        setFilteredPages(sortedPages)
      } catch (error) {
        console.error('Status pages verisi alınamadı:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStatusPages()
  }, [])

  const handleRequest = async (page) => {
    try {
      setLoadingRequests((prev) => ({ ...prev, [page.id]: true }))
      const response = await api.get(`monitors/instant-Control/${page.id}`)
      console.log('İstek sonucu:', response.data)
      const result = {
        status: response.data.status,
        responseTime: response.data.responseTime,
        isError: response.data.isError,
        message: response.data.message,
        timestamp: new Date().toLocaleTimeString(),
      }

      setRequestResults((prev) => ({
        ...prev,
        [page.id]: result,
      }))
    } catch (error) {
      console.error('İstek hatası:', error)
      setRequestResults((prev) => ({
        ...prev,
        [page.id]: {
          status: 'error',
          message: error?.message || 'Bilinmeyen bir hata oluştu',
          timestamp: new Date().toLocaleTimeString(),
        },
      }))
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [page.id]: false }))
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
     
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          maxWidth: '1800px',
          margin: '0 auto',
          ml: { xs: 0, sm: '120px'},
          mr: { xs: 0, sm: '120px'},
          transition: 'margin-left 0.3s',
          width:'100%'
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
            Anlık Kontrol Sayfası
          </Typography>
        
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
          {filteredPages.map((page) => (
            <Grid item xs={12} sm={6} md={4} key={page.id}>
              <StatusCard>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        {page.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      wordBreak: 'break-all'
                    }}
                  >
                    {page.host}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => handleRequest(page)}
                      disabled={loadingRequests[page.id]}
                      startIcon={
                        loadingRequests[page.id] ? <HourglassEmptyIcon /> : <SpeedIcon />
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.5, sm: 1 },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {loadingRequests[page.id]
                        ? 'Kontrol Ediliyor...'
                        : 'Kontrol Et'}
                    </Button>
                  </Box>

                  <Collapse in={!!requestResults[page.id]}>
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 2,
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: requestResults[page.id]?.isError
                          ? 'rgba(244, 67, 54, 0.1)'
                          : 'rgba(76, 175, 80, 0.1)',
                        borderRadius: 2,
                      }}
                    >
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {requestResults[page.id]?.isError ? (
                            <ErrorIcon color="error" />
                          ) : (
                            <CheckCircleIcon color="success" />
                          )}
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 'bold',
                              color: requestResults[page.id]?.isError
                                ? 'error.main'
                                : 'success.main',
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                          >
                            {requestResults[page.id]?.isError
                              ? 'Hatalı Sonuç'
                              : 'Sistem Çalışıyor'}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: { xs: 1, sm: 0 }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              Yanıt Süresi: {requestResults[page.id]?.responseTime}ms
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon fontSize="small" color="action" />
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              Son kontrol: {requestResults[page.id]?.timestamp}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: requestResults[page.id]?.isError
                                ? 'error.main'
                                : 'success.main',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            Durum: {requestResults[page.id]?.message}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Collapse>
                </CardContent>
              </StatusCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
