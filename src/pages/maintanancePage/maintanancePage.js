/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import Sidebar from '../../components/sideBar/sideBar'
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
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HelpIcon from '@mui/icons-material/Help'
import BuildIcon from '@mui/icons-material/Build'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

const StatusBadge = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontWeight: 500,
}))

const TimeInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}))

export default function MaintanancePage() {
  const [isOpen, setIsOpen] = useState(true)
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(false)
  const [monitorDates, setMonitorDates] = useState({})
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const interval = setInterval(fetchMonitors, 30000)
    fetchMonitors()
    return () => clearInterval(interval)
  }, [])

  const fetchMonitors = async () => {
    try {
      setLoading(true)
      const response = await api.get('monitors/maintanance')
      console.log(response.data)
      setMonitors(response.data)
      // Her monitor için başlangıç state'lerini oluştur
      const initialDates = {}
      response.data.forEach(monitor => {
        initialDates[monitor.id] = {
          startDateTime: monitor.maintanance ? dayjs(monitor.maintanance.startTime) : dayjs(),
          endDateTime: monitor.maintanance ? dayjs(monitor.maintanance.endTime) : dayjs()
        }
      })
      setMonitorDates(initialDates)
    } catch (error) {
      console.error('Error fetching monitors:', error)
      setSnackbar({
        open: true,
        message: 'Monitorlar yüklenirken bir hata oluştu',
        severity: 'error',
      })
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
      setSnackbar({
        open: true,
        message: 'Lütfen tüm tarih ve saat bilgilerini giriniz',
        severity: 'warning',
      })
      return
    }
   
    if (startDate < now || endDate < now) {
      setSnackbar({
        open: true,
        message: 'Başlangıç veya bitiş tarihleri geçmişte olamaz',
        severity: 'warning',
      })
      return
    }

    if (startDate >= endDate) {
      setSnackbar({
        open: true,
        message: 'Başlangıç tarihi geçmiş tarihten ön tarihte olamaz',
        severity: 'warning',
      })
      return
    }

    try {
      const response = await api.post(`monitors/${monitorId}/maintanance`, {
        startTime: startDate,
        endTime: endDate,
      })
      setSnackbar({
        open: true,
        message: 'Bakım planı başarıyla kaydedildi',
        severity: 'success',
      })
      fetchMonitors();
    }
    catch (error) {
      setSnackbar({
        open: true,
        message: 'Bakım planı kaydedilirken bir hata oluştu',
        severity: 'error',
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
      setSnackbar({
        open: true,
        message: 'Bakım modu başarıyla iptal edildi',
        severity: 'success',
      })
      console.log(response)
      fetchMonitors();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Bakım modu iptal edilirken bir hata oluştu',
        severity: 'error',
      })
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        sx={{
          width: isOpen ? 240 : 0,
          flexShrink: 0,
          transition: 'width 0.3s',
          position: 'fixed',
          zIndex: 1000,
        }}
      >
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          ml: isOpen ? '240px' : 0,
          transition: 'margin-left 0.3s',
          p: 3,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography 
            variant="h4" 
            component="h1" 
            align="left" 
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Maintanance Page.
            <hr/>
          </Typography>
          <Grid container spacing={3}>
            {monitors.map((monitor) => (
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
                            width: 40,
                            height: 40,
                            boxShadow: 2
                          }}
                        >
                          {getStatusIcon(monitor.status)}
                        </Avatar>
                      </Tooltip>
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {monitor.name}
                      </Typography>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <TimeInfoBox>
                      <Typography variant="h5" color="text.secondary">
                        {monitor.host}
                      </Typography>
                    </TimeInfoBox>
                    
                    <Box 
                      sx={{ 
                        mb: 3,
                        p: 2,
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
                          gap: 1
                        }}
                      >
                        <AccessTimeIcon fontSize="small" />
                        Bakım Zaman Aralığı
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
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
                                          my: 0.5
                                        }}
                                      />
                                    ),
                                  }}
                                  sx={{
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
                        <Grid container spacing={2}>
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
                                          my: 0.5
                                        }}
                                      />
                                    ),
                                  }}
                                  sx={{
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
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: 2,
                        borderRadius: 2,
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
