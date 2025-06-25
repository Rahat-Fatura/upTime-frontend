import { useState, useEffect } from 'react'
import alertify from 'alertifyjs'
import api from '../../api/auth/axiosInstance'
import BuildIcon from '@mui/icons-material/Build'
import Swal from 'sweetalert2'
import MenuButton from '../../components/menuButton/index.js';
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
  Chip,
  LinearProgress,
  Tooltip,
  Divider,
  Stack,
  TextField,
  InputAdornment,
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
  const [menuButton, setMenuButton] = useState(false)
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
    return [
      { title: 'Toplam', value: total.toString(), color: '#1976d2' },
      { title: 'Çalışan', value: active.toString(), color: '#2e7d32' },
      { title: 'Çalışmayan', value: down.toString(), color: '#d32f2f' },
      {
        title: 'Aktif İzleme Yüzdesi',
        value: avgActive ? avgActive.toString().substring(0, 5) + '%' : '0%',
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
    console.log("MenuButton ÇAlıştı")
    
    fetchMonitors()
    
  }, [menuButton])

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

  const handleMonitorAction = async (action, monitorId) => {
    try {
      switch (action) {
        case 'start':
          const res = await api.put(`monitors/${monitorId}/play`, {})
          setMonitors((prevMonitors) =>
            prevMonitors.map((m) =>
              m.id === monitorId
                ? { ...m, isActiveByOwner: true, status: 'uncertain' }
                : m
            )
          )
          alertify.success(`${res.data.name} sunucu başlatıldı`)
          break

        case 'pause':
          try {
            const response = await api.put(`monitors/${monitorId}/pause`, {})
            setMonitors((prevMonitors) =>
              prevMonitors.map((m) =>
                m.id === monitorId
                  ? { ...m, isActiveByOwner: false, status: 'uncertain' }
                  : m
              )
            )
            alertify.warning(`${response.data.name} sunucu durduruldu`)
          } catch (error) {
            console.error('Sunucu durdurulurken hata oluştu:', error)
            alertify.error(
              'Sunucu durdurulurken bir hata oluştu: ' +
                (error.response?.data?.message || error.message)
            )
          }
          break
        case 'delete':
          Swal.fire({
            title: 'Silmek istediğinizden emin misiniz',
            icon: 'warning',
            text: 'İzlemeyi sistemden tamamen silinecektir',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Evet silmek istiyorum',
            cancelButtonText: 'Hayır',
          })
            .then(async (result) => {
              if (result.isConfirmed) {
                await api.delete(`monitors/${monitorId}`)
                setMonitors((prevMonitors) =>
                  prevMonitors.filter((m) => m.id !== monitorId)
                )
                Swal.fire({
                  icon: 'success',
                  title: 'İzleme Silindi',
                  text: 'Başarılı şekilde silindi',
                  confirmButtonText: 'Tamam',
                })
              }
            })
            .catch((error) => {
              console.log(error)
              Swal.fire({
                icon: 'error',
                title: 'Hatalı İşlem',
                text: error.response.data.message,
                confirmButtonText: 'Tamam',
              })
            })
          break

        default:
          alertify.error('Geçersiz işlem')
          console.error('Geçersiz işlem')
      }
    } catch (error) {
      console.error('İşlem sırasında bir hata oluştu:', error)
      alertify.error(
        'İşlem sırasında bir hata oluştu: ' +
          (error.response?.data?.message || error.message)
      )
    }
  }

  

  const columns = [
    {
      field: 'name',
      headerName: 'Adı',
      width: 250,
      size: 'medium',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          <Typography
            fontSize={{
              xs: '0.875rem',
              sm: '1rem',
              md: '1.125rem',
              lg: '1.25rem',
              xlg: '1.5rem',
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'host',
      headerName: 'Host',
      width: 300,
      size: 'medium',
      renderCell: (params) => {
        switch (params.row.monitorType) {
          case 'HttpMonitor':
            return (
              <Box
                sx={{ display: 'flex-column', alignItems: 'center', gap: 0.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    fontSize={{
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }}
                  >
                    {params.row.httpMonitor.host}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontSize={'80%'}>
                    {params.row.monitorType}
                  </Typography>
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
                  <Typography
                    fontSize={{
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }}
                  >
                    {params.row.pingMonitor.host}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontSize={'80%'}>
                    {params.row.monitorType}
                  </Typography>
                </Box>
              </Box>
            )
          case 'CronJobMonitor':
            return (
              <Box
                sx={{ display: 'flex-column', alignItems: 'center', gap: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    fontSize={{
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }}
                  >
                    CRON JOB URL {'==>' /*params.row.cronJobMonitor.host*/}
                  </Typography>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        params.row.cronJobMonitor.host
                      )
                    }}
                  >
                    COPY
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontSize={'80%'}>
                    {params.row.monitorType}{' '}
                  </Typography>
                </Box>
              </Box>
            )
          case 'PortMonitor':
            return (
              <Box
                sx={{ display: 'flex-column', alignItems: 'center', gap: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    fontSize={{
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }}
                  >
                    {params.row.portMonitor.host}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontSize={'80%'}>
                    {params.row.monitorType}
                  </Typography>
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
                  <Typography
                    fontSize={{
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }}
                  >
                    {params.row.keyWordMonitor.host}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontSize={'80%'}>
                    {params.row.monitorType}
                  </Typography>
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
      field: 'status',
      headerName: 'Durumu',
      width: 200,
      renderCell: (params) => {
        if (params.value === 'uncertain') {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                icon={<HelpOutline />}
                label="Belirsiz"
                color="warning"
                size="medium"
                sx={{
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }, // örnek: 16px
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>
          )
        }
        if (params.value === 'maintanance') {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                icon={<BuildIcon />}
                label="Bakım modu"
                color="info"
                size="medium"
                sx={{
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }, // örnek: 16px
                    fontWeight: 'bold',
                    fontColor: 'black',
                  },
                }}
              />
            </Box>
          )
        }
        if (params.value === 'down') {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                icon={<WarningIcon />}
                label={'Başarısız'}
                color={'error'}
                size="medium"
                sx={{
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }, // örnek: 16px
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>
          )
        }
        if (params.value === 'up') {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                icon={<CheckCircleIcon />}
                label={'Başarılı'}
                color={'success'}
                size="medium"
                sx={{
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem',
                      md: '1.125rem',
                      lg: '1.25rem',
                      xlg: '1.5rem',
                    }, // örnek: 16px
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>
          )
        }
      },
    },
    {
      field: 'succesRate',
      headerName: 'Başarı Oranı',
      width: 200,
      renderCell: (params) => {
        console.log(params.row.successRate)
        if (!params.row.successRate) {
          return (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize={{
                  xs: '0.875rem',
                  sm: '1rem',
                  md: '1.125rem',
                  lg: '1.25rem',
                  xlg: '1.5rem',
                }}
              >
                No info
              </Typography>
            </Box>
          )
        }

        const successRate = Number(
          params.row.successRate.substring(0, params.row.successRate.length - 1)
        )
        console.log(successRate)
        const color =
          successRate >= 90
            ? 'success'
            : successRate >= 70
            ? 'warning'
            : 'error'

        return (
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mt: 2.5 }}
            >
              <LinearProgress
                variant="determinate"
                value={successRate}
                color={color}
                sx={{
                  width: '100%',
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center' }}
            >
              {params.row.successRate}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {!params.row.isActiveByOwner && (
            <Tooltip title="Başlat">
              <IconButton
                size="small"
                color="success"
                onClick={() => handleMonitorAction('start', params.row.id)}
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          )}
          {params.row.isActiveByOwner && (
            <Tooltip title="Pause">
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleMonitorAction('pause', params.row.id)}
              >
                <PauseIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleMonitorAction('delete', params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'edit',
      headerName: 'Düzenleme',
      width: 120,
      renderCell: (params) => (<MenuButton monitor={params.row} setMenuButton={setMenuButton}/>
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
            md: isOpen ? '30%' : 0,
            lg: isOpen ? '20%' : 0,
            xlg: isOpen ? '10%' : 0,
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
            lg: isOpen ? '10%' : '90%',
            xlg: isOpen ? '20%' : '80%',
          },
          flexShrink: 0,
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa',
          //minHeight: '100%',
          // maxWidth: '100%',
          margin: '0 auto',
          ml: { xs: 0, sm: isOpen ? '60px' : '60px' },
          transition: 'margin-left 0.3s',
          // width: { xs: '100%', sm: '100%' /*`calc(100% - ${isOpen ? '270px' : '270px'})`*/ },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 3,
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#1976d2',
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
                md: '2.5rem',
                lg: '3rem',
                xlg: '3.5rem',
              },
            }}
          >
            İzleme Sayfası
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
        <Divider sx={{ mb: 4 }} />

        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5, xlg: 6 }}>
            {currentStats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} lg={3} xlg={3} key={stat.title}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        fontSize: {
                          xs: '0.875rem',
                          sm: '1rem',
                          md: '1.2rem',
                          lg: '1.5rem',
                          xlg: '2rem',
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
                          xs: '1.5rem',
                          sm: '2rem',
                          md: '2rem',
                          lg: '2.5rem',
                          xlg: '3rem',
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

          <Paper sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5, xlg: 6 }, mt: 3 }}>
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
                    xs: '1.1rem',
                    sm: '1.25rem',
                    md: '1.5rem',
                    lg: '2rem',
                    xlg: '2.5rem',
                  },
                }}
              >
                İzleme listesi
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                color="primary"
                onClick={() => handleSubmit()}
                sx={{
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem',
                    lg: '1.25rem',
                    xlg: '1.5rem',
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
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem',
                    lg: '1.25rem',
                    xlg: '1.5rem',
                  },
                  lineHeight: 1.5,
                },
                '& .MuiDataGrid-columnHeader': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem',
                    lg: '1.25rem',
                    xlg: '1.5rem',
                  },
                  fontWeight: 'bold',
                },
              }}
            />
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
