import React, { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Divider,
  FormHelperText,
  Slider,
  Alert,
  useTheme,
} from '@mui/material'
import {
  Timer as TimerIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  DeveloperBoard as DeveloperBoardIcon,
} from '@mui/icons-material'
import { Add, Remove } from '@mui/icons-material'
import Stack from '@mui/material/Stack'
import { IconButton } from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { INTERVAL_UNITS } from './constants/monitorConstants'
import { jwtDecode } from 'jwt-decode'
import { cookies } from '../../utils/cookie'
import { number } from 'yup'
import { newPortMonitorFormShhema } from '../../utils/formSchema/formSchemas'
const PortMonitorFormPage = (update = false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('port')
  const theme = useTheme()
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const [vaidateOnChangeState, setValidateOnChangeState] = useState(false)
  const [vaidateOnBlurState, setValidateOnBlurState] = useState(true)
  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const jwtToken = cookies.get('jwt-access')
        console.log('JWT Token:', jwtToken)
        if (jwtToken) {
          const decodedToken = jwtDecode(jwtToken)
          setRole(decodedToken.role)
        }
        const response = await api.get(`monitors/port/${params.id}`)
        setFieldValue('name', response.data.monitor.name)
        setFieldValue('host', response.data.host)
        setFieldValue('port', response.data.port)
        setFieldValue('timeOut', response.data.timeOut)
        setFieldValue('interval', response.data.monitor.interval)
        setFieldValue('intervalUnit', response.data.monitor.intervalUnit)
        setFieldValue('timeOut', response.data.timeOut)
        setFieldValue('failCountRef', response.data.monitor.failCountRef)
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
        setFieldValue("interval",
          values.interval >= 20 && values.interval < 60 ? values.interval : 20
        )
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        setFieldValue("interval",
          values.interval > 0 && values.interval < 60 ? values.interval : 0
        )
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        setFieldValue("interval",
          values.interval > 0 && values.interval < 24 ? values.interval : 1
        )
        setMin(1)
        setMax(23)
        return { min: 1, max: 23 }
      default:
        return
    }
  }
  const handleIncrementForFailCount = () => {
    setFieldValue('failCountRef', values.failCountRef + 1)
  }

  const handleDecrementForFailCount = () => {
    setFieldValue('failCountRef', values.failCountRef - 1)
  }
  const createMonitor = async (e) => {
    try {
      const formattedData = {
        name: values.name,
        portMonitor: {
          host: values.host,
          port: Number(values.port),
          timeOut: values.timeOut,
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
        failCountRef: values.failCountRef,
      }
      console.log(formattedData)
      const response = await api.post(
        role === 'admin' ? `monitors/port/${params.userId}` : `monitors/port/`,
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
        portMonitor: {
          host: values.host,
          port: Number(values.port),
          timeOut: values.timeOut,
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
        failCountRef: values.failCountRef,
      }
      console.log(formattedData)
      const response = await api.put(
        `monitors/port/${params.id}`,
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

  const turnMonitorPage = () => {
    role === 'user'
      ? navigate('/user/monitors/')
      : navigate(`/admin/userMonitors/${params.userId}/`)
  }

  const { values, errors, isValid, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      isInitialValid: false,
      initialValues: {
        name: '',
        host: '',
        port: '',
        timeOut: 30,
        interval: 5,
        intervalUnit: 'minutes',
        failCountRef: 3,
      },
      validationSchema: newPortMonitorFormShhema,
      onSubmit: update.update ? updateMonitor : createMonitor,
      validateOnChange: vaidateOnChangeState,
      validateOnBlur: vaidateOnBlurState,
    })

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setValidateOnChangeState(true)
      setValidateOnBlurState(false)
    }
  }, [errors])

  useEffect(() => {
    console.log('Interval Unit:', values.intervalUnit)
    console.log('Interval Value:', values.interval)
    getIntervalLimits(values.intervalUnit)
  }, [values.intervalUnit])

  return (
    <Grid container>
      <Grid
        item
        xs={11.5}
        md={12}
        sx={{ backgroundColor: '#f8f9fa', width: '100%' }}
      >
        <Box
          sx={{
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
              {update.update ? 'Port Monitor Güncelle' : 'Port Monitor Ekle'}
            </Typography>
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
                      : navigate(`/admin/userMonitors/${params.userId}/new/http`)
                    : monitorType === 'ping'
                    ? role === 'user'
                      ? navigate('/user/monitors/new/ping')
                      : navigate(`/admin/userMonitors/${params.userId}/new/ping`)
                    : monitorType === 'port'
                    ? `Port Monitörü, belirli bir IP adresinde ya da alan
                          adında tanımladığınız ağ portunun (örneğin 21, 22, 80, 443 gibi)
                          açık ve ulaşılabilir olup olmadığını düzenli olarak kontrol eder.
                          Belirtilen porta bağlantı sağlanamazsa, bu genellikle hizmetin kapalı,
                          sunucunun yanıt vermediği ya da ağ bağlantısında bir sorun olduğu anlamına
                          gelir. Port Monitörü sayesinde, örneğin bir FTP, SSH, HTTP veya özel bir
                          uygulama servisinin çalışıp çalışmadığını anlık olarak takip edebilirsiniz.`
                    : monitorType === 'keyword'
                    ? role === 'user'
                      ? navigate('/user/monitors/new/keyword')
                      : navigate(`/admin/userMonitors/${params.userId}/new/keyword`)
                    : monitorType === 'cronjob'
                    ? role === 'user'
                      ? navigate('/user/monitors/new/cronjob')
                      : navigate(`/admin/userMonitors/${params.userId}/new/cronjob`)
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
                      <MenuItem
                        disabled={update.update ? true : false}
                        value="http"
                        sx={{ bgcolor: 'white' }}
                      >
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
                  <Typography gutterBottom>Host</Typography>
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
                    label={'https://ornek.com veya ip veya ornek.com'}
                    value={values.host}
                    onChange={handleChange}
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
                      onChange={(e) => setFieldValue('timeOut', e.target.value)}
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
                gap={0}
              >
                <Grid item md={12} alignContent={'end'}>
                  <Typography gutterBottom>Port</Typography>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    id="port"
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
                    label={'Port numarası 80,3000'}
                    value={values.port}
                    onChange={handleChange}
                    helperText={
                      <Typography
                        variant="body2"
                        sx={{ color: 'red', minHeight: '1.5em' }}
                      >
                        {errors.port || ' '}
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            {/*Beşinci satır*/}
            <Grid item md={12} display={'flex'} padding={2} gap={10}>
              <Box sx={{ width: '70%', gap: 2 }}>
                <Typography gutterBottom>Kontrol Zaman Aralığı</Typography>
                <Box display={'flex'} gap={2}>
                  <Grid item md={12}>
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
                  <Grid item md={2}>
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
                </Box>
              </Box>

              <Box sx={{ width: '30%' }}>
                  <Typography sx={{ mb: 0.5 }}>
                    Kaç Hata Sonrası Bildirim Gönderilsin
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      aria-label="decrease"
                      onClick={handleDecrementForFailCount}
                      disabled={values.failCountRef <= 1}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: '8px 0 0 8px',
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        },
                      }}
                    >
                      <Remove />
                    </IconButton>

                    <TextField
                      id="failCountRef"
                      name="failCountRef"
                      value={values.failCountRef}
                      fullWidth
                      onChange={handleChange}
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
                      variant="outlined"
                      size="small"
                      inputProps={{
                        style: {
                          textAlign: 'center',
                          padding: '8px',
                        },
                        type: 'number',
                      }}
                    />

                    <IconButton
                      aria-label="increase"
                      onClick={handleIncrementForFailCount}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: '0 8px 8px 0',
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        },
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Stack>

                  {
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', minHeight: '1.5em' }}
                    >
                      {errors.failCountRef || ' '}
                    </Typography>
                  }
                </Box>
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
                    if (isValid) {
                      if (update.update) {
                        handleSubmit()
                      } else {
                        handleSubmit()
                      }
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: 'Lütfen Formu Tekrar Gözden Geçirin',
                        confirmButtonText: 'Tamam',
                      })
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
      </Grid>
    </Grid>
  )
}

export default PortMonitorFormPage
