/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sideBar/sideBar'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Alert,
  Select,
  Divider,
  IconButton,
  FormHelperText,
  Slider,
  useTheme,
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
  Menu as MenuIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import ComputerIcon from '@mui/icons-material/Computer'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  HTTP_METHODS,
  INTERVAL_UNITS,
} from './constants/monitorConstants'
import AdminSidebar from '../../components/adminSideBar/adminSideBar'
import { jwtDecode } from 'jwt-decode'
import { cookies } from '../../utils/cookie'
import { useFormik } from 'formik'
import { newKeywordMonitorFormShhema } from '../../utils/formSchema/formSchemas'
const keyWordMonitorPage = (update = false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('keyword')
  const [alertContacts, setAlertContacts] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [emailInput, setEmailInput] = useState('')
  const [emailList, setEmailList] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [role, setRole] = useState('')
  const theme = useTheme();
  const navigate = useNavigate()
  const location = useLocation()
  const [userInfo, setUserInfo] = useState(location.state?.userInfo || {})
 
  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const jwtToken = cookies.get('jwt-access')
        console.log('JWT Token:', jwtToken)
        if (jwtToken) {
          const decodedToken = jwtDecode(jwtToken)
          setRole(decodedToken.role)
        }
        const response = await api.get(`monitors/keyword/${params.id}`)
        values.name=response.data.monitor.name;
        values.host= response.data.host;
        values.method= response.data.method;
        values.headers= response.data.headers.length > 0
            ? JSON.stringify(response.data.headers)
            : '';
        values.body= response.data.body.length > 0
            ? JSON.stringify(response.data.body)
            : '';
        values.keyWordType = response.data.keyWordType || 'txt';
        values.keyWord = response.data.keyWord;
        values.allowedStatusCodes= response.data.allowedStatusCodes
            ? response.data.allowedStatusCodes.join(',')
            : '';
        values.interval= response.data.monitor.interval;
        values.intervalUnit= response.data.monitor.intervalUnit;
        values.timeOut = response.data.timeOut;
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
        setRole(decodedToken.role)
      }
    }
  }, [])

  const getIntervalLimits = (unit) => {
    switch (unit) {
      case 'seconds':
        values.interval=values.interval >= 20 && values.interval < 60 ? values.interval : 20
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        values.interval=values.interval > 0 && values.interval < 60 ? values.interval : 0
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        values.interval=values.interval > 0 && values.interval < 24 ? values.interval : 1;
        setMin(1)
        setMax(23)
        return { min: 1, max: 23 }
      default:
        return
    }
  }

  const createMonitor = async (values, actions) => {
    try {
      const formattedData = {
        name: values.name,
        keyWordMonitor: {
          host: values.host,
          method: values.method,
          body: values.body.length > 0 ? JSON.parse(values.body) : {},
          headers: values.headers.length > 0 ? JSON.parse(values.headers) : {},
          keyWordType: values.keyWordType,
          keyWord: values.keyWord,
          allowedStatusCodes:
            values.allowedStatusCodes.length > 0
              ? values.allowedStatusCodes.split(',').map((code) => code.trim())
              : [],
          timeOut: values.timeOut,
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
      }
      console.log(formattedData)
      const response = await api.post(
        role === 'admin'
          ? `monitors/keyword/${userInfo.id}`
          : `monitors/keyword/`,
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

  const updateMonitor = async (values, actions) => {
    try {
      // const formattedData = {
      //   name: friendlyName,
      //   keyWordMonitor: {
      //     host: host,
      //     method: method,
      //     body: body
      //       ? typeof body === 'string'
      //         ? JSON.parse(body)
      //         : body
      //       : {},
      //     headers: headers
      //       ? typeof headers === 'string'
      //         ? JSON.parse(headers)
      //         : headers
      //       : {},
      //     allowedStatusCodes:
      //       allowedStatusCodes.length > 0
      //         ? allowedStatusCodes.split(',').map((code) => code.trim())
      //         : [],
      //     keyWord: keyword,
      //     timeOut: timeout,
      //   },
      //   interval: interval,
      //   intervalUnit: intervalUnit,
      // }
      const formattedData = {
        name: values.name,
        keyWordMonitor: {
          host: values.host,
          method: values.method,
          body: values.body.length > 0 ? JSON.parse(values.body) : {},
          headers: values.headers.length > 0 ? JSON.parse(values.headers) : {},
          keyWordType: values.keyWordType,
          keyWord: values.keyWord,
          allowedStatusCodes:
            values.allowedStatusCodes.length > 0
              ? values.allowedStatusCodes.split(',').map((code) => code.trim())
              : [],
          timeOut: values.timeOut,
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
      }
      console.log(formattedData)
      const response = await api.put(
        `monitors/keyword/${params.id}`,
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

    const { values, errors, isValid, handleChange, handleSubmit, setFieldValue  } = useFormik({
      isInitialValid: false,
      initialValues: {
        name: '',
        host: '',
        method: 'GET',
        body: '',
        headers: '',
        keyWord: '',
        keyWordType: 'txt',
        allowedStatusCodes: '',
        timeOut: 30,
        interval: 5,
        intervalUnit: 'minutes',
      },
      validationSchema: newKeywordMonitorFormShhema,
      onSubmit: update.update? updateMonitor: createMonitor,
    })
  
      useEffect(() => {
      console.log('Interval Unit:', values.intervalUnit)
      console.log('Interval Value:', values.interval)
      getIntervalLimits(values.intervalUnit)
    }, [values.intervalUnit])

   return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: {
            xs: isOpen ? '100%' : 0,
            sm: isOpen ? '100%' : 0,
            md: isOpen ? '15%' : 0,
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
            md: isOpen ? '85%' : '100%',
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
              display: { xs: 'flex', sm:  'flex', md: isOpen? 'none' : 'flex', lg: 'none', xlg: 'none' },
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
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderRadius: '12px',
          }}
          mb={1}
        >
          {/*Alert */}
          <Grid
            item
            md={12}
            padding={2}
            display={'flex'}
            flexDirection={'column'}
          >
            <Grid item md={12} alignContent={'end'}>
              <Typography variant="subtitle1" gutterBottom></Typography>
            </Grid>
            <Grid item md={12}>
              <Alert severity="info">
                {monitorType === 'http'
                        ? role === 'user'
                          ? navigate('/user/monitors/new/http')
                          : navigate('/admin/monitors/new/http', {
                              state: { userInfo },
                            })
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
                        ? `Anahtar Kelime Monitörü, belirli bir web sayfasının
                           içeriğinde sizin belirlediğiniz kelimelerin var olup
                           olmadığını düzenli aralıklarla kontrol eder. Belirttiğiniz
                           kelime bulunmazsa ya da istenmeyen bir kelime tespit edilirse
                           sizi uyarır. Bu sayede, bir hata mesajı, bakım bildirimi ya da
                           içerik değişikliği gibi durumları hızlıca fark edebilirsiniz.`
                        : monitorType === 'cronjob'
                        ? role === 'user'
                          ? navigate('/user/monitors/new/cronjob')
                          : navigate('/admin/monitors/new/cronjob', {
                              state: { userInfo },
                            })
                        : 'Select a monitor type to get started.'}
              </Alert>
            </Grid>
          </Grid>
          {/*Birinci satır*/}
          <Grid item md={12} gap={1} display={'flex'}>
            <Grid
              item
              md={12}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
            >
              <Grid item md={12} /*alignContent={'end'}*/>
                <Typography gutterBottom>Monitoring Tipi</Typography>
              </Grid>
              <Grid item md={12}>
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    fullWidth
                    value={monitorType}
                    onChange={handleMonitorTypeChange}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'white',
                        },
                      },
                    }}
                    sx={{
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0,
                        py: 0.6,
                      },
                    }}
                  >
                    <MenuItem disabled={update.update ? true : false} value="http" sx={{ bgcolor: 'white' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          width: '100%',
                          //bgcolor: 'white',
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
                      sx={{
                        bgcolor: 'white',
                        ':hover': { bgcolor: '#b1d1f1c5' },
                      }}
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
                            bgcolor: '#4caf50',
                            p: 0.6,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 48,
                          }}
                        >
                          <ComputerIcon sx={{ color: 'white', fontSize: 20 }} />
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
                      sx={{
                        bgcolor: 'white',
                        ':hover': { bgcolor: '#b1d1f1c5' },
                      }}
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
                      
                      value="keyword"
                      sx={{
                        bgcolor: 'white',
                        ':hover': { bgcolor: '#b1d1f1c5' },
                      }}
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
                            Web servislerdeki belirli anahtar kelimeleri izleyin
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      disabled={update.update ? true : false}
                      value="cronjob"
                      sx={{
                        bgcolor: 'white',
                        ':hover': { bgcolor: '#b1d1f1c5' },
                      }}
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
                          <Typography variant="subtitle2" fontWeight="500">
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
          </Grid>
          <Divider />
          {/*İkincii satır*/}
          <Grid item md={12} display={'flex'}>
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
            >
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Ad</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="name"
                  required
                  fullWidth
                  InputProps={{
                    sx: {
                      height: 35,
                      fontSize: '0.8rem',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.8rem',
                    },
                  }}
                  label="Tanımlayıcı ad"
                  value={values.name}
                  onChange={handleChange}
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.name || ' '}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
            >
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Url</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="host"
                  required
                  fullWidth
                  InputProps={{
                    sx: {
                      height: 35,
                      fontSize: '0.8rem',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.8rem',
                    },
                  }}
                  label={'URL (veya IP)'}
                  value={values.host}
                  onChange={handleChange}
                  placeholder={'https://rahatup.com'}
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.host || ' '}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          {/*Üçüncü satır*/}
          <Grid item md={12} display={'flex'}>
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
              gap={1}
            >
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Kontrol Zaman Aralığı</Typography>
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
                      id="interval"
                      name="interval"
                      value={values.interval}
                      onChange={handleChange}
                      min={min}
                      max={max}
                      step={1}
                      valueLabelDisplay="auto" // Değeri üzerinde gösterir
                      marks={[
                        { value: min, label: `${min}` }, // Min değeri etiketliyor
                        { value: max, label: `${max}` }, // Max değeri etiketliyor
                      ]}
                    />
                    <FormHelperText>
                      <Typography
                        variant="body2"
                        sx={{ color: 'red', minHeight: '1.5em' }}
                      >
                        {errors.interval}
                      </Typography>
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  <FormControl fullWidth>
                    <Select
                      id="intervalUnit"
                      name="intervalUnit"
                      value={values.intervalUnit || 'dakika'}
                      onChange={handleChange}
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
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
              gap={1}
            >
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Metot</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="method"
                  name="method"
                  fullWidth
                  label="HTTP Metot"
                  select
                  value={values.method}
                  onChange={(e)=>setFieldValue("method",e.target.value)}
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '2rem' }}
                    >
                      {errors.method}
                    </Typography>
                  }
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
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="GET"
                  >
                    GET
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="POST"
                  >
                    POST
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="PUT"
                  >
                    PUT
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="DELETE"
                  >
                    DELETE
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="PATCH"
                  >
                    PATCH
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="HEAD"
                  >
                    HEAD
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <Grid item md={12} display={'flex'} flexDirection={'column'}>
          {/*Dördüncü satır*/}
          <Grid item md={12} display={'flex'}>
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
              gap={1}
            >
              <Grid item md={12} alignContent={'start'}>
                <Typography gutterBottom>Başlık</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="headers"
                  fullWidth
                  label="Özel HTTP Başlıkları (JSON)"
                  multiline
                  rows={9}
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.headers}
                    </Typography>
                  }
                  sx={{
                    mb: 0,
                  }}
                  name="headers"
                  value={
                    values.headers
                  }
                  onChange={(e)=>setFieldValue('headers',e.target.value)}
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
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
              gap={1}
            >
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>Gövde</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="body"
                  fullWidth
                  label="Özel HTTP Gövdesi (JSON)"
                  multiline
                  rows={9}
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.body}
                    </Typography>
                  }
                  sx={{ mb: 0 }}
                  name="body"
                  value={
                    values.body
                  }
                  onChange={(e)=>setFieldValue('body',e.target.value)}
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
            
          </Grid> </Grid> 
          <Divider />
          {/*Beşinci satır*/}
          <Grid item md={12} display={'flex'}>
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
              gap={1}
            >
              <Grid item md={12} alignContent={'end'} >
                <Typography gutterBottom>Anahtar Kelime</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="keyWord"
                  fullWidth
                  label="TXT/HTML/JSON"
                  multiline
                  rows={3}
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.keyWord}
                    </Typography>
                  }
                  name="keyWord"
                  value={
                    values.keyWord
                  }
                  onChange={(e)=>setFieldValue('keyWord',e.target.value)}
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
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
            >
              <Grid item md={12} alignContent={'start'}>
                <Typography gutterBottom>Anahtar Kelime Tipi</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="keyWordType"
                  name="keyWordType"
                  fullWidth
                  select
                  label="Anahtar Tipi"
                  sx={{pb:3.1}}
                  value={values.keyWordType}
                  onChange={(e)=>setFieldValue("keyWordType",e.target.value)}
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '2rem' }}
                    >
                      {errors.keyWordType}
                    </Typography>
                  }
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
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="txt"
                  >
                    TXT
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="html"
                  >
                    HTML
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '0.8rem', bgcolor: 'white' }}
                    value="json"
                  >
                    JSON
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          {/*Altıncı satır*/}
          <Grid item md={12} display={'flex'}>
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
            >
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>İstek Zaman Aşımı</Typography>
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <Select
                    id="timeOut"
                    name="timeOut"
                    value={values.timeOut}
                    onChange={(e)=>setFieldValue('timeOut',e.target.value)}
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
                  <FormHelperText>
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.timeOut}
                    </Typography>
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              item
              md={6}
              padding={2}
              display={'flex'}
              flexDirection={'column'}
            >
              <Grid item md={12} alignContent={'end'}>
                <Typography gutterBottom>İzin Verilen Durum Kodlar</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  id="allowedStatusCodes"
                  required
                  fullWidth
                  InputProps={{
                    sx: {
                      height: 35,
                      fontSize: '0.8rem',
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '0.8rem',
                    },
                  }}
                  label="İzin Verilen Durum Kodları"
                  name="allowedStatusCodes"
                  value={
                    values.allowedStatusCodes
                  }
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  helperText={
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.allowedStatusCodes || ' '}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Divider />    
          {/*Yedinci satır*/}
          <Grid item md={12} display={'flex'} mt={2} mb={2}>
            {/* <Grid item md={6} display={'flex'} flexDirection={'column'}>
              <Grid item md={12} alignContent={'end'}>
                <Typography variant="subtitle1" gutterBottom>Bildirim Atılacaklar</Typography>
               </Grid> 
               <Grid item md={12}>
                 <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                    Bildirim Atılacaklar
                  </Typography>
                  ...
                 </Box>
               </Grid>
            </Grid> */}

            <Grid
              item
              md={6}
              display={'flex'}
              justifyContent={'center'}
              alignContent={'center'}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    fontSize: '0.8rem',
                    width: '7rem',
                  }}
                  onClick={() => turnMonitorPage()}
                >
                  İptal
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              md={6}
              display={'flex'}
              alignContent={'center'}
              justifyContent={'center'}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontSize: '0.8rem',
                  width: '10rem',
                }}
                onClick={() => {
                  if(isValid){
                    if (update.update) {
                      handleSubmit()
                    }
                    else{
                      handleSubmit()
                    }
                  }
                  else{
                    Swal.fire({
                      icon: 'error',
                      title: 'Hata',
                      text: 'Lütfen Formu Tekrar Gözden Geçirin',
                      confirmButtonText: 'Tamam'
                    });
                    handleSubmit()
                  }
                  
                }}
              >
                {update.update ? 'İzleme Güncelle' : 'İzleme Oluştur'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )

  // return (
  //   <Box sx={{ display: 'flex' }}>
  //     <Box sx={{ width: '240px' }}>
  //       {role === 'admin' ? (
  //         <AdminSidebar status={isOpen} toggleSidebar={toggleSidebar} />
  //       ) : (
  //         <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
  //       )}
  //     </Box>
  //     <Box sx={{ flexGrow: 1 }}>
  //       <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
  //         <Paper sx={{ p: 4 }}>
  //           <Typography variant="h5" gutterBottom fontWeight="500">
  //             {update.update ? 'İzleme Güncelle' : 'İzleme ekle'}
  //           </Typography>

  //           {/* Monitor Type Selection */}
  //           <Box sx={{ mb: 4, mt: 3 }}>
  //             <Typography variant="subtitle1" fontWeight="500" gutterBottom>
  //               İzleme Tipi
  //             </Typography>
  //             <FormControl fullWidth>
  //               <Select
  //                 value={monitorType}
  //                 onChange={handleMonitorTypeChange}
  //                 displayEmpty
  //                 sx={{
  //                   '& .MuiSelect-select': {
  //                     display: 'flex',
  //                     alignItems: 'center',
  //                     gap: 2,
  //                     py: 2,
  //                   },
  //                 }}
  //               >
  //                 <MenuItem
  //                   disabled={update.update ? true : false}
  //                   value="http"
  //                 >
  //                   <Box
  //                     sx={{
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       gap: 2,
  //                       width: '100%',
  //                     }}
  //                   >
  //                     <Box
  //                       sx={{
  //                         bgcolor: '#3f51b5',
  //                         p: 1.5,
  //                         borderRadius: 1,
  //                         display: 'flex',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         minWidth: 48,
  //                       }}
  //                     >
  //                       <PublicIcon sx={{ color: 'white', fontSize: 28 }} />
  //                     </Box>
  //                     <Box sx={{ flex: 1 }}>
  //                       <Typography variant="subtitle1" fontWeight="500">
  //                         HTTP(S)
  //                       </Typography>
  //                       <Typography variant="body2" color="text.secondary">
  //                         Web sitelerini ve web api servislerini izleyin
  //                       </Typography>
  //                     </Box>
  //                   </Box>
  //                 </MenuItem>
  //                 <Divider />
  //                 <MenuItem
  //                   disabled={update.update ? true : false}
  //                   value="ping"
  //                 >
  //                   <Box
  //                     sx={{
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       gap: 2,
  //                       width: '100%',
  //                     }}
  //                   >
  //                     <Box
  //                       sx={{
  //                         bgcolor: '#4caf50',
  //                         p: 1.5,
  //                         borderRadius: 1,
  //                         display: 'flex',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         minWidth: 48,
  //                       }}
  //                     >
  //                       <ComputerIcon sx={{ color: 'white', fontSize: 28 }} />
  //                     </Box>
  //                     <Box sx={{ flex: 1 }}>
  //                       <Typography variant="subtitle1" fontWeight="500">
  //                         Ping
  //                       </Typography>
  //                       <Typography variant="body2" color="text.secondary">
  //                         Ağ bağlantısından ICMP protokolünden izleyin
  //                       </Typography>
  //                     </Box>
  //                   </Box>
  //                 </MenuItem>
  //                 <Divider />
  //                 <MenuItem
  //                   disabled={update.update ? true : false}
  //                   value="port"
  //                 >
  //                   <Box
  //                     sx={{
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       gap: 2,
  //                       width: '100%',
  //                     }}
  //                   >
  //                     <Box
  //                       sx={{
  //                         bgcolor: '#ff9800',
  //                         p: 1.5,
  //                         borderRadius: 1,
  //                         display: 'flex',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         minWidth: 48,
  //                       }}
  //                     >
  //                       <DeveloperBoardIcon
  //                         sx={{ color: 'white', fontSize: 28 }}
  //                       />
  //                     </Box>
  //                     <Box sx={{ flex: 1 }}>
  //                       <Typography variant="subtitle1" fontWeight="500">
  //                         Port
  //                       </Typography>
  //                       <Typography variant="body2" color="text.secondary">
  //                         Belirli bağlantı portları izleyin
  //                       </Typography>
  //                     </Box>
  //                   </Box>
  //                 </MenuItem>
  //                 <Divider />
  //                 <MenuItem value="keyword">
  //                   <Box
  //                     sx={{
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       gap: 2,
  //                       width: '100%',
  //                     }}
  //                   >
  //                     <Box
  //                       sx={{
  //                         bgcolor: '#e91e63',
  //                         p: 1.5,
  //                         borderRadius: 1,
  //                         display: 'flex',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         minWidth: 48,
  //                       }}
  //                     >
  //                       <CodeIcon sx={{ color: 'white', fontSize: 28 }} />
  //                     </Box>
  //                     <Box sx={{ flex: 1 }}>
  //                       <Typography variant="subtitle1" fontWeight="500">
  //                         Keyword
  //                       </Typography>
  //                       <Typography variant="body2" color="text.secondary">
  //                         Web servislerdeki belirli anahtar kelimeleri izleyin
  //                       </Typography>
  //                     </Box>
  //                   </Box>
  //                 </MenuItem>
  //                 <Divider />
  //                 <MenuItem
  //                   disabled={update.update ? true : false}
  //                   value="cronjob"
  //                 >
  //                   <Box
  //                     sx={{
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       gap: 2,
  //                       width: '100%',
  //                     }}
  //                   >
  //                     <Box
  //                       sx={{
  //                         bgcolor: '#3f51b5',
  //                         p: 1.5,
  //                         borderRadius: 1,
  //                         display: 'flex',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         minWidth: 48,
  //                       }}
  //                     >
  //                       <TimerIcon sx={{ color: 'white', fontSize: 28 }} />
  //                     </Box>
  //                     <Box sx={{ flex: 1 }}>
  //                       <Typography variant="subtitle1" fontWeight="500">
  //                         CRON JOB
  //                       </Typography>
  //                       <Typography variant="body2" color="text.secondary">
  //                         Tekrarlanan işleri izleyin
  //                       </Typography>
  //                     </Box>
  //                   </Box>
  //                 </MenuItem>
  //                 <Divider />
  //               </Select>
  //               <FormHelperText>
  //                 <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
  //                   <InfoIcon
  //                     sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }}
  //                   />
  //                   <Typography variant="body2" color="text.secondary">
  //                     {monitorType === 'http'
  //                       ? role === 'user'
  //                         ? navigate('/user/monitors/new/http')
  //                         : navigate('/admin/monitors/new/http', {
  //                             state: { userInfo },
  //                           })
  //                       : monitorType === 'ping'
  //                       ? role === 'user'
  //                         ? navigate('/user/monitors/new/ping')
  //                         : navigate('/admin/monitors/new/ping', {
  //                             state: { userInfo },
  //                           })
  //                       : monitorType === 'port'
  //                       ? role === 'user'
  //                         ? navigate('/user/monitors/new/port')
  //                         : navigate('/admin/monitors/new/port', {
  //                             state: { userInfo },
  //                           })
  //                       : monitorType === 'keyword'
  //                       ? 'Anahtar kelime izleyicisi, bir web sayfasının içeriğinde belirli anahtar kelimeleri kontrol etmenizi sağlar.'
  //                       : monitorType === 'cronjob'
  //                       ? role === 'user'
  //                         ? navigate('/user/monitors/new/cronjob')
  //                         : navigate('/admin/monitors/new/cronjob', {
  //                             state: { userInfo },
  //                           })
  //                       : 'Select a monitor type to get started.'}
  //                   </Typography>
  //                 </Box>
  //               </FormHelperText>
  //             </FormControl>
  //           </Box>

  //           <Divider sx={{ my: 3 }} />

  //           {/* Monitor Details */}
  //           <Grid container spacing={3}>
  //             <Grid item xs={12}>
  //               <TextField
  //                 required
  //                 fullWidth
  //                 label="Tanımlayıcı ad"
  //                 value={friendlyName}
  //                 onChange={(e) => setFriendlyName(e.target.value)}
  //                 helperText="İzleme için tanımlayıcı bir ad belirleyin"
  //               />
  //             </Grid>
  //             <Grid item xs={12}>
  //               <TextField
  //                 required
  //                 fullWidth
  //                 label={'URL (veya IP)'}
  //                 value={host}
  //                 onChange={(e) => setHost(e.target.value)}
  //                 placeholder={'https://rahatup.com'}
  //                 helperText={
  //                   'İzlenecek URL http:// veya https:// prtokölünde olmalı'
  //                 }
  //               />
  //             </Grid>
  //           </Grid>

  //           {monitorType === 'keyword' && (
  //             <Box sx={{ mt: 3 }}>
  //               <Tabs
  //                 value={activeTab}
  //                 onChange={handleTabChange}
  //                 variant="scrollable"
  //                 scrollButtons="auto"
  //               >
  //                 <Tab label="Genel Ayarlar" />
  //                 <Tab label="İstek Detayı" />
  //                 {/*<Tab label="Authentication" />*/}
  //               </Tabs>

  //               <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
  //                 {activeTab === 0 && (
  //                   <Grid container spacing={3}>
  //                     <Grid item xs={12} sm={6}>
  //                       <Grid item sx={{ pb: 1 }}>
  //                         <InputLabel>Zaman</InputLabel>
  //                       </Grid>
  //                       <FormControl fullWidth>
  //                         <Slider
  //                           name="interval"
  //                           value={interval}
  //                           onChange={(e) => setInterval(e.target.value)}
  //                           min={min}
  //                           max={max}
  //                           step={1} // Her tıklamada 1 artar/azalır
  //                           valueLabelDisplay="auto" // Değeri üzerinde gösterir
  //                           marks={[
  //                             { value: min, label: `${min}` }, // Min değeri etiketliyor
  //                             { value: max, label: `${max}` }, // Max değeri etiketliyor
  //                           ]}
  //                           sx={{ color: '#1976d2' }} // Mavi renk
  //                         />
  //                       </FormControl>
  //                     </Grid>

  //                     <Grid item xs={12} sm={6}>
  //                       <Grid item sx={{ pb: 1 }}>
  //                         <InputLabel>Zaman Birimi</InputLabel>
  //                       </Grid>
  //                       <FormControl fullWidth>
  //                         <Select
  //                           name="intervalUnit"
  //                           value={intervalUnit || 'dakika'}
  //                           label="Birim"
  //                           onChange={(e) => {
  //                             setIntervalUnit(e.target.value)
  //                           }}
  //                           variant="outlined"
  //                         >
  //                           {INTERVAL_UNITS.map((unit) => (
  //                             <MenuItem key={unit.value} value={unit.value}>
  //                               {unit.label}
  //                             </MenuItem>
  //                           ))}
  //                         </Select>
  //                       </FormControl>
  //                     </Grid>
  //                   </Grid>
  //                 )}
  //                 {activeTab === 1 && (
  //                   <Grid container spacing={3}>
  //                     <Grid item xs={12}>
  //                       <TextField
  //                         fullWidth
  //                         label="HTTP Metot"
  //                         select
  //                         defaultValue={update.update ? method : 'GET'}
  //                         onChange={(e) => setMethod(e.target.value)}
  //                       >
  //                         <MenuItem value="GET">GET</MenuItem>
  //                         <MenuItem value="POST">POST</MenuItem>
  //                         <MenuItem value="PUT">PUT</MenuItem>
  //                         <MenuItem value="DELETE">DELETE</MenuItem>
  //                         <MenuItem value="PATCH">PATCH</MenuItem>
  //                         <MenuItem value="HEAD">HEAD</MenuItem>
  //                       </TextField>
  //                     </Grid>
  //                     <Divider sx={{ my: 3 }} />
  //                     <Grid item xs={12}>
  //                       <TextField
  //                         fullWidth
  //                         label="Özel HTTP Başlıkları (JSON)"
  //                         multiline
  //                         rows={3}
  //                         sx={{ mb: 2 }}
  //                         name="headers"
  //                         value={
  //                           typeof headers === 'object'
  //                             ? JSON.stringify(headers)
  //                             : headers
  //                         }
  //                         onChange={(e) => setHeaders(e.target.value)}
  //                         variant="outlined"
  //                         size="small"
  //                         InputProps={{
  //                           startAdornment: (
  //                             <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
  //                           ),
  //                         }}
  //                       />
  //                     </Grid>
  //                     <Divider sx={{ my: 3 }} />
  //                     <Grid item xs={12}>
  //                       <TextField
  //                         fullWidth
  //                         label="Özel HTTP Gövdesi (JSON)"
  //                         multiline
  //                         rows={3}
  //                         sx={{ mb: 2 }}
  //                         name="body"
  //                         value={
  //                           typeof body === 'object'
  //                             ? JSON.stringify(body)
  //                             : body
  //                         }
  //                         onChange={(e) => setBody(e.target.value)}
  //                         variant="outlined"
  //                         size="small"
  //                         helperText="POST, PUT veya PATCH istekleri için gönderilecek veri"
  //                         InputProps={{
  //                           startAdornment: (
  //                             <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
  //                           ),
  //                         }}
  //                       />
  //                     </Grid>
  //                     <Divider sx={{ my: 3 }} />
  //                     <Grid item xs={12} md={6}>
  //                       <TextField
  //                         required
  //                         fullWidth
  //                         label="İzin Verilen Status Kodları"
  //                         name="allowedStatusCodes"
  //                         value={
  //                           Array.isArray(allowedStatusCodes)
  //                             ? allowedStatusCodes.join(',')
  //                             : allowedStatusCodes
  //                         }
  //                         onChange={(e) =>
  //                           setAllowedStatusCodes(e.target.value)
  //                         }
  //                         variant="outlined"
  //                         size="small"
  //                         helperText="Virgülle ayırarak yazın (örn: 200,201,409)"
  //                       />
  //                     </Grid>
  //                     <Divider sx={{ my: 3 }} />
  //                     <Grid item xs={12} md={6}>
  //                       <TextField
  //                         required
  //                         fullWidth
  //                         label="Kontrol etmek istediğiniz anahtar kelimeyi girin"
  //                         name="Keyword"
  //                         value={keyword}
  //                         onChange={(e) => setKeyword(e.target.value)}
  //                         variant="outlined"
  //                         size="small"
  //                         helperText="Html veya Json formatında girin (örneğin: <h1>Anahtar Kelime</h1> veya {'anahtar': 'değer'})"
  //                       />
  //                     </Grid>
  //                   </Grid>
  //                 )}
  //                 {/*activeTab === 2 && (
  //                   <Grid container spacing={3}>
  //                     <Grid item xs={12}>
  //                       <FormControl fullWidth>
  //                         <InputLabel>Authentication Type</InputLabel>
  //                         <Select defaultValue="" label="Authentication Type">
  //                           <MenuItem value="">None</MenuItem>
  //                           <MenuItem value="basic">HTTP Basic</MenuItem>
  //                           <MenuItem value="digest">HTTP Digest</MenuItem>
  //                         </Select>
  //                       </FormControl>
  //                     </Grid>
  //                     <Grid item xs={12} sm={6}>
  //                       <TextField
  //                         fullWidth
  //                         label="Username"
  //                         disabled={activeTab !== 2}
  //                       />
  //                     </Grid>
  //                     <Grid item xs={12} sm={6}>
  //                       <TextField
  //                         fullWidth
  //                         label="Password"
  //                         type="password"
  //                         disabled={activeTab !== 2}
  //                       />
  //                     </Grid>
  //                   </Grid>
  //                 )*/}
  //               </Box>
  //             </Box>
  //           )}

  //           <Divider sx={{ my: 3 }} />
  //           <Grid container spacing={3}>
  //             <Grid item xs={12} sm={6}>
  //               <Grid item sx={{ pb: 1 }}>
  //                 <InputLabel>İstek Zaman Aşımı</InputLabel>
  //               </Grid>

  //               <FormControl fullWidth>
  //                 <Select
  //                   value={timeout}
  //                   onChange={(e) => setTimeout(e.target.value)}
  //                   label="Timeout"
  //                 >
  //                   <MenuItem value={10}>10 saniye</MenuItem>
  //                   <MenuItem value={20}>20 saniye</MenuItem>
  //                   <MenuItem value={30}>30 saniye</MenuItem>
  //                   <MenuItem value={40}>40 saniye</MenuItem>
  //                   <MenuItem value={50}>50 saniye</MenuItem>
  //                   <MenuItem value={60}>60 saniye</MenuItem>
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //           </Grid>
  //           {/* Alert Contacts */}
  //           <Divider sx={{ my: 3 }} />
  //           <Box sx={{ mb: 4 }}>
  //             <Typography variant="subtitle1" fontWeight="500" gutterBottom>
  //               Bildirim Atılacaklar
  //             </Typography>
  //             <Box sx={{ width: '%75', display: 'flex', gap: 1, mb: 2 }}>
  //               <TextField
  //                 fullWidth
  //                 label="Email"
  //                 type="email"
  //                 value={emailInput}
  //                 onChange={(e) => setEmailInput(e.target.value)}
  //                 placeholder="example@gmail.com"
  //               />
  //               <Button
  //                 variant="contained"
  //                 onClick={handleAddEmail}
  //                 disabled={!emailInput}
  //               >
  //                 Ekle
  //               </Button>
  //             </Box>
  //             <Box>
  //               <Button
  //                 variant="outlined"
  //                 onClick={handleClick}
  //                 startIcon={<EmailIcon />}
  //                 endIcon={<KeyboardArrowDownIcon />}
  //                 sx={{ width: '40%', justifyContent: 'space-between' }}
  //               >
  //                 {`${emailList.length} Mails`}
  //               </Button>
  //               <Menu
  //                 anchorEl={anchorEl}
  //                 open={Boolean(anchorEl)}
  //                 onClose={handleClose}
  //                 PaperProps={{
  //                   style: {
  //                     maxHeight: 300,
  //                     width: '20%',
  //                   },
  //                 }}
  //               >
  //                 {emailList.map((email, index) => (
  //                   <MenuItem
  //                     key={index}
  //                     sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
  //                   >
  //                     <EmailIcon sx={{ color: '#607d8b' }} />
  //                     <Typography sx={{ flex: 1 }}>{email}</Typography>
  //                     <IconButton
  //                       size="small"
  //                       onClick={(e) => {
  //                         e.stopPropagation()
  //                         handleRemoveEmail(email)
  //                       }}
  //                       color="error"
  //                     >
  //                       <CloseIcon />
  //                     </IconButton>
  //                   </MenuItem>
  //                 ))}
  //                 {emailList.length === 0 && (
  //                   <MenuItem disabled>
  //                     <Typography color="text.secondary">
  //                       Henüz email eklenmedi
  //                     </Typography>
  //                   </MenuItem>
  //                 )}
  //               </Menu>
  //             </Box>
  //           </Box>
  //           {/* Action Buttons */}
  //           <Box
  //             sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
  //           >
  //             <Button
  //               variant="outlined"
  //               color="inherit"
  //               onClick={() => turnMonitorPage()}
  //             >
  //               İptal
  //             </Button>
  //             <Box>
  //               <Button
  //                 variant="contained"
  //                 color="primary"
  //                 onClick={() => {
  //                   update.update ? updateMonitor() : createMonitor()
  //                 }}
  //               >
  //                 {update.update ? 'İzleme Güncelle' : 'İzleme Oluştur'}
  //               </Button>
  //             </Box>
  //           </Box>
  //         </Paper>
  //       </Container>
  //     </Box>
  //   </Box>
  // )
}

export default keyWordMonitorPage
