import { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  useTheme,
  MenuItem,
  FormControl,
  Select,
  Divider,
  IconButton,
  FormHelperText,
  Slider,
  Alert,
} from '@mui/material'
import {
  Timer as TimerIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  DeveloperBoard as DeveloperBoardIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import ComputerIcon from '@mui/icons-material/Computer'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { INTERVAL_UNITS } from './constants/monitorConstants'
import { cookies } from '../../utils/cookie'
import { jwtDecode } from 'jwt-decode'
import { useFormik } from 'formik'
import { newHttpMonitorFormShhema } from '../../utils/formSchema/formSchemas'

const NewMonitorPage = (update = false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('http')
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [emailInput, setEmailInput] = useState('')
  const [emailList, setEmailList] = useState('')
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const [userInfo, setUserInfo] = useState(location.state?.userInfo || {})
  const [vaidateOnChangeState, setValidateOnChangeState] = useState(false)
  const [vaidateOnBlurState, setValidateOnBlurState] = useState(true)

  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const jwtToken = cookies.get('jwt-access')
        if (jwtToken) {
          const decodedToken = jwtDecode(jwtToken)
          setRole(decodedToken.role)
        }
        const response = await api.get(`monitors/http/${params.id}`)
        console.log('body:', JSON.stringify(response.data.body))
        values.name = response.data.monitor.name
        values.host = response.data.host
        values.method = response.data.method
        values.headers = JSON.stringify(response.data.headers)
        values.body = JSON.stringify(response.data.body)
        values.allowedStatusCodes = response.data.allowedStatusCodes
          ? response.data.allowedStatusCodes.join(',')
          : ''
        values.interval = response.data.monitor.interval
        values.intervalUnit = response.data.monitor.intervalUnit
        values.timeOut = response.data.timeOut
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
        values.interval =
          values.interval >= 20 && values.interval < 60 ? values.interval : 20
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        values.interval =
          values.interval > 0 && values.interval < 60 ? values.interval : 1
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        values.interval =
          values.interval > 0 && values.interval < 24 ? values.interval : 1
        setMin(1)
        setMax(23)
        return { min: 1, max: 23 }
      default:
        return
    }
  }

  const createMonitor = async (values, actions) => {
    try {
      console.log(values.allowedStatusCodes.length)
      console.log(values.allowedStatusCodes)
      const formattedData = {
        name: values.name,
        httpMonitor: {
          host: values.host,
          method: values.method,
          body: values.body.length > 0 ? JSON.parse(values.body) : {},
          headers: values.headers.length > 0 ? JSON.parse(values.headers) : {},
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
        role === 'admin' ? `monitors/http/${userInfo.id}` : `monitors/http/`,
        formattedData
      )
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
        httpMonitor: {
          host: values.host,
          method: values.method,
          body: values.body.length > 0 ? JSON.parse(values.body) : {},
          headers: values.headers.length > 0 ? JSON.parse(values.headers) : {},
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
        `monitors/http/${params.id}`,
        formattedData
      )
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
    console.log('Role:', userInfo)
    role === 'user'
      ? navigate('/user/monitors/')
      : navigate('/admin/userMonitors/', { state: { userInfo } })
  }

  const { values, errors, isValid, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      isInitialValid: false,
      initialValues: {
        name: '',
        host: '',
        method: 'GET',
        body: '',
        headers: '',
        allowedStatusCodes: '',
        timeOut: 30,
        interval: 5,
        intervalUnit: 'minutes',
      },
      validationSchema: newHttpMonitorFormShhema,
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
                ? 'Http(s) Monitor Güncelle'
                : 'Http(s) Monitor Ekle'}
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
              <Grid item md={12}>
                <Alert severity="info">
                  {monitorType === 'http'
                    ? 'HTTPS Monitörü, belirlediğiniz bir web adresine (örneğin https://www.ornek.com) belirli aralıklarla istekte bulunarak sitenin erişilebilirliğini ve düzgün yanıt verip vermediğini kontrol eder. Sunucudan gelen HTTP durum kodunu (200, 404, 500 gibi) ve sayfanın yanıt süresini izler. Site yanıt veremediğinde, belirttiğiniz  kodlarla eğer eşleşmediğinde  sizi bilgilendirir. Bu monitör, web sitelerinin genel durumu ve performansı hakkında düzenli izleme sağlar.'
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
                      <MenuItem value="http" sx={{ bgcolor: 'white' }}>
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
                  <Typography gutterBottom>Method</Typography>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    id="method"
                    name="method"
                    fullWidth
                    label="HTTP Metot"
                    select
                    value={values.method}
                    onChange={(e) => setFieldValue('method', e.target.value)}
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
                <Grid item md={12} alignContent={'end'}>
                  <Typography gutterBottom>Başlık</Typography>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    id="headers"
                    fullWidth
                    label="Özel HTTP Başlıkları (JSON)"
                    multiline
                    rows={7}
                    helperText={
                      <Typography
                        variant="body2"
                        sx={{ color: 'red', minHeight: '1.5em' }}
                      >
                        {errors.headers}
                      </Typography>
                    }
                    sx={{
                      mb: 2,
                    }}
                    name="headers"
                    value={values.headers}
                    onChange={handleChange}
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
                    name="body"
                    fullWidth
                    label="Özel HTTP Gövdesi (JSON)"
                    multiline
                    rows={7}
                    helperText={
                      <Typography
                        variant="body2"
                        sx={{ color: 'red', minHeight: '1.5em' }}
                      >
                        {errors.body}
                      </Typography>
                    }
                    sx={{ mb: 2 }}
                    value={values.body}
                    onChange={(e) => setFieldValue('body', e.target.value)}
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
            </Grid>
            <Divider />
            {/*Beşinci satır*/}
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
              >
                <Grid item md={12} alignContent={'end'}>
                  <Typography gutterBottom>
                    İzin Verilen Durum Kodlar
                  </Typography>
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
                    label="İzin Verilen Status Kodları"
                    name="allowedStatusCodes"
                    value={values.allowedStatusCodes}
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

{
  /*activeTab === 2 && (
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
                  )*/
}
export default NewMonitorPage
