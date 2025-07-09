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
  Visibility,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { Edit } from 'tabler-icons-react'
import { INITIAL_STATS } from './constants/monitorConstants'
import Sidebar from '../../components/sideBar/sideBar'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import MonitorStatus from '../../components/Animate/monitorStatus.js'
import localStorage from 'local-storage'
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
  const [isOpen, setIsOpen] = useState(false)
  const [monitors, setMonitors] = useState([])
  const [filteredMonitors, setFilteredMonitors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonitor, setSelectedMonitor] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [currentStats, setCurrentStats] = useState(INITIAL_STATS)
  const theme = useTheme()
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = async (e) => {
    navigate('new/http')
  }

  const calculateStats = () => {
    const total = monitors.length
    const active = monitors.filter((m) => m.status === 'up').length
    const down = monitors.filter((m) => m.status === 'down').length
    const uncertain = monitors.filter((m) => m.status === 'uncertain').length
    const avgActive = (active / total) * 100
    return [
      { title: 'Toplam', value: total.toString(), color: '#1976d2' },
      { title: 'Çalışan', value: active.toString(), color: '#2e7d32' },
      { title: 'Çalışmayan', value: down.toString(), color: '#d32f2f' },
      { title: 'Belirsiz', value: uncertain.toString(), color: '#f5f102' },
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
      let hostMatch
      switch (monitor.monitorType) {
        case 'httpMonitor': {
          hostMatch = monitor.httpMonitor.host
            ?.toLowerCase()
            .includes(searchLower)
          break
        }
        case 'portMonitor': {
          hostMatch = monitor.portMonitor.host
            ?.toLowerCase()
            .includes(searchLower)
          break
        }
        case 'keyWordMonitor': {
          hostMatch = monitor.keyWordMonitor.host
            ?.toLowerCase()
            .includes(searchLower)
          break
        }
        case 'pingMonitor': {
          hostMatch = monitor.pingMonitor.host
            ?.toLowerCase()
            .includes(searchLower)
          break
        }
        case 'cronJobMonitor': {
          hostMatch = monitor.cronJobMonitor.host
            ?.toLowerCase()
            .includes(searchLower)
          break
        }
        default: {
          hostMatch = false
          break
        }
      }

      const nameMatch = monitor.name?.toLowerCase().includes(searchLower)
      const typeMatch = monitor.monitorType?.toLowerCase().includes(searchLower)
      return nameMatch || hostMatch || typeMatch
    })

    setFilteredMonitors(filtered)
  }, [searchQuery, monitors])

  const columns = [
    {
      field: 'status',
      headerName: '',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <MonitorStatus
            sx={{ width: 12, height: 12, animeWidth: 12, animeHeight: 12 }}
            status={params.value}
          />
        )
      },
    },
    /* {
      field: 'name',
      headerName: 'Adı',
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, margin: '5' }}>
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },*/
    {
      field: 'host',
      headerName: 'Host',
      flex: 3,
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex-column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{params.row.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography>{params.row.monitorType}</Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  width={'30%'}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      params.row.cronJobMonitor.host
                    )
                  }}
                  sx={{
                    ml: 2,
                    borderRadius: '15%',
                    height: 15,
                  }}
                >
                  Link
                </Button>
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
      field: 'detail',
      headerName: '',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Tooltip title="Detay">
            <IconButton
              onClick={() => {
                navigate(`${params.row.id}/detail`)
              }}
            >
              <Visibility label="Detay" fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        )
      },
    },
    {
      field: 'logs',
      headerName: 'Başarı Oranı',
      flex: 2,
      renderCell: (params) => {
        const logs = params.row.logs.slice(-25) || []
        const size = logs.length
        for (let i = size; i < 25; i++) {
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
                        Tarih: {String(log.createdAt).split('T')[0] || ''}
                      </Typography>
                      <Typography fontSize={12}>
                        Saat:{' '}
                        {String(log.createdAt).split('T')[1]?.split('.')[0] ||
                          ''}
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 20,
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
          </Box>
        )
      },
    },
    {
      field: 'succesRate',
      headerName: '',
      flex: 0.5,
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
        return (
          <Tooltip
            title={
              <Box>
                <Typography fontWeight={600} fontSize={15} mb={1}>
                  Log Detayları
                </Typography>
                <Typography fontSize={13}>Toplam Log: {total}</Typography>
                <Typography fontSize={13}>Başarılı: {successCount}</Typography>
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
                      Yanıt Süresi: {lastLog?.responseTime} ms
                    </Typography>
                    <Typography fontSize={12}>
                      Tarih: {String(lastLog?.createdAt).split('T')[0] || ''}
                    </Typography>
                    <Typography fontSize={12}>
                      Saat:{' '}
                      {String(lastLog?.createdAt).split('T')[1].split('.')[0] ||
                        ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            }
            arrow
            placement="top"
          >
            <Box sx={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}>
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
        )
      },
    },
    {
      field: 'edit',
      headerName: 'İşlemler',
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
  useEffect(() => {
    const sideBarOpen = localStorage.get('sidebar')

    if (sideBarOpen === 'false') {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }

    const cleanupLocalStorage = () => {
      localStorage.clear()
    }
    window.addEventListener('beforeunload', cleanupLocalStorage)
    return () => {
      window.removeEventListener('beforeunload', cleanupLocalStorage)
    }
  }, [])
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f8f9fa' }}>
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
            Monitoring Sayfası
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

        <Box
          sx={{
           // border: 'solid 0.5px gray',
           // borderColor: '#5c5554',
            //backgroundColor: '#ffff',
            borderRadius: '5px',
            padding: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xlg: 3 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 3, lg: 1.5, xlg: 3.5 }}
            justifyContent={'space-between'}
            sx={{ mb: 1 }}
          >
            <Grid item xs={12} sm={6} md={2} mb={1}>
              <Card
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  alignItems: 'center',
                  borderRadius: '0.1%',
                  backgroundColor: '#ffff',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                    height:'100%',
                    gap: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    component="div"
                    sx={{
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.5rem',
                      },
                    }}
                  >
                    {currentStats[0]?.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: currentStats[0]?.color,
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.2rem',
                      },
                    }}
                  >
                    {currentStats[0]?.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/*2........ */}
            <Grid item xs={12} sm={6} md={2} mb={1}>
              <Card
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  alignItems: 'center',
                  borderRadius: '0.1%',
                  backgroundColor: '#ffff',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                    height:'100%',
                    gap: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                     component="div"
                    sx={{
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.5rem',
                      },
                    }}
                  >
                    {currentStats[1]?.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: currentStats[1]?.color,
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.2rem',
                      },
                    }}
                  >
                    {currentStats[1]?.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/*3........ */}
            <Grid item xs={12} sm={6} md={2} mb={1}>
              <Card
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  alignItems: 'center',
                  borderRadius: '0.1%',
                  backgroundColor: '#ffff',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                    height:'100%',
                    gap: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    // component="div"
                    sx={{
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.5rem',
                      },
                    }}
                  >
                    {currentStats[2]?.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    // component="div"
                    sx={{
                      color: currentStats[2]?.color,
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.2rem',
                      },
                    }}
                  >
                    {currentStats[2]?.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/*4........ */}
            <Grid item xs={12} sm={6} md={2} mb={1}>
              <Card
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  alignItems: 'center',
                  borderRadius: '0.1%',
                  backgroundColor: '#ffff',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                    height:'100%',
                    gap: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    // component="div"
                    sx={{
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.5rem',
                      },
                    }}
                  >
                    {currentStats[3]?.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    // component="div"
                    sx={{
                      lineHeight:'100%',
                      color: currentStats[3]?.color,
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.2rem',
                      },
                    }}
                  >
                    {currentStats[3]?.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/*5........ */}
            <Grid item xs={12} sm={6} md={4} mb={1}>
              <Card
                sx={{
                  display: 'flex',
                  height: '40px',
                  width: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  alignItems: 'center',
                  borderRadius: '0.1%',
                  backgroundColor: '#ffff',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                    height:'100%'
                  }}
                >
                  <Typography
                    color="text.secondary"
                     component="div"
                    sx={{
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.5rem',
                      },
                    }}
                  >
                    {currentStats[4]?.title}
                  </Typography>
                  <Typography
                    variant="h4"
                     component="div"
                    sx={{
                      color: currentStats[4]?.color,
                      lineHeight:'100%',
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1rem',
                        xlg: '1.2rem',
                      },
                    }}
                  >
                    {currentStats[4]?.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Paper
            sx={{
              p: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xlg: 3 },
              backgroundColor: '#ffff',
            }}
          >
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
                    xs: '0.8rem',
                    sm: '0.8rem',
                    md: '1rem',
                    lg: '1rem',
                    xlg: '1.2rem',
                  },
                }}
              >
                Monitoring listesi
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleSubmit()}
                color="primary"
                sx={{
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.7rem',
                    md: '0.7rem',
                    lg: '0.7rem',
                    xlg: '1rem',
                  },
                }}
              >
                Monitoring Ekle
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <TextField
                //size='small'
                placeholder="Monitoring adı veya host ile arama yapın..."
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

            <DataGrid
              rows={filteredMonitors}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              rowHeight={38}
              autoHeight
              disableRowSelectionOnClick
              localeText={{
                MuiTablePagination: {
                  fontSize: {
                    xs: '0.3rem',
                    sm: '0.4rem',
                    md: '0.5rem',
                    lg: '0.7rem',
                    xlg: '0.9rem',
                  },
                  labelRowsPerPage: 'Sayfa başına satır',
                },
              }}
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
                  fontSize: '0.3rem',

                  alignContent: 'center',
                  alignItems: 'center',
                },
                '& .MuiTypography-root': {
                  fontSize: {
                    xs: '0.3rem',
                    sm: '0.4rem',
                    md: '0.5rem',
                    lg: '0.7rem',
                    xlg: '0.9rem',
                  },
                },
                '& .MuiTablePagination-selectLabel': {
                  fontSize: {
                    xs: '0.3rem',
                    sm: '0.4rem',
                    md: '0.5rem',
                    lg: '0.7rem',
                    xlg: '0.9rem',
                  },
                },
                '& .MuiTablePagination-displayedRows': {
                  fontSize: '12px',
                  color: 'gray', // "1–5 of 20" gibi metin
                },
                '& .MuiDataGrid-columnHeader': {
                  fontSize: {
                    xs: '0.3rem',
                    sm: '0.4rem',
                    md: '0.5rem',
                    lg: '0.7rem',
                    xlg: '0.9rem',
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
    </Box>
  )
}
