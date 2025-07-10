/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sideBar/sideBar'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Divider,
  FormHelperText,
  Slider,
  Alert,
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
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon
} from '@mui/icons-material'
import ComputerIcon from '@mui/icons-material/Computer'

import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  INTERVAL_UNITS,
} from './constants/monitorConstants'
import AdminSidebar from '../../components/adminSideBar/adminSideBar'
import { jwtDecode } from 'jwt-decode'
import { cookies } from '../../utils/cookie'
import { newCronJobMonitorFormShhema } from '../../utils/formSchema/formSchemas'
const cronJobMonitorFormPage = (update = false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('cronjob')
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
  const theme= useTheme()
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
        const response = await api.get(`monitors/cronjob/${params.id}`)
        console.log(response.data)
        values.name=response.data.monitor.name;
        values.divitionTime=response.data.devitionTime;
        values.interval=response.data.monitor.interval;
        values.intervalUnit=response.data.monitor.intervalUnit;
        values.intervalUnit=response.data.timeOut;
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
        setInterval(values.interval >= 20 && values.interval < 60 ? values.interval : 20)
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        setInterval(values.interval > 0 && values.interval < 60 ? values.interval : 0)
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        setInterval(values.interval > 0 && values.interval < 24 ? values.interval : 1)
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
        name: values.name,
        cronJobMonitor: {
          devitionTime: Number(values.divitionTime),
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
      }
      console.log(formattedData)
      const response = await api.post(
        role === 'admin'
          ? `monitors/cronjob/${userInfo.id}`
          : `monitors/cronjob/`,
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
        name: values.name,
        cronJobMonitor: {
          devitionTime: values.divitionTime,
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
      }
      console.log(formattedData)
      const response = await api.put(
        `monitors/cronjob/${params.id}`,
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

  const { values, errors, isValid, handleChange, handleSubmit,  } = useFormik({
      isInitialValid: false,
      initialValues: {
        name: '',
        divitionTime: '',
        interval: 5,
        intervalUnit: 'minutes',
      },
      validationSchema: newCronJobMonitorFormShhema,
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
              {update.update ? 'Cron Job Monitor Güncelle' : 'Cron Job Monitor Ekle'}
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
            sx={{
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'white',
              borderRadius: '12px',
            }}
            mb={4}
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
                        ? role === 'user'
                          ? navigate('/user/monitors/new/keyword')
                          : navigate('/admin/monitors/new/keyword', {
                              state: { userInfo },
                            })
                        : monitorType === 'cronjob'
                        ? `Cron Job Monitörü, zamanlanmış görevlerin (cron job'ların)
                           düzgün şekilde çalışıp çalışmadığını takip eder. Genellikle
                           sunucu tarafında arka planda belirli aralıklarla çalışan bu görevler,
                           monitöre entegre edilen özel bir URL’ye her çalıştıklarında istek (ping)
                           gönderir. Eğer belirlenen süre içinde bu istek gelmezse, yani görev
                           çalışmazsa veya hata alırsa sizi bilgilendirir. Bu sayede otomatik yedekleme,
                           e-posta gönderimi veya veri işleme gibi kritik zamanlanmış görevlerin sorunsuz
                           çalıştığından emin olabilirsiniz.`
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
                        disabled={update.update ? true : false}
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
                  <Typography gutterBottom>Sapma Zamanı</Typography>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    id="divitionTime"
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
                    label={'Sapma zamanı dakika cinsinden'}
                    value={values.divitionTime}
                    onChange={handleChange}
                    helperText={
                      <Typography
                        variant="body2"
                        sx={{ color: 'red', minHeight: '1.5em' }}
                      >
                        {errors.divitionTime || ' '}
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
                md={12}
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
            </Grid>
            <Divider />
            {/*Altıncı satır*/}
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
                      width: '8rem',
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
                    width: '12rem',
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
                  {update.update ? 'Monitoring Güncelle' : 'Monitoring Oluştur'}
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
  //                 <MenuItem
  //                   disabled={update.update ? true : false}
  //                   value="keyword"
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
  //                 <MenuItem value="cronjob">
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
  //                       ? role === 'user'
  //                         ? navigate('/user/monitors/new/keyword')
  //                         : navigate('/admin/monitors/new/keyword', {
  //                             state: { userInfo },
  //                           })
  //                       : monitorType === 'cronjob'
  //                       ? `Cron Job Monitörü, zamanlanmış görevlerin (cron job'ların)
  //                          düzgün şekilde çalışıp çalışmadığını takip eder. Genellikle
  //                          sunucu tarafında arka planda belirli aralıklarla çalışan bu görevler,
  //                          monitöre entegre edilen özel bir URL’ye her çalıştıklarında istek (ping)
  //                          gönderir. Eğer belirlenen süre içinde bu istek gelmezse, yani görev
  //                          çalışmazsa veya hata alırsa sizi bilgilendirir. Bu sayede otomatik yedekleme,
  //                          e-posta gönderimi veya veri işleme gibi kritik zamanlanmış görevlerin sorunsuz
  //                          çalıştığından emin olabilirsiniz.`
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

  //             <Divider sx={{ my: 3 }} />
  //             <Grid item xs={4}>
  //               <TextField
  //                 required
  //                 fullWidth
  //                 label="Sapma Zamanı"
  //                 value={devitionTime}
  //                 onChange={(e) => setDevitionTime(Number(e.target.value))}
  //                 type="number"
  //                 placeholder="Sapma zamanı dakika birimden girizin"
  //                 helperText="Sapma zamanı dakika birimden girizin"
  //               />
  //             </Grid>
  //           </Grid>
  //           <Divider sx={{ my: 3 }} />
  //           <Grid container spacing={3}>
  //             <Grid item xs={12} sm={6}>
  //               <Grid item sx={{ pb: 1 }}>
  //                 <InputLabel>Zaman</InputLabel>
  //               </Grid>
  //               <FormControl fullWidth>
  //                 <Slider
  //                   name="interval"
  //                   value={interval}
  //                   onChange={(e) => setInterval(e.target.value)}
  //                   min={min}
  //                   max={max}
  //                   step={1} // Her tıklamada 1 artar/azalır
  //                   valueLabelDisplay="auto" // Değeri üzerinde gösterir
  //                   marks={[
  //                     { value: min, label: `${min}` }, // Min değeri etiketliyor
  //                     { value: max, label: `${max}` }, // Max değeri etiketliyor
  //                   ]}
  //                   sx={{ color: '#1976d2' }} // Mavi renk
  //                 />
  //               </FormControl>
  //             </Grid>

  //             <Grid item xs={12} sm={6}>
  //               <Grid item sx={{ pb: 1 }}>
  //                 <InputLabel>Zaman Birimi</InputLabel>
  //               </Grid>
  //               <FormControl fullWidth>
  //                 <Select
  //                   name="intervalUnit"
  //                   value={intervalUnit || 'minutes'}
  //                   label="Birim"
  //                   onChange={(e) => {
  //                     setIntervalUnit(e.target.value)
  //                   }}
  //                   variant="outlined"
  //                 >
  //                   {INTERVAL_UNITS.map((unit) => (
  //                     <MenuItem key={unit.value} value={unit.value}>
  //                       {unit.label}
  //                     </MenuItem>
  //                   ))}
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //           </Grid>
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
  //                 placeholder="rahatup@gmail.com"
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

export default cronJobMonitorFormPage
