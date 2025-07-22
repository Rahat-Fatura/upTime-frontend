import { useState, useEffect } from 'react'
import api from '../../../api/auth/axiosInstance'
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
  Snackbar,
  Avatar,
  Paper,
  Divider,
  Tooltip,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HelpIcon from '@mui/icons-material/Help'
import BuildIcon from '@mui/icons-material/Build'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import MenuIcon from '@mui/icons-material/Menu'
import { useLocation } from 'react-router-dom';


const TimeInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}))

export default function AdminMaintanance() {
  const [monitors, setMonitors] = useState([])
  const [filteredMonitors, setFilteredMonitors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [monitorDates, setMonitorDates] = useState({})
  const location = useLocation();
  const userInfo = location.state.userInfo;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })


  useEffect(() => {
    const interval = setInterval(fetchMonitors, 60000)
    fetchMonitors()
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    console.log('Search Query:', searchQuery)
    console.log('Monitors:', monitors)

    if (!monitors || monitors.length === 0) {
      setFilteredMonitors([])
      return
    }

    const searchLower = searchQuery.toLowerCase().trim()
    
    if (searchLower === '') {
      setFilteredMonitors(monitors)
      return
    }

    const filtered = monitors.filter(monitor => {
      const nameMatch = monitor.name?.toLowerCase().includes(searchLower)
      const hostMatch = monitor.host?.toLowerCase().includes(searchLower)
      return nameMatch || hostMatch
    })

    console.log('Filtered Results:', filtered)
    setFilteredMonitors(filtered)
  }, [searchQuery, monitors])

  const fetchMonitors = async () => {
    try {
      setLoading(true)
      const response = await api.get(`monitors/maintanance/${userInfo.id}`)
      console.log('API Response:', response.data)
      
      if (response.data && Array.isArray(response.data)) {
        const sortedMonitors = response.data.sort((a, b) => a.id - b.id)
        console.log('Sorted Monitors:', sortedMonitors)
        setMonitors(sortedMonitors)
        setFilteredMonitors(sortedMonitors) // İlk yüklemede tüm monitörleri göster
        
        const initialDates = {}
        sortedMonitors.forEach(monitor => {
          if (monitor && monitor.id) {
            initialDates[monitor.id] = {
              startDateTime: monitor.maintanance ? dayjs(monitor.maintanance.startTime) : dayjs(),
              endDateTime: monitor.maintanance ? dayjs(monitor.maintanance.endTime) : dayjs()
            }
          }
        })
        setMonitorDates(initialDates)
      } else {
        setMonitors([])
        setFilteredMonitors([])
      }
    } catch (error) {
      console.error('Error fetching monitors:', error)
      setSnackbar({
        open: true,
        message: 'Monitorlar yüklenirken bir hata oluştu',
        severity: 'error',
      })
      setMonitors([])
      setFilteredMonitors([])
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (monitorId, field, value) => {
    setMonitorDates(prev => ({
      ...prev,
      [monitorId]: {
        ...prev[monitorId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (monitorId) => {
    const { startDateTime, endDateTime } = monitorDates[monitorId];
    const startDate = startDateTime.toDate();
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    const endDate = endDateTime.toDate();
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    const now = new Date()

    if (!startDateTime || !endDateTime) {
      Swal.fire({
        title: 'Warning',
        text: 'Lütfen tüm tarih ve saat bilgilerini giriniz',
        icon: 'warning',
      })
      return
    }
   
    if (startDate < now || endDate < now) {
      Swal.fire({
        title: 'Warning',
        text: 'Başlangıç veya bitiş tarihleri geçmişte olamaz',
        icon: 'warning',
      })
      return
    }

    if (startDate >= endDate) {
      Swal.fire({
        title: 'Warning',
        text: 'Başlangıç tarihi geçmiş tarihten ön tarihte olamaz',
        icon: 'warning',
      })
      return
    }

    try {
      const response = await api.post(`monitors/${monitorId}/maintanance`, {
        startTime: startDate,
        endTime: endDate,
      })
      Swal.fire({
        title: 'Success',
        text: 'Bakım planı başarıyla kaydedildi',
        icon: 'success',
      })

      fetchMonitors();
    }
    catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Bakım planı kaydedilirken bir hata oluştu',
        icon: 'error',
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'up':
        return 'success'
      case 'down':
        return 'error'
      case 'uncertain':
        return 'warning'
      case 'maintanance':
        return 'info'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up':
        return <CheckCircleIcon />
      case 'down':
        return <ErrorIcon />
      case 'uncertain':
        return <HelpIcon />
      case 'maintanance':
        return <BuildIcon />
      default:
        return null
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'up':
        return 'Çalışıyor'
      case 'down':
        return 'Çalışmıyor'
      case 'uncertain':
        return 'Belirsiz'
      case 'maintanance':
        return 'Bakımda'
      default:
        return status
    }
  }

  const handleCancelMaintenance = async (monitorId) => {
    try {
      const response = await api.put(`monitors/${ monitorId }/maintanance/cancel`)
      Swal.fire({
        title: 'Succes',
        text: 'Bakım modu başarıyla iptal edildi.',
        icon: 'succes',
      })
      console.log(response)
      fetchMonitors();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Bakım modu ipat edilirken bir hata oluştu',
        icon: 'error',
      })
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, sm: '120px' },
          mr: { xs: 0, sm: '120px' },
          transition: 'margin-left 0.3s',
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          width: '100%'
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 4,
            gap: 2
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Bakım Sayfası
            </Typography>
           
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Box sx={{ mb: 1 }}>
            <TextField
              fullWidth
              placeholder="Monitor adı ile arama yapın..."
              value={searchQuery}
              onChange={(e) => {
                console.log('Search Input Changed:', e.target.value)
                setSearchQuery(e.target.value)
              }}
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
            {filteredMonitors.map((monitor) => (
              <Grid item xs={12} sm={6} md={4} key={monitor.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: 'background.paper',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: `${getStatusColor(monitor.status)}.main`,
                    }
                  }}
                >
                  <CardHeader
                    avatar={
                      <Tooltip title={getStatusText(monitor.status)}>
                        <Avatar 
                          sx={{ 
                            bgcolor: `${getStatusColor(monitor.status)}.main`,
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            boxShadow: 2
                          }}
                        >
                          {getStatusIcon(monitor.status)}
                        </Avatar>
                      </Tooltip>
                    }
                    title={
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        {monitor.name}
                      </Typography>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <TimeInfoBox>
                      <Typography 
                        variant="h5" 
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          wordBreak: 'break-all'
                        }}
                      >
                        {monitor.host}
                      </Typography>
                    </TimeInfoBox>
                    
                    <Box 
                      sx={{ 
                        mb: 3,
                        p: { xs: 1, sm: 2 },
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        <AccessTimeIcon fontSize="small" />
                        Bakım Zaman Aralığı
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Grid container spacing={{ xs: 1, sm: 2 }}>
                          <Grid item xs={12} md={6}>
                            <DatePicker
                              label="Başlangıç Tarihi"
                              value={monitorDates[monitor.id]?.startDateTime || dayjs()}
                              onChange={(newValue) => handleDateChange(monitor.id, 'startDateTime', newValue)}
                              renderInput={(params) => (
                                <TextField 
                                  {...params} 
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    '& .MuiInputBase-input': {
                                      fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                  }}
                                />
                              )}
                              minDate={dayjs()}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TimePicker
                              label="Başlangıç Saati"
                              value={monitorDates[monitor.id]?.startDateTime || dayjs()}
                              onChange={(newValue) => handleDateChange(monitor.id, 'startDateTime', newValue)}
                              renderInput={(params) => (
                                <TextField 
                                  {...params} 
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <AccessTimeIcon 
                                        sx={{ 
                                          color: 'primary.main',
                                          mr: 1,
                                          my: 0.5,
                                          fontSize: { xs: '1rem', sm: '1.25rem' }
                                        }}
                                      />
                                    ),
                                  }}
                                  sx={{
                                    '& .MuiInputBase-input': {
                                      fontSize: { xs: '0.875rem', sm: '1rem' }
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                      },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                      color: 'primary.main',
                                    },
                                  }}
                                />
                              )}
                              minutesStep={1}
                              timeSteps={{ minutes: 1 }}
                              views={['hours', 'minutes']}
                              openTo="hours"
                              ampm={false}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <Box>
                        <Grid container spacing={{ xs: 1, sm: 2 }}>
                          <Grid item xs={12} md={6}>
                            <DatePicker
                              label="Bitiş Tarihi"
                              value={monitorDates[monitor.id]?.endDateTime || dayjs()}
                              onChange={(newValue) => handleDateChange(monitor.id, 'endDateTime', newValue)}
                              renderInput={(params) => (
                                <TextField 
                                  {...params} 
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    '& .MuiInputBase-input': {
                                      fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                  }}
                                />
                              )}
                              minDate={monitorDates[monitor.id]?.startDateTime || dayjs()}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TimePicker
                              label="Bitiş Saati"
                              value={monitorDates[monitor.id]?.endDateTime || dayjs()}
                              onChange={(newValue) => handleDateChange(monitor.id, 'endDateTime', newValue)}
                              renderInput={(params) => (
                                <TextField 
                                  {...params} 
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <AccessTimeIcon 
                                        sx={{ 
                                          color: 'primary.main',
                                          mr: 1,
                                          my: 0.5,
                                          fontSize: { xs: '1rem', sm: '1.25rem' }
                                        }}
                                      />
                                    ),
                                  }}
                                  sx={{
                                    '& .MuiInputBase-input': {
                                      fontSize: { xs: '0.875rem', sm: '1rem' }
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                      },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                      color: 'primary.main',
                                    },
                                  }}
                                />
                              )}
                              minutesStep={1}
                              timeSteps={{ minutes: 1 }}
                              views={['hours', 'minutes']}
                              openTo="hours"
                              ampm={false}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => {
                         if (monitor.maintanance != null) {
                          if(monitor.maintanance.status == true){
                            handleCancelMaintenance(monitor.id)
                          }
                          else{
                            handleSubmit(monitor.id)
                          }
                        } else {
                          handleSubmit(monitor.id)
                        }
                      }}
                      fullWidth
                      color={
                        (monitor.maintanance != null)
                        ? (monitor.maintanance.status == true)
                          ? 'error'
                          : 'primary'
                        :  'primary'
                      }
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: 2,
                        borderRadius: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {(monitor.maintanance != null)
                        ? (monitor.maintanance.status == true)
                           ? 'Bakım Durumunu Durdur'
                           : 'Bakım Durumunu Başlat'
                        : 'Bakım Durumunu Başlat'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </LocalizationProvider>
      </Box>
    </Box>
  )
}
