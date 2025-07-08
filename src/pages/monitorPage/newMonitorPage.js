import { useState, useEffect } from 'react'
import Sidebar from '../../components/sideBar/sideBar'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Tab,
  Tabs,
  IconButton,
  FormHelperText,
  Slider,
  Menu,
} from '@mui/material'
import {
  Language as LanguageIcon,
  Timer as TimerIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Help as HelpIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  DeveloperBoard as DeveloperBoardIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import ComputerIcon from '@mui/icons-material/Computer'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  HTTP_METHODS,
  INTERVAL_UNITS,
  REPORT_TIME_UNITS,
} from './constants/monitorConstants'
import { cookies } from '../../utils/cookie'
import { jwtDecode } from 'jwt-decode'
import AdminSidebar from '../../components/adminSideBar/adminSideBar'

const NewMonitorPage = (update = false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('http')
  const [friendlyName, setFriendlyName] = useState('')
  const [intervalUnit, setIntervalUnit] = useState('minutes')
  const [method, setMethod] = useState('GET')
  const [body, setBody] = useState()
  const [headers, setHeaders] = useState()
  const [allowedStatusCodes, setAllowedStatusCodes] = useState([])
  const [host, setHost] = useState('')
  const [interval, setInterval] = useState(5)
  const [timeout, setTimeout] = useState(30)
  const [alertContacts, setAlertContacts] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [emailInput, setEmailInput] = useState('')
  const [emailList, setEmailList] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const [userInfo, setUserInfo] = useState(location.state?.userInfo || {})
  useEffect(() => {
    console.log('Interval Unit:', intervalUnit)
    console.log('Interval Value:', interval)
    getIntervalLimits(intervalUnit)
  }, [intervalUnit])

  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const jwtToken = cookies.get('jwt-access')
        console.log('JWT Token:', jwtToken)
        if (jwtToken) {
          const decodedToken = jwtDecode(jwtToken)
          setRole(decodedToken.role)
        }
        const response = await api.get(`monitors/http/${params.id}`)
        console.log(response.data)
        setFriendlyName(response.data.monitor.name)
        setHost(response.data.host)
        setMethod(response.data.method)
        setBody(response.data.body ? JSON.stringify(response.data.body) : '')
        setHeaders(
          response.data.headers ? JSON.stringify(response.data.headers) : ''
        )
        setAllowedStatusCodes(
          response.data.allowedStatusCodes
            ? response.data.allowedStatusCodes.join(',')
            : ''
        )
        setInterval(response.data.monitor.interval)
        setIntervalUnit(response.data.monitor.intervalUnit)
        setTimeout(response.data.timeOut)
        setEmailList(response.data.monitor.alertContacts || [])
      } catch (error) {
        Swal.fire({
          title: 'Hata',
          text: 'Monitor bilgileri alınırken bir hata oluştu.',
          icon: 'error',
          confirmButtonText: 'Tamam',
        })
        turnMonitorPage()
        console.error('Monitor bilgileri alınırken hata oluştu:', error)
      }
    }
    if (update.update) {
      fetchMonitorData()
    } else {
      const jwtToken = cookies.get('jwt-access')
      console.log('JWT Token:', jwtToken)
      if (jwtToken) {
        const decodedToken = jwtDecode(jwtToken)
        console.log('Decoded Token:', decodedToken)
        setRole(decodedToken.role)
      }
    }
  }, [])
  const getIntervalLimits = (unit) => {
    switch (unit) {
      case 'seconds':
        setInterval(interval >= 20 && interval < 60 ? interval : 20)
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        setInterval(interval > 0 && interval < 60 ? interval : 0)
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        setInterval(interval > 0 && interval < 24 ? interval : 1)
        setMin(1)
        setMax(23)
        return { min: 1, max: 23 }
      default:
        return
    }
  }

  const createMonitor = async (e) => {
    try {
      const formattedData = {
        name: friendlyName,
        httpMonitor: {
          host: host,
          method: method,
          body: body
            ? typeof body === 'string'
              ? JSON.parse(body)
              : body
            : {},
          headers: headers
            ? typeof headers === 'string'
              ? JSON.parse(headers)
              : headers
            : {},
          allowedStatusCodes:
            allowedStatusCodes.length > 0
              ? [] //allowedStatusCodes.split(',').map((code) => code.trim())
              : [],
          timeOut: timeout,
        },
        interval: interval,
        intervalUnit: intervalUnit,
      }
      console.log(formattedData)
      console.log('Role:', role)
      const response = await api.post(
        role === 'admin' ? `monitors/http/${userInfo.id}` : `monitors/http/`,
        formattedData
      )
      console.log('Response:', response.data)
      if (response.data) {
        Swal.fire({
          title: 'İzleme Başarılı Şekilde Oluşturuldu',
          icon: 'success',
          confirmButtonText: 'Tamam',
        })
        turnMonitorPage()
      }
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Tamam',
      })
      console.error('Sunucu eklenirken hata oluştu:', error)
    }
  }

  const updateMonitor = async (e) => {
    try {
      const formattedData = {
        name: friendlyName,
        httpMonitor: {
          host: host,
          method: method,
          body: body
            ? typeof body === 'string'
              ? JSON.parse(body)
              : body
            : {},
          headers: headers
            ? typeof headers === 'string'
              ? JSON.parse(headers)
              : headers
            : {},
          allowedStatusCodes:
            allowedStatusCodes.length > 0
              ? allowedStatusCodes.split(',').map((code) => code.trim())
              : [],
          timeOut: timeout,
        },
        interval: interval,
        intervalUnit: intervalUnit,
      }
      console.log(formattedData)
      const response = await api.put(
        `monitors/http/${params.id}`,
        formattedData
      )
      console.log('Response:', response.data)
      if (response.data) {
        Swal.fire({
          title: 'İzleme Başarılı Şekilde Güncellendi',
          icon: 'success',
          confirmButtonText: 'Tamam',
        })
        turnMonitorPage()
      }
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Tamam',
      })
      console.error('Monitor update error :', error)
    }
  }

  const handleMonitorTypeChange = (event) => {
    setMonitorType(event.target.value)
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const turnMonitorPage = () => {
    console.log('Role:', userInfo)
    role === 'user'
      ? navigate('/user/monitors/')
      : navigate('/admin/userMonitors/', { state: { userInfo } })
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAddEmail = () => {
    if (
      isValidEmail(emailInput) &&
      emailInput &&
      !emailList.includes(emailInput)
    ) {
      setEmailList([...emailList, emailInput])
      setEmailInput('')
    }
  }

  const handleRemoveEmail = (emailToRemove) => {
    setEmailList(emailList.filter((email) => email !== emailToRemove))
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <Box sx={{ display: 'flex' }}>
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
        {role === 'admin' ? (
          <AdminSidebar status={isOpen} toggleSidebar={toggleSidebar} />
        ) : (
          <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
        )}
      </Box>
      <Box
        sx={{
          width: {
            xs: isOpen ? 0 : '100%',
            sm: isOpen ? 0 : '100%',
            md: isOpen ? '30%' : '2.5%',
            lg: isOpen ? '78%' : '80%',
            xlg: isOpen ? '80.74%' : '97.5%',
          },
          flexShrink: 0,
          flexGrow: 1,
          pt: { xs: 2, sm: 3 },
          pr: { xs: 2, sm: 3 },
          pl: 1,
          margin: '0 auto',
          transition: 'margin-left 0.3s',
          position: 'relative',
        }}
      >
        {/*<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>*/}
        {/*<Paper sx={{ p: 4 }}>*/}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 2,
            gap: 1,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              fontSize: {
                xs: '0.8rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.2rem',
                xlg: '1.5rem',
              },
            }}
          >
            {update.update ? 'Monitoring Güncelle' : 'Monitoring ekle'}
          </Typography>
          <IconButton
            onClick={toggleSidebar}
            sx={{
              display: { xs: 'flex', sm: 'flex', md: 'none' },
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
        {/* Monitor Type Selection */}
        <Grid
          container
          gap={1}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          {/*Birinci satır*/}
          <Grid item md={12} gap={1} display={'flex'}>
            <Grid item md={6} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} /*alignContent={'end'}*/>
                <Typography gutterBottom>Monitoring Tipi</Typography>
              </Grid>
              <Grid item md={12}>
                <FormControl sx={{ width: '100%'}}>
                    <Select
                      fullWidth
                      value={monitorType}
                      onChange={handleMonitorTypeChange}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'white', // Açılır MENÜ arkaplanı
                          },
                        },
                      }}
                      sx={{
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0,
                          py: 0.6,
                          bgcolor:'white'
                        },
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#ccc', // opsiyonel: gri border
                        },
                        '&:hover fieldset': {
                            borderColor: '#',
                         },
                        '&.Mui-focused fieldset': {
                           borderColor: '#1976d2', // focus olduğunda
                          },

                      }}
                    >
                      <MenuItem value="http" sx={{bgcolor:'white'}}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            bgcolor:'white'
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: '#3f51b5',
                              p: 0.6,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 48,
                            }}
                          >
                            <PublicIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="500">
                              HTTP(S)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Web sitelerini ve web api servislerini izleyin
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        disabled={update.update ? true : false}
                        value="ping"
                        sx={{bgcolor:'white'}}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            bgcolor: 'white'
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: '#4caf50',
                              p: 0.6,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 48,
                            }}
                          >
                            <ComputerIcon
                              sx={{ color: 'white', fontSize: 20 }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="500">
                              PING
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ağ bağlantısından ICMP protokolünden izleyin
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        disabled={update.update ? true : false}
                        value="port"
                        sx={{bgcolor:'white'}}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: '#ff9800',
                              p: 0.6,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 48,
                            }}
                          >
                            <DeveloperBoardIcon
                              sx={{ color: 'white', fontSize: 20 }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="500">
                              PORT
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Belirli bağlantı portları izleyin
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        disabled={update.update ? true : false}
                        value="keyword"
                        sx={{bgcolor:'white'}}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: '#e91e63',
                              p: 0.6,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 48,
                            }}
                          >
                            <CodeIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="500">
                              KEYWORD
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Web servislerdeki belirli anahtar kelimeleri
                              izleyin
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        disabled={update.update ? true : false}
                        value="cronjob"
                        sx={{bgcolor:'white'}}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: '#3f51b5',
                              p: 0.6,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 48,
                            }}
                          >
                            <TimerIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="500">
                              CRON JOB
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Tekrarlanan işleri izleyin
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <Divider />
                    </Select>
                    <FormHelperText
                      sx={{
                        justifyContent: 'start',
                        alignItems: 'center',
                        //bgcolor: '#99a7fa',
                      }}
                    ></FormHelperText>
                  </FormControl>
              </Grid>
            </Grid>
            <Grid item md={6} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                <Typography variant="subtitle1" gutterBottom></Typography>
              </Grid>
              <Grid item md={12}>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}
                  >
                    <InfoIcon
                      sx={{ fontSize: 20, mr: 0.5, color: 'primary.main' }}
                    />
                    <Typography variant="p" color="text.secondary">
                      {monitorType === 'http'
                        ? 'Web sitenizi, API uç noktanızı veya HTTP üzerinde çalışan herhangi bir şeyi izlemek için HTTP(S) izleyicisini kullanın.'
                        : monitorType === 'ping'
                        ? role === 'user'
                          ? navigate('/user/monitors/new/ping')
                          : navigate('/admin/monitors/new/ping', {
                              state: { userInfo },
                            })
                        : monitorType === 'port'
                        ? role === 'user'
                          ? navigate('/user/monitors/new/port')
                          : navigate('/admin/monitors/new/port', {
                              state: { userInfo },
                            })
                        : monitorType === 'keyword'
                        ? role === 'user'
                          ? navigate('/user/monitors/new/keyword')
                          : navigate('/admin/monitors/new/keyword', {
                              state: { userInfo },
                            })
                        : monitorType === 'cronjob'
                        ? role === 'user'
                          ? navigate('/user/monitors/new/cronjob')
                          : navigate('/admin/monitors/new/cronjob', {
                              state: { userInfo },
                            })
                        : 'Select a monitor type to get started.'}
                    </Typography>
                  </Box>
              </Grid>
            </Grid>
          </Grid>
          
          {/*İkincii satır*/}
          <Grid item md={12} gap={1} display={'flex'}>
            <Grid item md={6} height={'50%'} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item  md={12} alignContent={'end'}>
                <Typography gutterBottom>Ad</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  required
                  fullWidth
                  InputProps={{
                    sx: {
                      height: 30,
                      padding: 0,
                      fontSize: '0.7rem',
                      '& input': {
                        padding: '0 8px', // input için padding
                        height: '100%', // input yüksekliğini tam yap
                        display: 'flex',
                        alignItems: 'center', // input içeriğini ortala
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.7rem',
                      // Label pozisyonunu ayarla
                      transform: 'translate(8px, -15px) scale(1)', // normal pozisyon
                      '&.Mui-focused, &.MuiFormLabel-filled': {
                        transform: 'translate(10px, -30px) scale(0.75)', // focus/filled pozisyon
                      },
                      // Label'ı input alanına göre ortala
                      top: '50%',
                      transformOrigin: 'left center',
                      marginTop: '-0.5em',
                    },
                  }}
                  label="Tanımlayıcı ad"
                  value={friendlyName}
                  onChange={(e) => setFriendlyName(e.target.value)}
                  helperText="İzleme için tanımlayıcı bir ad belirleyin"
                />
              </Grid>
            </Grid>
            <Grid item md={6} height={'50%'} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Url</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  required
                  fullWidth
                  InputProps={{
                    sx: {
                      height: 30,
                      padding: 0,
                      fontSize: '0.7rem',
                      '& input': {
                        padding: '0 8px', // input için padding
                        height: '100%', // input yüksekliğini tam yap
                        display: 'flex',
                        alignItems: 'center', // input içeriğini ortala
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.7rem',
                      // Label pozisyonunu ayarla
                      transform: 'translate(8px, -15px) scale(1)', // normal pozisyon
                      '&.Mui-focused, &.MuiFormLabel-filled': {
                        transform: 'translate(10px, -30px) scale(0.75)', // focus/filled pozisyon
                      },
                      // Label'ı input alanına göre ortala
                      top: '50%',
                      transformOrigin: 'left center',
                      marginTop: '-0.5em',
                    },
                  }}
                  label={'URL (veya IP)'}
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder={'https://rahatup.com'}
                  helperText={
                    'İzlenecek URL http:// veya https:// protokolünde olmalı'
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          {/*Üçüncü satır*/}
          <Grid item md={12} gap={1} display={'flex'}>
            <Grid item md={6} height={'50%'} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12}  /*alignContent={'end'}*/>
                <Typography gutterBottom>İstek Zaman Aralığı</Typography>
              </Grid>
              <Grid item md={12} gap={3} display={'flex'}>
                <Grid item md={9}>
                  <FormControl fullWidth>
                            <Slider
                              sx={{
                                color: '#1976d2',
                                height: 4, // Track kalınlığı
                                '& .MuiSlider-thumb': {
                                  width: 10,
                                  height: 10,
                                },
                                '& .MuiSlider-track': {
                                  border: 'none', // varsa kalın kenar çizgilerini kapatır
                                },
                                '& .MuiSlider-rail': {
                                  opacity: 0.5,
                                  height: 4,
                                },
                              }}
                              name="interval"
                              value={interval}
                              onChange={(e) => setInterval(e.target.value)}
                              min={min}
                              max={max}
                              step={1}
                              valueLabelDisplay="auto" // Değeri üzerinde gösterir
                              marks={[
                                { value: min, label: `${min}` }, // Min değeri etiketliyor
                                { value: max, label: `${max}` }, // Max değeri etiketliyor
                              ]}
                            />
                </FormControl>
                </Grid>
                <Grid item md={3}>
                  <FormControl fullWidth>
                            <Select
                              name="intervalUnit"
                              value={intervalUnit || 'dakika'}
                              // label="Birim"
                              onChange={(e) => {
                                setIntervalUnit(e.target.value)
                              }}
                              variant="outlined"
                              sx={{
                                fontSize: '0.8rem',
                              }}
                            >
                              {INTERVAL_UNITS.map((unit) => (
                                <MenuItem
                                  sx={{ fontSize: '0.8rem' }}
                                  key={unit.value}
                                  value={unit.value}
                                >
                                  {unit.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                </Grid>
                
              </Grid>
            </Grid>
            <Grid item md={6} height={'50%'} bgcolor={'white'} border={'solid 1px gray'}  padding={2}  display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Method</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                            fullWidth
                            label="HTTP Metot"
                            select
                            defaultValue={update.update ? method : 'GET'}
                            onChange={(e) => setMethod(e.target.value)}
                            InputProps={{
                              sx: {
                                fontSize: '0.8rem',
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: '0.8rem',
                              },
                            }}
                          >
                            <MenuItem sx={{ fontSize: '0.8rem', bgcolor:'white' }} value="GET">
                              GET
                            </MenuItem>
                            <MenuItem sx={{ fontSize: '0.8rem', bgcolor:'white' }} value="POST">
                              POST
                            </MenuItem>
                            <MenuItem sx={{ fontSize: '0.8rem', bgcolor:'white' }} value="PUT">
                              PUT
                            </MenuItem>
                            <MenuItem
                              sx={{ fontSize: '0.8rem', bgcolor:'white' }}
                              value="DELETE"
                            >
                              DELETE
                            </MenuItem>
                            <MenuItem sx={{ fontSize: '0.8rem', bgcolor:'white' }} value="PATCH">
                              PATCH
                            </MenuItem>
                            <MenuItem sx={{ fontSize: '0.8rem', bgcolor:'white' }} value="HEAD">
                              HEAD
                            </MenuItem>
                          </TextField>
              </Grid>
            </Grid>
          </Grid>
          {/*Dördüncü satır*/}
          <Grid item md={12} gap={1} display={'flex'}>
            <Grid item md={6} height={'50%'} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Başlık</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                            fullWidth
                            label="Özel HTTP Başlıkları (JSON)"
                            multiline
                            rows={7}
                            sx={{
                              mb: 2,
                            }}
                            name="headers"
                            value={
                              typeof headers === 'object'
                                ? JSON.stringify(headers)
                                : headers
                            }
                            onChange={(e) => setHeaders(e.target.value)}
                            variant="outlined"
                            size="small"
                            InputProps={{
                              sx: {
                                fontSize: '0.8rem',
                                '& textarea': {
                                  maxHeight: '200px', // yüksekliği sınırla
                                  overflowY: 'auto', // dikey scroll bar
                                },
                              },
                              startAdornment: (
                                <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
                              ),
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: '0.8rem',
                              },
                            }}
                          />
              </Grid>
            </Grid>
            <Grid item md={6} height={'50%'} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} /*alignContent={'end'}*/>
                <Typography  gutterBottom>Gövde</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                            fullWidth
                            label="Özel HTTP Gövdesi (JSON)"
                            multiline
                            rows={7}
                            sx={{ mb: 2 }}
                            name="body"
                            value={
                              typeof body === 'object'
                                ? JSON.stringify(body)
                                : body
                            }
                            onChange={(e) => setBody(e.target.value)}
                            variant="outlined"
                            size="small"
                            // helperText="POST, PUT veya PATCH istekleri için gönderilecek veri"
                            InputProps={{
                              sx: {
                                fontSize: '0.8rem',
                                '& textarea': {
                                  maxHeight: '200px', // yüksekliği sınırla
                                  overflowY: 'auto', // dikey scroll bar
                                },
                              },
                              startAdornment: (
                                <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
                              ),
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: '0.8rem',
                              },
                            }}
                          />
              </Grid>
            </Grid>
          </Grid>
          {/*Beşinci satır*/}
          <Grid item md={12} gap={1} display={'flex'}>
            <Grid item md={6} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                <Typography variant="subtitle1" gutterBottom>İstek Zaman Aşımı</Typography>
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                    <Select
                      value={timeout}
                      onChange={(e) => setTimeout(e.target.value)}
                      // label='Timeout'
                      sx={{
                        fontSize: '0.8rem',
                      }}
                    >
                      <MenuItem sx={{ fontSize: '0.8rem' }} value={10}>
                        10 saniye
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '0.8rem' }} value={20}>
                        20 saniye
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '0.8rem' }} value={30}>
                        30 saniye
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '0.8rem' }} value={40}>
                        40 saniye
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '0.8rem' }} value={50}>
                        50 saniye
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '0.8rem' }} value={60}>
                        60 saniye
                      </MenuItem>
                    </Select>
                  </FormControl>
              </Grid>
            </Grid>
            <Grid item md={6} bgcolor={'white'} border={'solid 1px gray'}  padding={2} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                <Typography variant="subtitle1" gutterBottom>İzin Verilen Durum Kodlar</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                            required
                            fullWidth
                            InputProps={{
                              sx: {
                                height: 30,
                                padding: 0,
                                fontSize: '0.7rem',
                                '& input': {
                                  padding: '0 8px', // input için padding
                                  height: '100%', // input yüksekliğini tam yap
                                  display: 'flex',
                                  alignItems: 'center', // input içeriğini ortala
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                fontSize: '0.7rem',
                                // Label pozisyonunu ayarla
                                transform: 'translate(8px, -15px) scale(1)', // normal pozisyon
                                '&.Mui-focused, &.MuiFormLabel-filled': {
                                  transform:
                                    'translate(10px, -30px) scale(0.75)', // focus/filled pozisyon
                                },
                                // Label'ı input alanına göre ortala
                                top: '50%',
                                transformOrigin: 'left center',
                                marginTop: '-0.5em',
                              },
                            }}
                            label="İzin Verilen Status Kodları"
                            name="allowedStatusCodes"
                            value={
                              Array.isArray(allowedStatusCodes)
                                ? allowedStatusCodes.join(',')
                                : allowedStatusCodes
                            }
                            onChange={(e) =>
                              setAllowedStatusCodes(e.target.value)
                            }
                            variant="outlined"
                            size="small"
                            helperText="Virgülle ayırarak yazın (örn: 200,201,409)"
                          />
              </Grid>
            </Grid>
          </Grid>
          {/*Altıncı satır*/}
          <Grid item md={12} gap={1} display={'flex'}>
            <Grid item md={6} display={'flex'} flexDirection={'column'}>
              {/* <Grid item md={12} alignContent={'end'}>
                <Typography variant="subtitle1" gutterBottom>Bildirim Atılacaklar</Typography>
               </Grid> 
               <Grid item md={12}>
                 <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                    Bildirim Atılacaklar
                  </Typography>
                  ...
                 </Box>
               </Grid>*/}
            </Grid>
            <Grid item md={6}  display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                 <Box
                 sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
               >
                <Box>
                   <Button
                   variant="outlined"
                   color="inherit"
                   sx={{
                    fontSize: '0.8rem',
                   }}
                   onClick={() => turnMonitorPage()}
                 >
                   İptal
                 </Button>
                </Box>
                 <Box>
                   <Button
                     variant="contained"
                     color="primary"
                     sx={{
                      fontSize: '0.8rem',
                     }}
                     onClick={() => {
                       update.update ? updateMonitor() : createMonitor()
                     }}
                   >
                     {update.update ? 'İzleme Güncelle' : 'İzleme Oluştur'}
                   </Button>
                 </Box>
               </Box>
                 <Typography variant="subtitle1" gutterBottom></Typography>
               </Grid>
               <Grid item md={12}>
                 
               </Grid>
             </Grid>
           </Grid>

           {/**Boş***** */}
           
         </Grid>

        {/*</Paper>}
        {/*</Container>*/}
      </Box>
    </Box>
  )
}

{/*activeTab === 2 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Authentication Type</InputLabel>
                          <Select defaultValue="" label="Authentication Type">
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="basic">HTTP Basic</MenuItem>
                            <MenuItem value="digest">HTTP Digest</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          disabled={activeTab !== 2}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          disabled={activeTab !== 2}
                        />
                      </Grid>
                    </Grid>
                  )*/}
export default NewMonitorPage
