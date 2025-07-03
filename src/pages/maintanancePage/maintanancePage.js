import { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import Sidebar from '../../components/sideBar/sideBar'
import Swal from 'sweetalert2'
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
import MonitorStatus from '../../components/Animate/monitorStatus'
import localStorage from "local-storage";
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
  const [isOpen, setIsOpen] = useState(false)
  const [monitors, setMonitors] = useState([])
  const [filteredMonitors, setFilteredMonitors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
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

    const filtered = monitors.filter((monitor) => {
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
      const response = await api.get('monitors/maintanance')
      console.log('API Response:', response.data)

      if (response.data && Array.isArray(response.data)) {
        const sortedMonitors = response.data.sort((a, b) => a.id - b.id)
        console.log('Sorted Monitors:', sortedMonitors)
        setMonitors(sortedMonitors)
        setFilteredMonitors(sortedMonitors) // İlk yüklemede tüm monitörleri göster

        const initialDates = {}
        sortedMonitors.forEach((monitor) => {
          if (monitor && monitor.id) {
            initialDates[monitor.id] = {
              startDateTime: monitor.maintanance
                ? dayjs(monitor.maintanance.startTime)
                : dayjs(),
              endDateTime: monitor.maintanance
                ? dayjs(monitor.maintanance.endTime)
                : dayjs(),
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
    setMonitorDates((prev) => ({
      ...prev,
      [monitorId]: {
        ...prev[monitorId],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (monitorId) => {
    const { startDateTime, endDateTime } = monitorDates[monitorId]
    const startDate = startDateTime.toDate()
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)
    const endDate = endDateTime.toDate()
    endDate.setSeconds(0)
    endDate.setMilliseconds(0)
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

      fetchMonitors()
    } catch (error) {
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
      const response = await api.put(`monitors/${monitorId}/maintanance/cancel`)
      Swal.fire({
        title: 'Succes',
        text: 'Bakım modu başarıyla iptal edildi.',
        icon: 'succes',
      })
      console.log(response)
      fetchMonitors()
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Bakım modu ipat edilirken bir hata oluştu',
        icon: 'error',
      })
    }
  }
  useEffect(() => {
      const sideBarOpen = localStorage.get("sidebar");
  
      if (sideBarOpen === "false") {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
  
      const cleanupLocalStorage = () => {
        localStorage.clear();
      };
      window.addEventListener("beforeunload", cleanupLocalStorage);
      return () => {
        window.removeEventListener("beforeunload", cleanupLocalStorage);
      };
    }, []);
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        sx={{
          width: {
            xs: isOpen ? '100%' : 0,
            sm: isOpen ? '100%' : 0,
            md: isOpen ? '30%' : '2.5%',
            lg: isOpen ? '19.16%' : '6.5%',
            xlg: isOpen ? '19.16%' : '2.5%',
          },
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
          //ml: { xs: 0, sm: '120px' },
          //mr: { xs: 0, sm: '120px' },
          transition: 'margin-left 0.3s',
          pt: { xs: 2, sm: 3 },
          pr: { xs: 2, sm: 3 },
          pl: 1,
          backgroundColor: '#f5f5f5',
          //minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          width: {
            xs: isOpen ? 0 : '100%',
            sm: isOpen ? 0 : '100%',
            md: isOpen ? '30%' : '2.5%',
            lg: isOpen ? '78%' : '80%',
            xlg: isOpen ? '80.74%' : '97.5%',
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              mb: 2,
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.8rem',
                  md: '1rem',
                  lg: '1.2rem',
                  xlg: '1.5rem',
                },
              }}
            >
              Bakım Sayfası
            </Typography>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              border: 'solid 0.5px gray',
              borderColor: '#5c5554',
              backgroundColor: '#ffff',
              borderRadius: '5px',
              padding: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xlg: 3 },
            }}
          >
            <Box sx={{ mb: 4 }}>
              <TextField
                //size='small'
                placeholder="Izleme adı veya host ile arama yapın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" fontSize="smal" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '40%',
                  height: '15px',
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& .MuiInputBase-root': {
                    height: 30,
                    fontSize: '0.8rem',
                    fontFamily: 'sans-serif',
                  },
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

            <Grid container  spacing={{ xs: 2, sm: 3 }}>
              {filteredMonitors.map((monitor) => (
                <Grid item key={monitor.id}>
                  <Card
                    sx={{
                      height: 'auto',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                      borderRadius: 1,
                      border: '1px solid gray',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#ffff',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        backgroundColor: `${getStatusColor(
                          monitor.status
                        )}.main`,
                      },
                    }}
                  >
                    <CardHeader
                      avatar={<MonitorStatus sx={{width: 15, height: 15, animeWidth: 15, animeHeight: 15}} status={monitor.status} />}
                      title={
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: {
                              xs: '0.8rem',
                              sm: '0.8rem',
                              xlg: '1rem',
                            },
                          }}
                        >
                          {monitor.name}
                        </Typography>
                      }
                    />
                    <Divider />
                    <CardContent>
                      {<TimeInfoBox>
                      <Typography 
                        variant="h5" 
                        color="text.secondary"
                        sx={{
                          fontSize: {
                              xs: '0.8rem',
                              sm: '0.8rem',
                              xlg: '1rem',
                            },
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '200px', // Gerekli! Yoksa etki etmez
                          wordBreak: 'break-all'
                        }}
                      >
                        {monitor.host}
                      </Typography>
                    </TimeInfoBox>}

                      <Box
                        sx={{
                          mb: 3,
                          p: { xs: 1, sm: 2 },
                          borderRadius: 2,
                          backgroundColor: 'background.paper',
                          boxShadow: 1,
                          border: '1px solid',
                          borderColor: 'divider',
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
                            fontSize: {
                              xs: '0.6rem',
                              sm: '0.7rem',
                              xlg: '0.9rem',
                            },
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
                                sx={{
                                  fontSize: {
                                    xs: '0.6rem',
                                    sm: '0.7rem',
                                    xlg: '0.9rem',
                                  },
                                }}
                                labelSize={1}
                                value={
                                  monitorDates[monitor.id]?.startDateTime ||
                                  dayjs()
                                }
                                onChange={(newValue) =>
                                  handleDateChange(
                                    monitor.id,
                                    'startDateTime',
                                    newValue
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    InputProps: {
                                      sx: {
                                        '& input': {
                                          fontSize: '0.7rem',
                                        },
                                      },
                                    },
                                    InputLabelProps: {
                                      sx: {
                                        fontSize: '0.8rem',
                                      },
                                    },
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      // '& .MuiInputBase-input': {
                                      //   fontSize: {
                                      //     xs: '0.875rem',
                                      //     sm: '1rem',
                                      //   },
                                      // },
                                      '& .MuiInputLabel-root': {
                                        fontWeight: 200,
                                        fontSize: '0.3rem',
                                      },
                                      '& .MuiTextField-root': {
                                        fontWeight: 200,
                                        fontSize: '0.3rem',
                                      },
                                      '& .MuiOutlined-input': {
                                        fontSize: '0.3rem',
                                      },
                                      '& .MuiInputBase-input': {
                                        fontSize: '0.3rem',
                                      },
                                    }}
                                  />
                                )}
                                minDate={dayjs()}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TimePicker
                                label="Başlangıç Saati"
                                value={
                                  monitorDates[monitor.id]?.startDateTime ||
                                  dayjs()
                                }
                                onChange={(newValue) =>
                                  handleDateChange(
                                    monitor.id,
                                    'startDateTime',
                                    newValue
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    InputProps: {
                                      sx: {
                                        '& input': {
                                          fontSize: '0.7rem',
                                        },
                                      },
                                      /*endAdornment: (
                                        <InputAdornment position="start">
                                          <AccessTimeIcon sx={{ fontSize: '16px'}} />
                                        </InputAdornment>
                                      ),*/
                                      
                                      
                                    },
                                    InputLabelProps: {
                                      sx: {
                                        fontSize: '0.8rem',
                                      },
                                    },
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: <AccessTimeIcon sx={{ fontSize: '16px', display: 'block' }}/>
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
                                value={
                                  monitorDates[monitor.id]?.endDateTime ||
                                  dayjs()
                                }
                                onChange={(newValue) =>
                                  handleDateChange(
                                    monitor.id,
                                    'endDateTime',
                                    newValue
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    InputProps: {
                                      sx: {
                                        '& input': {
                                          fontSize: '0.7rem',
                                        },
                                      },
                                    },
                                    InputLabelProps: {
                                      sx: {
                                        fontSize: '0.8rem',
                                      },
                                    },
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      '& .MuiInputBase-input': {
                                        fontSize: {
                                          xs: '0.875rem',
                                          sm: '1rem',
                                        },
                                      },
                                    }}
                                  />
                                )}
                                minDate={
                                  monitorDates[monitor.id]?.startDateTime ||
                                  dayjs()
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TimePicker
                                label="Bitiş Saati"
                                value={
                                  monitorDates[monitor.id]?.endDateTime ||
                                  dayjs()
                                }
                                onChange={(newValue) =>
                                  handleDateChange(
                                    monitor.id,
                                    'endDateTime',
                                    newValue
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    InputProps: {
                                      sx: {
                                        '& input': {
                                          fontSize: '0.7rem',
                                        },
                                      },
                                    },
                                    InputLabelProps: {
                                      sx: {
                                        fontSize: '0.8rem',
                                      },
                                    },
                                  },
                                }}
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
                                            fontSize: {
                                              xs: '1rem',
                                              sm: '1.25rem',
                                            },
                                          }}
                                        />
                                      ),
                                    }}
                                    sx={{
                                      '& .MuiInputBase-input': {
                                        fontSize: {
                                          xs: '0.875rem',
                                          sm: '1rem',
                                        },
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
                            if (monitor.maintanance.status == true) {
                              handleCancelMaintenance(monitor.id)
                            } else {
                              handleSubmit(monitor.id)
                            }
                          } else {
                            handleSubmit(monitor.id)
                          }
                        }}
                        color={
                          monitor.maintanance != null
                            ? monitor.maintanance.status == true
                              ? 'error'
                              : 'primary'
                            : 'primary'
                        }
                        sx={{
                          padding: 1,
                          fontSize: {
                            sm: '0.4rem',
                            lg: '0.7rem',
                            xlg: '0.9rem',
                          },
                          textTransform: 'none',
                          boxShadow: 2,
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease',
                          alignItems: 'end',
                        }}
                      >
                        {monitor.maintanance != null
                          ? monitor.maintanance.status == true
                            ? 'Bakım Durumunu Durdur'
                            : 'Bakım Durumunu Başlat'
                          : 'Bakım Durumunu Başlat'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
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
