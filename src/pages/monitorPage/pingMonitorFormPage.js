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
  useTheme,
  Alert,
} from '@mui/material'
import {
  Timer as TimerIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  DeveloperBoard as DeveloperBoardIcon,
} from '@mui/icons-material'
import ComputerIcon from '@mui/icons-material/Computer'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { INTERVAL_UNITS } from './constants/monitorConstants'
import { jwtDecode } from 'jwt-decode'
import { cookies } from '../../utils/cookie'
import { newPingMonitorFormShhema } from '../../utils/formSchema/formSchemas'

const PingMonitorFormPage = (update = false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('ping')
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [userInfo, setUserInfo] = useState(location.state?.userInfo || {})
  const theme = useTheme()
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
        const response = await api.get(`monitors/ping/${params.id}`)
        console.log(response.data)
        values.name = response.data.monitor.name
        values.host = response.data.host
        values.interval = response.data.monitor.interval
        values.intervalUnit = response.data.monitor.intervalUnit
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
        setInterval(
          values.interval >= 20 && values.interval < 60 ? values.interval : 20
        )
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        setInterval(
          values.interval > 0 && values.interval < 60 ? values.interval : 1
        )
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        setInterval(
          values.interval > 0 && values.interval < 24 ? values.interval : 1
        )
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
        pingMonitor: {
          host: values.host,
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
      }
      console.log(formattedData)
      const response = api.post(
        role === 'admin' ? `monitors/ping/${userInfo.id}` : `monitors/ping/`,
        formattedData
      )
      console.log('Response:', response)
      if (response) {
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
        pingMonitor: {
          host: values.host,
        },
        interval: values.interval,
        intervalUnit: values.intervalUnit,
      }
      console.log(formattedData)
      const response = await api.put(
        `monitors/ping/${params.id}`,
        formattedData
      )
      console.log('Response:', response.data)
      if (response.data) {
        Swal.fire({
          title: 'İzleme Başarılı Şekilde Güncellendi',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        turnMonitorPage()
      }
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'OK',
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
      : navigate('/admin/userMonitors/', { state: { userInfo } })
  }

  const { values, errors, isValid, handleChange, handleSubmit } = useFormik({
    isInitialValid: false,
    initialValues: {
      name: '',
      host: '',
      interval: 5,
      intervalUnit: 'minutes',
    },
    validationSchema: newPingMonitorFormShhema,
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
              {update.update
                ? 'Ping Monitoring Güncelle'
                : 'Ping Monitoring Ekle'}
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
                      : navigate('/admin/monitors/new/http', {
                          state: { userInfo },
                        })
                    : monitorType === 'ping'
                    ? `Ping Monitörü, bir sunucunun çevrimiçi (erişilebilir)
                           olup olmadığını kontrol etmek için ICMP protokolünü kullanarak
                           düzenli aralıklarla sinyal gönderir. Gönderilen bu 'ping' sinyallerine
                           sunucu cevap verirse, sunucunun aktif olduğu anlaşılır. Eğer yanıt
                           alınamazsa veya yanıt süresi çok uzarsa, bu durum bağlantı problemi
                           veya kesinti olarak değerlendirilir. Ping monitörü, özellikle ağ
                           bağlantısı takibi ve temel erişilebilirlik kontrolü için hızlı ve
                           etkili bir çözümdür.`
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
                  <Typography gutterBottom>IP</Typography>
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
                    placeholder={'8.8.8.8'}
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

export default PingMonitorFormPage
