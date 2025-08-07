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
  Stack,
  InputLabel,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Timer as TimerIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  DeveloperBoard as DeveloperBoardIcon,
  Menu as MenuIcon,
  Add,
  Remove,
} from '@mui/icons-material'
import ComputerIcon from '@mui/icons-material/Computer'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { INTERVAL_UNITS } from './constants/monitorConstants'
import { cookies } from '../../utils/cookie'
import { jwtDecode } from 'jwt-decode'
import { useFormik } from 'formik'
import {
  newHttpMonitorFormShhema,
  newPingMonitorFormShhema,
  newPortMonitorFormShhema,
  newKeywordMonitorFormShhema,
  newCronJobMonitorFormShhema,
} from '../../utils/formSchema/formSchemas'

const monitorAlertMessages = [
  {
    monitorType: 'http',
    message:
      'HTTPS Monitörü, belirlediğiniz bir web adresine (örneğin https://www.ornek.com) belirli aralıklarla istekte bulunarak sitenin erişilebilirliğini ve düzgün yanıt verip vermediğini kontrol eder. Sunucudan gelen HTTP durum kodunu (200, 404, 500 gibi) ve sayfanın yanıt süresini izler. Site yanıt veremediğinde, belirttiğiniz  kodlarla eğer eşleşmediğinde  sizi bilgilendirir. Bu monitör, web sitelerinin genel durumu ve performansı hakkında düzenli izleme sağlar.',
  },
  {
    monitorType: 'ping',
    message: `Ping Monitörü, bir sunucunun çevrimiçi (erişilebilir)
                           olup olmadığını kontrol etmek için ICMP protokolünü kullanarak
                           düzenli aralıklarla sinyal gönderir. Gönderilen bu 'ping' sinyallerine
                           sunucu cevap verirse, sunucunun aktif olduğu anlaşılır. Eğer yanıt
                           alınamazsa veya yanıt süresi çok uzarsa, bu durum bağlantı problemi
                           veya kesinti olarak değerlendirilir. Ping monitörü, özellikle ağ
                           bağlantısı takibi ve temel erişilebilirlik kontrolü için hızlı ve
                           etkili bir çözümdür.`,
  },
  {
    monitorType: 'port',
    message: `Port Monitörü, belirli bir IP adresinde ya da alan
                          adında tanımladığınız ağ portunun (örneğin 21, 22, 80, 443 gibi)
                          açık ve ulaşılabilir olup olmadığını düzenli olarak kontrol eder.
                          Belirtilen porta bağlantı sağlanamazsa, bu genellikle hizmetin kapalı,
                          sunucunun yanıt vermediği ya da ağ bağlantısında bir sorun olduğu anlamına
                          gelir. Port Monitörü sayesinde, örneğin bir FTP, SSH, HTTP veya özel bir
                          uygulama servisinin çalışıp çalışmadığını anlık olarak takip edebilirsiniz.`,
  },
  {
    monitorType: 'keyword',
    message: `Anahtar Kelime Monitörü, belirli bir web sayfasının
                           içeriğinde sizin belirlediğiniz kelimelerin var olup
                           olmadığını düzenli aralıklarla kontrol eder. Belirttiğiniz
                           kelime bulunmazsa ya da istenmeyen bir kelime tespit edilirse
                           sizi uyarır. Bu sayede, bir hata mesajı, bakım bildirimi ya da
                           içerik değişikliği gibi durumları hızlıca fark edebilirsiniz.`,
  },
  {
    monitorType: 'cronjob',
    message: `Cron Job Monitörü, zamanlanmış görevlerin (cron job'ların) düzgün şekilde çalışıp çalışmadığını takip eder. Genellikle sunucu tarafında arka planda belirli aralıklarla çalışan bu görevler,monitöre entegre edilen özel bir URL’ye her çalıştıklarında istek
gönderir. Eğer belirlenen süre içinde bu istek gelmezse, yani görev çalışmazsa veya hata alırsa sizi bilgilendirir. Bu sayede otomatik yedekleme,
  e-posta gönderimi veya veri işleme gibi kritik zamanlanmış görevlerin sorunsuz çalıştığından emin olabilirsiniz.`,
  },
]

