import { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import Sidebar from '../../components/sideBar/sideBar'
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
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import SpeedIcon from '@mui/icons-material/Speed'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import InfoIcon from '@mui/icons-material/Info'

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
  const [isOpen, setIsOpen] = useState(true)
  const [statusPages, setStatusPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestResults, setRequestResults] = useState({})
  const [loadingRequests, setLoadingRequests] = useState({})

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchStatusPages = async () => {
      try {
        setLoading(true)
        const response = await api.get('monitors/instant-Control')
        console.log(response.data)
        setStatusPages(response.data)
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
      <Box sx={{ width: '240px' }}>
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          maxWidth: '1800px',
          margin: '0 auto',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 3,
          }}
        >
          Instant Control Page.
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {statusPages.map((page) => (
            <Grid item xs={12} md={6} xl={4} key={page.id} >
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
                     {/* <StatusIndicator status={page.status} />*/}
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {page.name}
                      </Typography>
                    </Box>
                    {/*<MethodChip label={page.method} method={page.method} />*/}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {page.host}
                  </Typography>
                 {/*
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      İzin Verilen Durum Kodları:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {page.allowedStatusCodes.map((code) => (
                        <Chip
                          key={code}
                          label={code}
                          size="small"
                          sx={{
                            backgroundColor:
                              code.charAt(0) === '2'
                               ? '#4caf50'
                               : code.charAt(0) === '4'
                               ? '#f44336'
                               : code.charAt(0) === '1'
                               ? '#ff9800'
                               : code.charAt(0) === '3'
                               ? '#2196f3'
                               : '#f44336',
                            color: 'white',
                            borderRadius: 4,
                          }}
                        />
                      ))}
                    </Box>
                  </Box> */}

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
                        px: 3,
                        py: 1,
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
                        p: 2,
                        backgroundColor: requestResults[page.id]?.isError
                          ? 'rgba(244, 67, 54, 0.1)'
                          : 'rgba(76, 175, 80, 0.1)',
                        borderRadius: 2,
                      }}
                    >
                      <Stack spacing={2}>
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
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Yanıt Süresi: {requestResults[page.id]?.responseTime}ms
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
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
