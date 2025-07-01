import { useState, useEffect } from 'react'
import alertify from 'alertifyjs'
import api from '../../api/auth/axiosInstance'
import BuildIcon from '@mui/icons-material/Build'
import Swal from 'sweetalert2'
import MenuButton from '../../components/menuButton/index.js'
import {
  Typography,
  IconButton,
  Box,
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Divider,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { Edit } from 'tabler-icons-react'
import { INITIAL_STATS } from './constants/monitorConstants'
import Sidebar from '../../components/sideBar/sideBar'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

const initialFormData = {
  name: '',
  method: 'GET',
  body: {},
  headers: {},
  interval: 5,
  intervalUnit: 'minutes',
  reportTime: 1,
  reportTimeUnit: 'days',
  status: false,
  allowedStatusCodes: ['200'],
  isActiveByOwner: true,
}

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true)
  const [monitors, setMonitors] = useState([])
  const [filteredMonitors, setFilteredMonitors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonitor, setSelectedMonitor] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [currentStats, setCurrentStats] = useState(INITIAL_STATS)
  const theme = useTheme()
  const navigate = useNavigate()
  const validationShcema = Yup.object().shape({
    name: Yup.string().required('İsim alanı takip etmeniz için zorunludur !'),
    method: Yup.string()
      .oneOf(
        ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTION'],
        'Geçersiz başlık !'
      )
      .required('İstek atabilmek için önemlidir !'),
    host: Yup.string()
      .matches(/^(https?:\/\/)/gm, 'Geçersiz host adresi')
      .required('Host alanı zorunludur'),
    body: Yup.string().test(
      'is-json',
      'Body geçerli bir JSON formatında değil!',
      (value) => {
        try {
          JSON.parse(JSON.stringify(value))
          return true
        } catch (error) {
          return false
        }
      }
    ),
    headers: Yup.string().test(
      'is-json',
      'Head geçerli bir JSON formatı değil!',
      (value) => {
        try {
          JSON.parse(JSON.stringify(value))
          return true
        } catch (error) {
          return false
        }
      }
    ),
    interval: Yup.number()
      .required('İstek zaman birimi zorunludur!')
      .when('intervalUnit', (intervalUnit, schema) => {
        if (intervalUnit === 'seconds') {
          return schema
            .min(20, 'En az 20 saniye olmalı')
            .max(59, 'En fazla 59 saniye olabilir')
        }
        if (intervalUnit === 'minutes') {
          return schema
            .min(1, 'En az 1 dakika olmalı')
            .max(59, 'En fazla 59 dakika olabilir')
        }
        if (intervalUnit === 'hours') {
          return schema
            .min(1, 'En az 1 saat olmalı')
            .max(23, 'En fazla 23 saat olabilir')
        }
        return schema
      }),
    intervalUnit: Yup.string()
      .oneOf(['seconds', 'minutes', 'hours'], 'Geçersiz zaman birimi!')
      .required('intervalUnit zorunludur!'),
    reportTime: Yup.number()
      .required('rapor zamanı girmeniz zorunludur!')
      .when('reportTimeUnit', (reportTimeUnit, schema) => {
        if (reportTimeUnit === 'hours') {
          return schema
            .min(1, 'En az 1 saat olmalı')
            .max(23, 'En fazla 23 saat olabilir')
        }
        if (reportTimeUnit === 'days') {
          return schema
            .min(1, 'En az 1 gün olmalı')
            .max(30, 'En fazla 30 gün olabilir')
        }
        if (reportTimeUnit === 'weeks') {
          return schema
            .min(1, 'En az 1 hafta olmalı')
            .max(3, 'En fazla 3 hafta olabilir')
        }
        if (reportTimeUnit === 'months') {
          return schema
            .min(1, 'En az 1 ay olmalı')
            .max(11, 'En fazla 11 ay olabilir')
        }
        return schema
      }),
    reportTimeUnit: Yup.string()
      .oneOf(['days', 'weeks', 'hours', 'months'], 'Geçersiz zaman birimi!')
      .required('raporlama zaman birimi zorunludur!'),
    allowedStatusCodes: Yup.array()
      .of(Yup.string().length(3, 'Status kodu 3 karakter olmalıdır'))
      .min(1, 'En az bir status kodu girilmelidir')
      .required('allowedStatusCodes zorunludur!'),
  })

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
    console.log(isOpen)
  }

  const handleSubmit = async (e) => {
    navigate('new/http')
  }

  const calculateStats = () => {
    const total = monitors.length
    const active = monitors.filter((m) => m.status === 'up').length
    const down = monitors.filter((m) => m.status === 'down').length
    const avgActive = (active / total) * 100
    console.log('aktif:',avgActive)
    return [
      { title: 'Toplam', value: total.toString(), color: '#1976d2' },
      { title: 'Çalışan', value: active.toString(), color: '#2e7d32' },
      { title: 'Çalışmayan', value: down.toString(), color: '#d32f2f' },
      {
        title: 'Çalışan Yüzdesi',
        value: avgActive ? avgActive.toString() + '%' : '0%',
        color: '#ed6c02',
      },
    ]
  }

  useEffect(() => {
    setCurrentStats(calculateStats())
  }, [monitors])

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const response = await api.get(`monitors/`)
        if (response.data) {
          setMonitors(response.data)
          console.log(response.data)
        }
      } catch (error) {
        console.error('Monitör verileri alınırken hata oluştu:', error)
        alertify.error('Monitör verileri alınırken bir hata oluştu.')
      }
    }

    const interval = setInterval(fetchMonitors, 20000)
    fetchMonitors()
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
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
      const typeMatch = monitor.monitorType?.toLowerCase().includes(searchLower)
      return nameMatch || hostMatch || typeMatch
    })

    setFilteredMonitors(filtered)
  }, [searchQuery, monitors])

  const columns = [
    {
      field: 'status',
      headerName: '',
      width: '10%',
      flex: 1,
      renderCell: (params) => {
        // Uptime Robot tarzı renk ve metinler
        let color = '#bdbdbd'
        let pulseColor = '#e0e0e0'
        let text = 'Belirsiz'
        if (params.value === 'up') {
          color = '#2e7d32'
          pulseColor = 'rgba(46,125,50,0.3)'
          text = 'Çalışıyor'
        } else if (params.value === 'down') {
          color = '#d32f2f'
          pulseColor = 'rgba(211,47,47,0.3)'
          text = 'Çalışmıyor'
        } else if (params.value === 'maintanance') {
          color = '#ed6c02'
          pulseColor = 'rgba(237,108,2,0.3)'
          text = 'Bakım'
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ position: 'relative', width: 32, height: 32 }}>
              {/* Pulse animasyon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  background: pulseColor,
                  animation: 'pulseAnim 1.6s infinite cubic-bezier(0.66,0,0,1)',
                  zIndex: 1,
                  /* '@keyframes pulseAnim': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '25%': { transform: 'scale(1)', opacity: 0.75 },
                    '50%': { transform: 'scale(1.7)', opacity: 0.5 },
                    '75%': { transform: 'scale(1)', opacity: 0.4 },
                    '100%': { transform: 'scale(1.7)', opacity: 0.3 },
                  },*/
                  margin: '30%',
                }}
              />
              {/* Ana renkli yuvarlak */}
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: color,
                  border: '2.5px solid white',
                  boxShadow: '0 0 8px 0 ' + color,
                  zIndex: 2,
                  position: 'absolute',
                  transition: 'box-shadow 0.3s, filter 0.3s',
                  /*'&:hover': {
                    boxShadow: '5px 5px 0px 0px ' + color,
                    filter: 'brightness(1.15)',
                  },*/
                  margin: '30%',
                }}
              />
            </Box>
            <Typography
              /* fontWeight={700}
              fontSize={{ xs: '1rem', sm: '1.1rem', md: '1.2rem' }}*/
              color={color}
              sx={{ letterSpacing: 0.5 }}
            >
              {/*text*/}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'name',
      headerName: 'Adı',
      width: '20%',
      flex: 3,
      size: 'medium',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, margin: '5' }}>
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'host',
      headerName: 'Host',
      width: '30%',
      flex: 5,
      size: 'medium',
      renderCell: (params) => {
        switch (params.row.monitorType) {
          case 'HttpMonitor':
            return (
              <Box
                sx={{ display: 'flex-column', alignItems: 'center', gap: 0.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.httpMonitor.host}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.monitorType}</Typography>
                  {/*<Typography  backgroundColor={
                params.row.httpMonitor.method==="GET"
                ? "green" : params.row.httpMonitor.method==="POST"
                ? "orange" : params.row.httpMonitor.method==="PUT"
                ? "orange" : params.row.httpMonitor.method==="DELETE"
                ? "red" : params.row.httpMonitor.method==="HEAD"
                ? "blue" : params.row.httpMonitor.method==="PATCH"
                ? "purple" : params.row.httpMonitor.method==="OPTION"
                } borderRadius={0.3} fontStyle={{color:"white"}} fontSize={"80%"}>{params.row.httpMonitor.method}
                </Typography>*/}
                </Box>
              </Box>
            )
          case 'PingMonitor':
            return (
              <Box
                sx={{ display: 'flex-column', alignItems: 'center', gap: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.pingMonitor.host}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.monitorType}</Typography>
                </Box>
              </Box>
            )
          case 'CronJobMonitor':
            return (
              <Box sx={{ display: 'flex-column', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography>{params.row.monitorType}</Typography>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        params.row.cronJobMonitor.host
                      )
                    }}
                    sx={{
                      width: '5rem',
                    }}
                  >
                    Copy
                  </Button>
                </Box>
              </Box>
            )
          case 'PortMonitor':
            return (
              <Box
                sx={{ display: 'flex-column', alignItems: 'center', gap: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.portMonitor.host}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.monitorType}</Typography>
                  {/*<Typography borderRadius={0.1}  backgroundColor={"orange"} fontSize={"80%"}>{params.row.portMonitor.port}</Typography>*/}
                </Box>
              </Box>
            )
          case 'KeywordMonitor':
            return (
              <Box
                sx={{ display: 'flex-column', alignItems: 'center', gap: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.keyWordMonitor.host}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{params.row.monitorType}</Typography>
                  {/*<Typography  backgroundColor={
                params.row.keyWordMonitor.method==="GET"
                ? "green" : params.row.keyWordMonitor.method==="POST"
                ? "orange" : params.row.keyWordMonitor.method==="PUT"
                ? "orange" : params.row.keyWordMonitor.method==="DELETE"
                ? "red" : params.row.keyWordMonitor.method==="HEAD"
                ? "blue" : params.row.keyWordMonitor.method==="PATCH"
                ? "purple" : params.row.keyWordMonitor.method==="OPTION"
                } borderRadius={0.1} fontStyle={{color:"white"}} fontSize={"80%"}>{params.row.keyWordMonitor.method}
                </Typography>*/}
                </Box>
              </Box>
            )

          default:
            console.error('Unknown monitor type:', params.row.monitorType)
        }
      },
    },
    {
      field: 'logs',
      headerName: 'Başarı Oranı',
      width: '30%',
      flex: 5,
      renderCell: (params) => {
        const logsRate = params.row.logs || []
        const total = logsRate.length
        const successCount = logsRate.filter(
          (log) => log.status === 'up'
        ).length
        const errorCount = logsRate.filter(
          (log) => log.status === 'down' || log.isError
        ).length
        const lastLog = logsRate[logsRate.length - 1]
        const rate = total > 0 ? Math.round((successCount / total) * 100) : 0
        const logs = params.row.logs.slice(-15) || []
        const size = logs.length
        for (let i = size; i < 15; i++) {
          logs[i] = {
            id: '',
            monitorId: '',
            status: '',
            responseTime: '',
            isError: '',
            createdAt: '',
          }
        }
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {logs.map((log, idx) => (
                <Tooltip
                  key={idx}
                  title={
                    <Box>
                      <Typography fontSize={13} fontWeight={600}>
                        Log Detay
                      </Typography>
                      <Typography fontSize={12}>
                        Durum:{' '}
                        {log.status === 'up'
                          ? 'Başarılı'
                          : log.status === 'down'
                          ? 'Başarısız'
                          : 'Belirsiz'}
                      </Typography>
                      <Typography fontSize={12}>
                        Yanıt Süresi: {log.responseTime} ms
                      </Typography>
                      <Typography fontSize={12}>
                        Tarih: {String(log.createdAt).split('T')[0]}
                      </Typography>
                      <Typography fontSize={12}>
                        Saat: {String(log.createdAt).split('T')[1].split('.')[0]}
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 30,
                      borderRadius: 1,
                      backgroundColor:
                        log.status === 'up'
                          ? '#2e7d32'
                          : log.status === 'down'
                          ? '#d32f2f'
                          : 'rgba(25, 118, 210, 0.15)',
                      '&:hover': {
                        transform: 'scale(1.18)',
                        boxShadow: '0 0 8px 2px rgba(25, 118, 210, 0.15)',
                        filter: 'brightness(1.15)',
                      },
                      '@keyframes fadeInBar': {
                        from: { opacity: 0, transform: 'translateY(-10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
            <Tooltip
              title={
                <Box>
                  <Typography fontWeight={600} fontSize={15} mb={1}>
                    Log Detayları
                  </Typography>
                  <Typography fontSize={13}>Toplam Log: {total}</Typography>
                  <Typography fontSize={13}>
                    Başarılı: {successCount}
                  </Typography>
                  <Typography fontSize={13}>Hatalı: {errorCount}</Typography>
                  {lastLog && (
                    <Box mt={1}>
                      <Typography fontSize={13} fontWeight={600}>
                        Son Log
                      </Typography>
                      <Typography fontSize={12}>
                        Durum:{' '}
                        {lastLog.status === 'up'
                          ? 'Başarılı'
                          : lastLog.status === 'down'
                          ? 'Başarısız'
                          : 'Belirsiz'}
                      </Typography>
                      <Typography fontSize={12}>
                        Yanıt Süresi: {lastLog.responseTime} ms
                      </Typography>
                      <Typography fontSize={12}>
                        Tarih: {String(lastLog.createdAt).split('T')[0]}
                      </Typography>
                      <Typography fontSize={12}>
                        Saat: {String(lastLog.createdAt).split('T')[1].split('.')[0]}
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
              arrow
              placement="top"
            >
              <Box
                sx={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}
              >
                <Typography
                  variant="caption"
                  color={
                    rate >= 80
                      ? 'success.main'
                      : rate >= 50
                      ? 'warning.main'
                      : 'error.main'
                  }
                  fontWeight={600}
                  fontSize={{ xs: '0.5rem', sm: '0.8rem' }}
                >
                  %{rate}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        )
      },
    },
    {
      field: 'edit',
      headerName: '',
      width: '10%',
      flex: 1,
      renderCell: (params) => (
        <MenuButton
          monitor={params.row}
          monitors={monitors}
          setMonitors={setMonitors}
          sx={{ mt: 2 }}
        />
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: {
            xs: isOpen ? '100%' : 0,
            sm: isOpen ? '100%' : 0,
            md: isOpen ? '30%' : '5%',
            lg: isOpen ? '15%' : '3%',
            xlg: isOpen ? '15%' : '5%',
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
          width: {
            xs: isOpen ? 0 : '100%',
            sm: isOpen ? 0 : '100%',
            md: isOpen ? 0 : '100%',
            lg: isOpen ? '5%' : '95%',
            xlg: isOpen ? '5%' : '95%',
          },
          flexShrink: 0,
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa',
          margin: '0 auto',
          ml: { xs: 0, sm: isOpen ? '30px' : '50px' },
          transition: 'margin-left 0.3s',
          //width: { xs: '100%', sm: '100%' /*`calc(100% - ${isOpen ? '270px' : '270px'})`*/ },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
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
                xs: '0.5rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.5rem',
                xlg: '2rem',
              },
            }}
          >
            İzleme Sayfası
          </Typography>
          <IconButton
            onClick={toggleSidebar}
            sx={{
              display: { xs: 'flex', sm: 'flex', md:'none'},
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

          <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5, xlg: 6 }} sx={{mb:1}}>
            {currentStats.map((stat) => (
              <Grid item xs={12} sm={6} md={2} lg={3} xlg={3} key={stat.title}>
                <Card
                  sx={{
                    height: '70px',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography
                      color="text.secondary"
                      component='div'
                      sx={{
                        fontSize: {
                          xs: '0.2rem',
                          sm: '0.8rem',
                          md: '1rem',
                          lg: '1.2rem',
                          xlg: '1.5rem',
                        },
                        
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        color: stat.color,
                        fontSize: {
                          xs: '0.5rem',
                          sm: '0.8rem',
                          md: '1rem',
                          lg: '1.5rem',
                          xlg: '2rem',
                        },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Paper sx={{ p: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xlg: 3 }}}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 2,
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: {
                    xs: '0.5rem',
                    sm: '0.8rem',
                    md: '1rem',
                    lg: '1.2rem',
                    xlg: '1.5rem',
                  },
                }}
              >
                İzleme listesi
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleSubmit()}
                color="primary"
                sx={{
                  fontSize: {
                    xs: '0.2rem',
                    sm: '0.4rem',
                    md: '0.6rem',
                    lg: '0.8rem',
                    xlg: '1rem',
                  },
                }}
              >
                İzleme Ekle
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Monitor adı ile arama yapın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            <DataGrid
              rows={filteredMonitors}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              autoHeight
              disableRowSelectionOnClick
              initialState={{
                sorting: {
                  sortModel: [{ field: 'name', sort: 'asc' }],
                },
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  fontSize: {
                    xs: '0.5em',
                    sm: '0.7rem',
                    md: '0.9rem',
                    lg: '1.1rem',
                    xlg: '1.2rem',
                  },
                  lineHeight: 1.5,
                  alignContent: 'center',
                  alignItems: 'center',
                },
                '& .MuiDataGrid-columnHeader': {
                  fontSize: {
                    xs: '0.5em',
                    sm: '0.7rem',
                    md: '0.7rem',
                    lg: '1rem',
                    xlg: '1.2rem',
                  },
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  fontWeight: 'bold',
                },
              }}
            />
          </Paper>
        
      </Box>
    </Box>
  )
}