const monitorTypes = [
  {
    id: 'http',
    icon: <PublicIcon sx={{ color: 'white' }} />,
    bgcolor: '#3f51b5',
    title: 'HTTP(S)',
    info: "Web sitelerini ve web API'lerini izleyin",
  },
  {
    id: 'ping',
    icon: <ComputerIcon sx={{ color: 'white' }} />,
    bgcolor: '#4caf50',
    title: 'PING',
    info: 'Ağ bağlantısından ICMP protokolünden izleyin',
  },
  {
    id: 'port',
    icon: <DeveloperBoardIcon sx={{ color: 'white' }} />,
    bgcolor: '#ff9800',
    title: 'PORT',
    info: 'Belirli bağlantı portları izleyin',
  },
  {
    id: 'keyword',
    icon: <CodeIcon sx={{ color: 'white' }} />,
    bgcolor: '#e91e63',
    title: 'KEYWORD',
    info: 'Web servislerdeki belirli anahtar kelimeleri izleyin',
  },
  {
    id: 'cronjob',
    icon: <TimerIcon sx={{ color: 'white' }} />,
    bgcolor: '#3f51b5',
    title: 'CRON JOB',
    info: 'Tekrarlanan işleri izleyin',
  },
]

const NewMonitorPage = (update = false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('http')
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const theme = useTheme()
  const [vaidateOnChangeState, setValidateOnChangeState] = useState(false)
  const [vaidateOnBlurState, setValidateOnBlurState] = useState(true)

  const getFormikConfig = () => {
    const baseConfig = {
      isInitialValid: false,
      validateOnChange: vaidateOnChangeState,
      validateOnBlur: vaidateOnBlurState,
      onSubmit: update.update ? updateMonitor : createMonitor,
    }

    switch (monitorType) {
      case 'http':
        return {
          ...baseConfig,
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
            failCountRef: 3,
          },
          validationSchema: newHttpMonitorFormShhema,
        }
      case 'keyword':
        return {
          ...baseConfig,
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
            failCountRef: 3,
          },
          validationSchema: newKeywordMonitorFormShhema,
        }
      case 'ping':
        return {
          ...baseConfig,
          initialValues: {
            name: '',
            host: '',
            interval: 5,
            intervalUnit: 'minutes',
            failCountRef: 3,
          },
          validationSchema: newPingMonitorFormShhema,
        }
      case 'port':
        return {
          ...baseConfig,
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
        }
      case 'cronjob':
        return {
          ...baseConfig,
          initialValues: {
            name: '',
            divitionTime: '',
            interval: 5,
            intervalUnit: 'minutes',
            failCountRef: 3,
          },
          validationSchema: newCronJobMonitorFormShhema,
        }
      // diğer case'ler...
      default:
        return {
          ...baseConfig,
          initialValues: {},
          validationSchema: null,
        }
    }
  }

  const handleIncrementForFailCount = () => {
    setFieldValue('failCountRef', values.failCountRef + 1)
  }

  const handleDecrementForFailCount = () => {
    setFieldValue('failCountRef', values.failCountRef - 1)
  }

  const alertContent = monitorAlertMessages.find(
    (item) => item.monitorType === monitorType
  )?.message

  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const jwtToken = cookies.get('jwt-access')
        if (jwtToken) {
          const decodedToken = jwtDecode(jwtToken)
          setRole(decodedToken.role)
        }
        const response = await api.get(`monitors/update/${params.id}`)
        console.log(response.data)
        switch (response.data.monitorType) {
          case 'HttpMonitor': {
            setMonitorType('http')
            setFieldValue('name', response.data.name)
            setFieldValue('host', response.data.httpMonitor.host)
            setFieldValue('method', response.data.httpMonitor.method)
            setFieldValue(
              'headers',
              JSON.stringify(response.data.httpMonitor.headers)
            )
            setFieldValue(
              'body',
              JSON.stringify(response.data.httpMonitor.body)
            )
            setFieldValue(
              'allowedStatusCodes',
              response.data.httpMonitor.allowedStatusCodes
                ? response.data.httpMonitor.allowedStatusCodes.join(',')
                : ''
            )
            setFieldValue('interval', response.data.interval)
            setFieldValue('intervalUnit', response.data.intervalUnit)
            setFieldValue('timeOut', response.data.httpMonitor.timeOut)
            setFieldValue('failCountRef', response.data.failCountRef)
            break
          }
          case 'PingMonitor': {
            setMonitorType('ping')
            setFieldValue('name', response.data.name)
            setFieldValue('host', response.data.pingMonitor.host)
            setFieldValue('interval', response.data.interval)
            setFieldValue('intervalUnit', response.data.intervalUnit)
            setFieldValue('failCountRef', response.data.failCountRef)
            break
          }
          case 'PortMonitor': {
            setMonitorType('port')
            setFieldValue('name', response.data.name)
            setFieldValue('host', response.data.portMonitor.host)
            setFieldValue('port', response.data.portMonitor.port)
            setFieldValue('timeOut', response.data.portMonitor.timeOut)
            setFieldValue('interval', response.data.interval)
            setFieldValue('intervalUnit', response.data.intervalUnit)
            setFieldValue('failCountRef', response.data.failCountRef)
            break
          }
          case 'KeywordMonitor': {
            setMonitorType('keyword')
            setFieldValue('name', response.data.name)
            setFieldValue('host', response.data.keyWordMonitor.host)
            setFieldValue('method', response.data.keyWordMonitor.method)
            setFieldValue(
              'headers',
              response.data.keyWordMonitor.headers.length > 0
                ? JSON.stringify(response.data.keyWordMonitor.headers)
                : ''
            )
            setFieldValue(
              'body',
              response.data.keyWordMonitor.body.length > 0
                ? JSON.stringify(response.data.keyWordMonitor.body)
                : ''
            )
            setFieldValue(
              'keyWordType',
              response.data.keyWordMonitor.keyWordType || 'txt'
            )
            setFieldValue('keyWord', response.data.keyWordMonitor.keyWord)
            setFieldValue(
              'allowedStatusCodes',
              response.data.keyWordMonitor.allowedStatusCodes
                ? response.data.keyWordMonitor.allowedStatusCodes.join(',')
                : ''
            )
            setFieldValue('interval', response.data.interval)
            setFieldValue('intervalUnit', response.data.intervalUnit)
            setFieldValue('timeOut', response.data.keyWordMonitor.timeOut)
            setFieldValue('failCountRef', response.data.failCountRef)
            break
          }
          case 'CronJobMonitor': {
            setMonitorType('cronjob')
            setFieldValue('name', response.data.name)
            setFieldValue(
              'divitionTime',
              response.data.cronJobMonitor.devitionTime
            )
            setFieldValue('interval', response.data.interval)
            setFieldValue('intervalUnit', response.data.intervalUnit)
            setFieldValue('failCountRef', response.data.failCountRef)
            break
          }
          default: {
            break
          }
        }
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
          values.interval <= 20 ? 20 
          : values.interval > 20 && values.interval <= 40 ? 40
          : 60
        setMin(20)
        setMax(60)
        return { min: 20, max: 60 }
      case 'minutes':
        values.interval =
          values.interval > 0 && values.interval < 60 ? values.interval : 1
        setMin(1)
        setMax(60)
        return { min: 1, max: 60 }
      case 'hours':
        values.interval =
          values.interval > 0 && values.interval < 24 ? values.interval : 1
        setMin(1)
        setMax(24)
        return { min: 1, max: 60 }
      default:
        return
    }
  }

  const createMonitor = async (values, actions) => {
    try {
      let url = ''
      let formattedData = {}
      switch (monitorType) {
        case 'http': {
          formattedData = {
            name: values.name,
            httpMonitor: {
              host: values.host,
              method: values.method,
              body: values.body.length > 0 ? JSON.parse(values.body) : {},
              headers:
                values.headers.length > 0 ? JSON.parse(values.headers) : {},
              allowedStatusCodes:
                values.allowedStatusCodes.length > 0
                  ? values.allowedStatusCodes
                      .split(',')
                      .map((code) => code.trim())
                  : [],
              timeOut: values.timeOut,
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url =
            role === 'admin'
              ? `monitors/http/${params.userId}`
              : `monitors/http/`
          break
        }
        case 'ping': {
          formattedData = {
            name: values.name,
            pingMonitor: {
              host: values.host,
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url =
            role === 'admin'
              ? `monitors/ping/${params.userId}`
              : `monitors/ping/`
          break
        }
        case 'port': {
          formattedData = {
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
          url =
            role === 'admin'
              ? `monitors/port/${params.userId}`
              : `monitors/port/`
          break
        }
        case 'keyword': {
          formattedData = {
            name: values.name,
            keyWordMonitor: {
              host: values.host,
              method: values.method,
              body: values.body.length > 0 ? JSON.parse(values.body) : {},
              headers:
                values.headers.length > 0 ? JSON.parse(values.headers) : {},
              keyWordType: values.keyWordType,
              keyWord: values.keyWord,
              allowedStatusCodes:
                values.allowedStatusCodes.length > 0
                  ? values.allowedStatusCodes
                      .split(',')
                      .map((code) => code.trim())
                  : [],
              timeOut: values.timeOut,
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url =
            role === 'admin'
              ? `monitors/keyword/${params.userId}`
              : `monitors/keyword/`
          break
        }
        case 'cronjob': {
          formattedData = {
            name: values.name,
            cronJobMonitor: {
              devitionTime: Number(values.divitionTime),
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url =
            role === 'admin'
              ? `monitors/cronjob/${params.userId}`
              : `monitors/cronjob/`
          break
        }
        default: {
          break
        }
      }

      console.log(formattedData)
      const response = await api.post(url, formattedData)
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
      let url = ''
      let formattedData = {}
      switch (monitorType) {
        case 'http': {
          formattedData = {
            name: values.name,
            httpMonitor: {
              host: values.host,
              method: values.method,
              body: values.body.length > 0 ? JSON.parse(values.body) : {},
              headers:
                values.headers.length > 0 ? JSON.parse(values.headers) : {},
              allowedStatusCodes:
                values.allowedStatusCodes.length > 0
                  ? values.allowedStatusCodes
                      .split(',')
                      .map((code) => code.trim())
                  : [],
              timeOut: values.timeOut,
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url = `monitors/http/${params.id}`
          break
        }
        case 'ping': {
          formattedData = {
            name: values.name,
            pingMonitor: {
              host: values.host,
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url = `monitors/ping/${params.id}`
          break
        }
        case 'port': {
          formattedData = {
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
          url = `monitors/port/${params.id}`
          break
        }
        case 'keyword': {
          formattedData = {
            name: values.name,
            keyWordMonitor: {
              host: values.host,
              method: values.method,
              body: values.body.length > 0 ? JSON.parse(values.body) : {},
              headers:
                values.headers.length > 0 ? JSON.parse(values.headers) : {},
              keyWordType: values.keyWordType,
              keyWord: values.keyWord,
              allowedStatusCodes:
                values.allowedStatusCodes.length > 0
                  ? values.allowedStatusCodes
                      .split(',')
                      .map((code) => code.trim())
                  : [],
              timeOut: values.timeOut,
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url = `monitors/keyword/${params.id}`
          break
        }
        case 'cronjob': {
          formattedData = {
            name: values.name,
            cronJobMonitor: {
              devitionTime: Number(values.divitionTime),
            },
            interval: values.interval,
            intervalUnit: values.intervalUnit,
            failCountRef: values.failCountRef,
          }
          url = `monitors/cronjob/${params.id}`
          break
        }
        default: {
          break
        }
      }

      console.log(formattedData)
      const response = await api.put(url, formattedData)
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
      : navigate(`/admin/userMonitors/${params.userId}`)
  }

  const { values, errors, isValid, handleChange, handleSubmit, setFieldValue } =
    useFormik(getFormikConfig())

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
    <Grid container className="grid-area" width={'100%'}>
      <Grid
        item
        xs={12}
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
          {update.update ? `Monitor Güncelle` : `Monitor Ekle`}
        </Typography>
      </Grid>
      <Divider sx={{ mb: 2, width: '100%' }} />
      <Grid item xs={12}>
        {alertContent && (
          <Alert severity="info" sx={{ width: 'fit-content' }}>
            {alertContent}
          </Alert>
        )}
      </Grid>
      {/* Monitor Type Selection */}
      {/*Birinci satır*/}
      <Grid item xs={12} gap={1} mt={2}>
        <Typography gutterBottom>Monitoring Tipi</Typography>

        <FormControl sx={{ display: 'flex' }}>
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
            {monitorTypes.map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
                disabled={update.update && item.id !== monitorType}
              >
                {' '}
                {/* value burada önemli! */}
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
                      bgcolor: item.bgcolor,
                      p: 0.6,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 48,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="500">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        width: { xs: '100%', sm: 'auto' },
                        mt: { xs: 0.5, sm: 0 },
                      }}
                    >
                      {item.info}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}

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
      {/*İkincii satır*/}

      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2,
        }}
      >
        <Grid item xs={12} md={5.9} display={'flex'} flexDirection={'column'}>
          <Grid item alignContent={'end'}>
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

        {monitorType === 'cronjob' && (
          <Grid item xs={12} md={5.9} display={'flex'} flexDirection={'column'}>
            <Grid alignContent={'end'}>
              <Typography gutterBottom>Sapma Zamanı</Typography>
            </Grid>
            <Grid>
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
        )}

        {monitorType !== 'cronjob' && (
          <Grid item xs={12} md={5.9} display={'flex'} flexDirection={'column'}>
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
        )}
      </Grid>

      <Divider />
      {/*Üçüncü satır*/}
      <Grid
        container
        sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
      >
        <Grid
          item
          xs={12}
          md={5.9}
          display={'flex'}
          flexDirection={'column'}
          gap={1}
        >
          <Grid alignContent={'end'}>
            <Typography gutterBottom>Kontrol Zaman Aralığı</Typography>
          </Grid>
          <Grid gap={3} display={'flex'}>
            <Grid width={'100%'}>
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
                  min={values.intervalUnit === 'seconds' ? 20 : min}
                  max={values.intervalUnit === 'seconds' ? 60 : max}
                  step={values.intervalUnit === 'seconds' ? 20 : 1}
                  valueLabelDisplay="auto" // Değeri üzerinde gösterir
                  marks={
                    values.intervalUnit === 'seconds'
                      ? [
                          { value: 20, label: '20' },
                          { value: 40, label: '40' },
                          { value: 60, label: '60' },
                        ]
                      : [
                          { value: min, label: `${min}` },
                          { value: max, label: `${max}` },
                        ]
                  }
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
          xs={12}
          md={5.9}
          display={'flex'}
          flexDirection={'column'}
          gap={1}
        >
          {(monitorType === 'http' || monitorType === 'keyword') && (
            <>
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
            </>
          )}
          {(monitorType === 'ping' ||
            monitorType === 'port' ||
            monitorType === 'cronjob') && (
            <>
              <Grid
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography gutterBottom sx={{ mb: 1.5 }}>
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
                        '& input::-webkit-outer-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
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
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      {/* <Divider /> */}
      {/*Dördüncü satır*/}
      {(monitorType === 'http' || monitorType === 'keyword') && (
        <Grid item xs={12}>
          <Accordion
            sx={{
              width: '100%',
              bgcolor: 'white',
              boxShadow: 'none',
              borderBlockStart: '0.5px solid rgba(0, 0, 0, 0.3)', // Çok ince ve soluk siyah
              borderBlockEnd: '0.5px solid rgba(0, 0, 0, 0.3)',
              mt: 1,
              mb: 4,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
              sx={{
                paddingLeft: 0,
                '& .MuiAccordionSummary-expandIconWrapper': {
                  marginLeft: 0,
                  paddingLeft: 0,
                },
                '& .MuiTypography-root': {
                  marginLeft: 0,
                  paddingLeft: 0,
                },
              }}
            >
              <Typography
                component="span"
                sx={{ fontWeight: 'bold', marginLeft: 0, paddingLeft: 0 }}
              >
                Gönderilecek istek detayı
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Grid
                  item
                  xs={12}
                  md={5.9}
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
                  xs={12}
                  md={5.9}
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
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}
      {monitorType === 'keyword' && (
        <>
          <Grid item xs={12} display={'flex'} gap={4}>
            <Grid alignContent={'end'} width={'50%'}>
              <Typography gutterBottom mb={1}>
                Anahtar Kelime
              </Typography>

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
                value={values.keyWord}
                onChange={(e) => setFieldValue('keyWord', e.target.value)}
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
                  startAdornment: <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />,
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.8rem',
                  },
                }}
              />
            </Grid>

            <Grid width={'50%'} alignContent={'start'}>
              <Typography gutterBottom mb={1}>
                Anahtar Kelime Tipi
              </Typography>

              <TextField
                id="keyWordType"
                name="keyWordType"
                fullWidth
                select
                label="Anahtar Tipi"
                sx={{ pb: 3.1 }}
                value={values.keyWordType}
                onChange={(e) => setFieldValue('keyWordType', e.target.value)}
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
          <Divider />
        </>
      )}
      {/*Beşinci satır*/}
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          gap: 4,
          mt: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {(monitorType === 'http' ||
          monitorType === 'port' ||
          monitorType === 'keyword') && (
          <Box
            sx={{
              width: { xs: '100%', md: monitorType === 'port' ? '50%' : '35%' },
            }}
          >
            <Typography gutterBottom>İstek Zaman Aşımı</Typography>
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
          </Box>
        )}
        {(monitorType === 'http' || monitorType === 'keyword') && (
          <Box sx={{ width: { xs: '100%', md: '30%' } }}>
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
                    '& input::-webkit-outer-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '& input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
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
        )}
        {(monitorType === 'http' || monitorType === 'keyword') && (
          <Box sx={{ width: { xs: '100%', md: '35%' } }}>
            <Typography gutterBottom>İzin Verilen Durum Kodlar</Typography>
            <TextField
              id="allowedStatusCodes"
              placeholder="örnek: 200,400,500"
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
          </Box>
        )}
        {monitorType === 'port' && (
          <Grid
            display={'flex'}
            flexDirection={'column'}
            gap={0}
            sx={{ width: { xs: '100%', md: '50%' } }}
          >
            <Grid alignContent={'end'}>
              <Typography gutterBottom>Port</Typography>
            </Grid>
            <Grid>
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
        )}
      </Grid>
      {monitorType !== 'ping' && <Divider width={'100%'} />}

      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-end' },
          mb: 2,
          mt: 2,
          gap: 4,
        }}
      >
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
  )
}

export default NewMonitorPage
