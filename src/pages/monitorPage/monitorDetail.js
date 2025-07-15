import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  Divider,
  Card,
  CardContent,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../components/sideBar/sideBar'
import MonitorStatus from '../../components/Animate/monitorStatus'
import ReportTable from '../../components/reportTable'
import api from '../../api/auth/axiosInstance'
import {
  AccessTime,
  CheckCircle,
  Error,
  Warning,
  TrendingUp,
  Schedule,
  Person,
  Build,
  Monitor,
  InfoOutlined,
  DeveloperBoard,
  Computer,
  Pause,
  Edit,
  Delete,
  NotificationsPaused,
  PlayArrow,
} from '@mui/icons-material'
import localStorage from 'local-storage'
import { QuestionMark } from 'tabler-icons-react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import ResponseTimeLineChart from '../../components/reportTable/lineChart'
import { CodeIcon, TimerIcon } from 'lucide-react'
import Swal from 'sweetalert2'
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}))

export default function MonitorDetail() {
  /*Keyword Dialog*/
  const [keywordDialogOpen, setKeywordDialogOpen] = useState(false)
  const navigate = useNavigate()
  const handleClickKeywordDialohOpen = () => {
    setKeywordDialogOpen(true)
  }
  const handleClickKeywordDialogClose = () => {
    setKeywordDialogOpen(false)
  }
  /*************/
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()
  const [monitor, setMonitor] = useState();
  // const [params, setParams] = useState(useParams())

  const { id } = useParams()

  const handlDeleteMenu = (monitor) => {
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
          await api.delete(`monitors/${monitor.id}`)
          Swal.fire({
            icon: 'success',
            title: 'İzleme Silindi',
            text: 'Başarılı şekilde silindi',
            confirmButtonText: 'Tamam',
          })
          navigate('/user/monitors')
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
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleEditButton = (monitor) => {
    switch (monitor.monitorType) {
      case 'HttpMonitor':
        navigate(`/user/monitors/${monitor.id}/http`)
        //handleClose()
        break
      case 'PingMonitor':
        navigate(`/user/monitors/${monitor.id}/ping`)
        //handleClose()
        break
      case 'CronJobMonitor':
        navigate(`/user/monitors/${monitor.id}/cronjob`)
        //handleClose()
        break
      case 'PortMonitor':
        navigate(`/user/monitors/${monitor.id}/port`)
        //handleClose()
        break
      case 'KeywordMonitor':
        navigate(`/user/monitors/${monitor.id}/keyword`)
        //handleClose()
        break
      default:
        console.error('Unknow monitor type ! :', monitor.monitorType)
        //handleClose()
        break
    }
  }

  const handleTestButton = async (monitor) => {
    try {
      let timerInterval

      Swal.fire({
        title: 'İzleme test ediliyor!',
        html: 'Cevap bekleniyor lütfen bekleyiniz.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: async () => {
          Swal.showLoading()

          /*const timer = Swal.getPopup().querySelector('b')
            timerInterval = setInterval(() => {
              const left = Swal.getTimerLeft?.()
              if (left !== undefined) timer.textContent = `${left}`
            }, 100)*/

          try {
            const response = await api.get(
              `monitors/instant-Control/${monitor.id}`
            )

            //clearInterval(timerInterval)

            const result = {
              status: response.data.status,
              responseTime: response.data.responseTime,
              isError: response.data.isError,
              message: response.data.message,
              timestamp: new Date().toLocaleTimeString(),
            }

            Swal.fire({
              title: 'Cevap Detayları',
              html: `
          <div style="text-align: left; font-size: 16px; padding: 10px; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-weight: bold; padding: 6px;">Durum:</td>
                <td style="color: ${
                  result.isError ? 'red' : 'green'
                }; padding: 6px;">
                  ${result.status}
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 6px;">Yanıt Süresi:</td>
                <td style="padding: 6px;">${result.responseTime} ms</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 6px;">Hata:</td>
                <td style="padding: 6px; color: ${
                  result.isError ? 'red' : 'green'
                };">
                  ${result.isError ? 'HATA VAR' : 'YOK'}
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 6px;">Mesaj:</td>
                <td style="padding: 6px;">${
                  result.message === 'success' ? 'Başarılı' : 'Başarısız'
                }</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 6px;">Test edilen zaman:</td>
                <td style="padding: 6px;">${result.imestamp}</td>
              </tr>
            </table>
          </div>
        `,
              icon: result.isError ? 'error' : 'success',
              confirmButtonText: 'Tamam',
            })
          } catch (error) {
            console.error('İstek hatası:', error)
            clearInterval(timerInterval)
            Swal.fire({
              title: 'Hata!',
              text: 'Sunucudan yanıt alınamadı.',
              icon: 'error',
              confirmButtonText: 'Tamam',
            })
          }
        },
      })

      //handleClose()
    } catch (error) {
      console.error('İstek hatası:', error)
      //handleClose()
    } finally {
      //handleClose()
    }
  }

  const handlePauseMonitorButton = async (monitor) => {
    try {
      const response = await api.put(`monitors/${monitor.id}/pause`, {})
      Swal.fire({
        icon: 'success',
        title: 'İzleme Durduruldu',
        text: 'İzleme başarıyla durduruldu.',
        confirmButtonText: 'Tamam',
      })
      setMonitor({ ...monitor,isActiveByOwner:false , status: 'uncertain'} );
    } catch (error) {
      console.error('Sunucu durdurulurken hata oluştu:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'İzleme durdurulamadı. Lütfen tekrar deneyin.',
        confirmButtonText: 'Tamam',
      })
    }
  }

  const handlePlayMonitorButton = async (monitor) => {
    try {
      const res = await api.put(`monitors/${monitor.id}/play`, {})
      Swal.fire({
        icon: 'success',
        title: 'İzleme Çalıştırıldı',
        text: 'İzleme başarıyla başlatıldı.',
        confirmButtonText: 'Tamam',
      })
      setMonitor({...monitor,isActiveByOwner:true,status: 'uncertain'});
    } catch (error) {
      console.error('Sunucu çalıştırılırken hata oluştu:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'İzleme çalıştırılamadı. Lütfen tekrar deneyin.',
        confirmButtonText: 'Tamam',
      })
    }
  }

  const handleDeleteButton = (monitor) => {
    try {
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
            await api.delete(`monitors/${monitor.id}`)
            Swal.fire({
              icon: 'success',
              title: 'İzleme Silindi',
              text: 'Başarılı şekilde silindi',
              confirmButtonText: 'Tamam',
            })
            navigate('/user/monitors')
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
    } catch (error) {}
  }

  const getMonitorById = async (monitorId) => {
    try {
      const monitor = await api.get(`monitors/${monitorId}`)
      console.log(monitor.data)
      setMonitor(monitor.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log('Useefefefe jfje njnj')
    // const monitorId = params.id
    getMonitorById(id)
  }, [id])

  // İstatistik hesaplamaları
  const calculateStats = () => {
    if (!monitor?.logs) return {}
    let logs = monitor.logs.sort(function(a,b){return a.id-b.id});
    const totalLogs = monitor.logs.length
    const upLogs = monitor.logs.filter((log) => log.status === 'up').length
    const downLogs = monitor.logs.filter((log) => log.status === 'down').length
    const uptime = totalLogs > 0 ? ((upLogs / totalLogs) * 100).toFixed(2) : 0
    const lastLogs =
      logs.length > 250 ? logs.slice(-250) : monitor.logs
    const avgResponseTime =
      lastLogs.reduce((sum, log) => sum + log.responseTime, 0) / lastLogs.length
    const maxResponseTime = Math.max(...lastLogs.map((log) => log.responseTime))
    const minResponseTime = Math.min(...lastLogs.map((log) => log.responseTime))

    return {
      totalLogs,
      upLogs,
      downLogs,
      uptime,
      lastLogs,
      avgResponseTime: avgResponseTime.toFixed(2),
      maxResponseTime,
      minResponseTime,
    }
  }

  const stats = calculateStats()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'up':
        return 'success'
      case 'down':
        return 'error'
      case 'uncertain':
        return 'warning'
      case 'maintanance':
        return 'info'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up':
        return <CheckCircle fontSize="small" />
      case 'down':
        return <Error fontSize="small" />
      case 'uncertain':
        return <QuestionMark fontSize="small" />
      case 'maintanance':
        return <Build fontSize="small" />
      default:
        return <Warning fontSize="small" />
    }
  }

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
  return monitor ? (
    <Grid container spacing={2}>
      <Grid item md={isOpen ? 2.3 : 0.75}>
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Grid>
      <Grid
        item
        md={isOpen ? 9.7 : 11.25}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 2,
          flexShrink: 0,
          flexGrow: 1,
        }}
      >
        <Grid item md={12} sx={{ mb: 2 }}>
          <Grid item md={12} sx={{ display: 'flex' }}>
            <Grid md={6.5} sx={{ display: 'flex', alignItems: 'self-start' }}>
              <Grid gap={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item md={1} justifyItems={'start'}>
                  <Box>
                    <MonitorStatus
                      sx={{
                        width: 25,
                        height: 25,
                        animeWidth: 18,
                        animeHeight: 18,
                      }}
                      status={monitor?.status || ''}
                    />
                  </Box>
                </Grid>
                <Grid item md={11} justifyItems={'start'} alignItems={'start'}>
                  <Typography
                    variant="h5"
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
                    {monitor?.name || ''}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: {
                        xs: '0.6rem',
                        sm: '0.6rem',
                        md: '0.8rem',
                        lg: '0.8rem',
                        xlg: '1rem',
                      },
                    }}
                  >
                    {monitor?.monitorType || ''}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              md={5.5}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'end',
              }}
            >
              <Grid
                item
                md={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',

                  justifyItems: 'end',
                  padding: 1,
                  pr: 5,
                }}
                gap={1}
              >
                <IconButton
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.secondary.dark,
                    borderRadius: '10%',
                    height: 25,
                    fontSize: '0.75rem',
                    color: 'white',
                    ':hover':{
                      bgcolor: theme.palette.secondary.main,
                    }
                  }}
                  onClick={() => handleEditButton(monitor)}
                >
                  <Edit fontSize="small" color="#ffff"></Edit>
                  Düzenle
                </IconButton>
                <IconButton
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    borderRadius: '10%',
                    height: 25,
                    fontSize: '0.75rem',
                    color: 'white',
                    ':hover':{
                      bgcolor: theme.palette.primary.main,
                    }
                  }}
                  onClick={() => handleTestButton(monitor)}
                >
                  <NotificationsPaused fontSize="small" color="#ffff" />
                  Test et
                </IconButton>

                <IconButton
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    borderRadius: '10%',
                    height: 25,
                    fontSize: '0.75rem',
                    color: 'white',
                    ':hover':{
                      bgcolor: theme.palette.primary.dark,
                    }
                  }}
                  onClick={() => {
                    if (monitor.isActiveByOwner) {
                      handlePauseMonitorButton(monitor)
                    } else {
                      handlePlayMonitorButton(monitor)
                    }
                  }}
                >
                  {monitor.isActiveByOwner ? (
                    <Pause color="#ffff" fontSize="small" />
                  ) : (
                    <PlayArrow color="#ffff" fontSize="small" />
                  )}
                  {monitor.isActiveByOwner ? 'Durdur' : 'Çalıştır'}
                </IconButton>
                <IconButton
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.error.main,
                    borderRadius: '10%',
                    height: 25,
                    fontSize: '0.75rem',
                    color: 'white',
                    ':hover':{
                      bgcolor: theme.palette.error.dark,
                    }
                  }}
                  onClick={() => handleDeleteButton(monitor)}
                >
                  <Delete color="#ffff" fontSize="small" />
                  Sil
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
        </Grid>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid
            item
            md={8}
            sx={{ display: 'flex', flexDirection: 'column' }}
            gap={2}
          >
            {/* Monitor Detay Kartları */}
            <Grid container spacing={2}>
              {/* Genel Bilgiler */}
              <Grid item md={6}>
                <Card sx={{ height: '100%', bgcolor: 'white' }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '1rem',
                      }}
                    >
                      <InfoOutlined color="primary" />
                      Monitor Bilgileri
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Monitor Adı
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ fontSize: '0.7rem' }}
                          >
                            {monitor?.name.substring(0, 36) || '-'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Tip
                          </Typography>
                          <Chip
                            label={monitor?.monitorType || '-'}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem', height: 22 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Durum
                          </Typography>
                          <Chip
                            icon={getStatusIcon(monitor?.status)}
                            label={
                              monitor?.status === 'up'
                                ? 'Çalışıyor'
                                : monitor?.status === 'down'
                                ? 'Çalışmıyor'
                                : monitor?.status === 'uncertain'
                                ? 'Belirsiz'
                                : monitor?.status === 'maintance'
                                ? 'Bakım'
                                : '-' || '-'
                            }
                            size="small"
                            color={getStatusColor(monitor?.status)}
                            sx={{ fontSize: '0.75rem', height: 22 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Aktif
                          </Typography>
                          <Chip
                            label={monitor?.isActiveByOwner ? 'Evet' : 'Hayır'}
                            size="small"
                            color={
                              monitor?.isActiveByOwner ? 'success' : 'error'
                            }
                            sx={{ fontSize: '0.75rem', height: 22 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Http Monitor Detayları */}
              {monitor?.httpMonitor && (
                <Grid item md={6}>
                  <Card sx={{ height: '100%', bgcolor: 'white' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '1rem',
                        }}
                      >
                        <Monitor color="primary" />
                        Http Detayı
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Host
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.httpMonitor.host.substring(0, 36)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Method
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.httpMonitor.method}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              İzin Verilen Statuslar
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.httpMonitor.allowedStatusCodes.toString() ||
                                '[]'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Timeout
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.httpMonitor.timeOut}sn
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Kontrol Aralığı
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor?.interval}{' '}
                              {monitor.intervalUnit === 'minutes'
                                ? 'dakika'
                                : monitor.intervalUnit === 'seconds'
                                ? 'saniye'
                                : monitor.intervalUnit === 'hours'
                                ? 'saat'
                                : ''}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Ping Monitor Detayları */}
              {monitor?.pingMonitor && (
                <Grid item md={6}>
                  <Card sx={{ height: '100%', bgcolor: 'white' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '1rem',
                        }}
                      >
                        <Computer color="primary" />
                        Ping Detayı
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Host
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.pingMonitor.host.substring(0, 36)}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Kontrol Aralığı
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor?.interval}{' '}
                              {monitor.intervalUnit === 'minutes'
                                ? 'dakika'
                                : monitor.intervalUnit === 'seconds'
                                ? 'saniye'
                                : monitor.intervalUnit === 'hours'
                                ? 'saat'
                                : ''}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Port Monitor Detayları */}
              {monitor?.portMonitor && (
                <Grid item md={6}>
                  <Card sx={{ height: '100%', bgcolor: 'white' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '1rem',
                        }}
                      >
                        <DeveloperBoard color="secondary" />
                        Port Detayı
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Host
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.portMonitor.host.substring(0, 36)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Port
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.portMonitor.port}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Timeout
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.portMonitor.timeOut}s
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Kontrol Aralığı
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor?.interval}{' '}
                              {monitor.intervalUnit === 'minutes'
                                ? 'dakika'
                                : monitor.intervalUnit === 'seconds'
                                ? 'saniye'
                                : monitor.intervalUnit === 'hours'
                                ? 'saat'
                                : ''}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Keyword Monitor Detayları */}
              {monitor?.keyWordMonitor && (
                <Grid item md={6}>
                  <Card sx={{ height: '100%', bgcolor: 'white' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '1rem',
                        }}
                      >
                        <CodeIcon color="green" />
                        Keyword Monitor Detayı
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Host
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.keyWordMonitor.host.substring(0, 36)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Method
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.keyWordMonitor.method}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              İzin Verilen Statuslar
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.keyWordMonitor.allowedStatusCodes.toString() ||
                                '[]'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Monitor Anahatar Kelime
                            </Typography>
                            <Button onClick={handleClickKeywordDialohOpen}>
                              Görüntüle
                            </Button>
                            <BootstrapDialog
                              onClose={handleClickKeywordDialogClose}
                              aria-labelledby="customized-dialog-title"
                              open={keywordDialogOpen}
                            >
                              <DialogTitle
                                sx={{ m: 0, p: 2 }}
                                id="customized-dialog-title"
                              >
                                Kontrol Edilen Kelime
                              </DialogTitle>

                              <DialogContent dividers>
                                <Typography gutterBottom>
                                  {monitor.keyWordMonitor.keyWord}
                                </Typography>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  autoFocus
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      monitor.keyWordMonitor.keyWord
                                    )
                                    handleClickKeywordDialogClose()
                                  }}
                                >
                                  Kopyala
                                </Button>
                                <Button
                                  autoFocus
                                  onClick={handleClickKeywordDialogClose}
                                >
                                  Kapat
                                </Button>
                              </DialogActions>
                            </BootstrapDialog>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Timeout
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor.keyWordMonitor.timeOut}sn
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Kontrol Aralığı
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {monitor?.interval}{' '}
                              {monitor.intervalUnit === 'minutes'
                                ? 'dakika'
                                : monitor.intervalUnit === 'seconds'
                                ? 'saniye'
                                : monitor.intervalUnit === 'hours'
                                ? 'saat'
                                : ''}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Cronjob Monitor Detayları */}
              {monitor?.cronJobMonitor && (
                <Grid item md={6}>
                  <Card sx={{ height: '100%', bgcolor: 'white' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '1rem',
                        }}
                      >
                        <TimerIcon />
                        Cron Job Detayı
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Host
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.cronJobMonitor.host.substring(0, 20) +
                                '...'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Bağlantıyı Görüntüle
                            </Typography>
                            <Button onClick={handleClickKeywordDialohOpen}>
                              Görüntüle
                            </Button>
                            <BootstrapDialog
                              onClose={handleClickKeywordDialogClose}
                              aria-labelledby="customized-dialog-title"
                              open={keywordDialogOpen}
                            >
                              <DialogTitle
                                sx={{ m: 0, p: 2 }}
                                id="customized-dialog-title"
                              >
                                Bağlantı
                              </DialogTitle>

                              <DialogContent dividers>
                                <Typography gutterBottom>
                                  {monitor.cronJobMonitor.host}
                                </Typography>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  autoFocus
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      monitor.cronJobMonitor.host
                                    )
                                    handleClickKeywordDialogClose()
                                  }}
                                >
                                  Kopyala
                                </Button>
                                <Button
                                  autoFocus
                                  onClick={handleClickKeywordDialogClose}
                                >
                                  Kapat
                                </Button>
                              </DialogActions>
                            </BootstrapDialog>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Sapma Zamanı
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.cronJobMonitor.devitionTime} dakika
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Kontrol Aralığı
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor?.interval}{' '}
                              {monitor.intervalUnit === 'minutes'
                                ? 'dakika'
                                : monitor.intervalUnit === 'seconds'
                                ? 'saniye'
                                : monitor.intervalUnit === 'hours'
                                ? 'saat'
                                : ''}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Son gelen istek tarihi
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.cronJobMonitor.lastRequestTime?.split("T")[0]  }
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Son gelen istek saati
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.9rem' }}
                            >
                              {monitor.cronJobMonitor.lastRequestTime?.split("T")[1].split(".")[0]}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Response Time İstatistikleri */}
              {!monitor.cronJobMonitor && (<Grid item md={12}>
                <Card sx={{bgcolor: 'white'}}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '1rem',
                      }}
                    >
                      <AccessTime color="info" />
                      Son {`${stats.lastLogs.length}`} isteğin yanıt süresi
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="info.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats.avgResponseTime}ms
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Ortalama
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="success.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats.minResponseTime}ms
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            En Hızlı
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="warning.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats.maxResponseTime}ms
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            En Yavaş
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="primary.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats?.lastLogs?.length || 0}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Log Sayısı
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <ResponseTimeLineChart logs={monitor?.logs} />
                  </CardContent>
                </Card>
              </Grid>)}

              {/* İstatistikler */}
              <Grid item md={12}>
                <Card sx={{ bgcolor: 'white'}}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '1rem',
                      }}
                    >
                      <TrendingUp color="success" />
                      Sistem Performansı
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="success.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats.uptime}%
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Performans
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(stats.uptime)}
                            color="success"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </Grid>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="primary.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats.totalLogs}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Toplam Kontrol
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="success.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats.upLogs}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Başarılı
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            color="error.main"
                            fontWeight="bold"
                            sx={{ fontSize: '0.9rem' }}
                          >
                            {stats.downLogs}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            Başarısız
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Son Loglar */}
              <Grid item md={12}>
                <Card sx={{bgcolor: 'white'}}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '1rem',
                      }}
                    >
                      <Schedule color="warning" />
                      Son Kontrol Logları
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{ mt: 2, maxHeight: 300 }}
                    >
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontSize: '0.8rem' }}>
                              Tarih
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>
                              Durum
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>
                              Yanıt Süresi
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>
                              Hata
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {monitor?.logs?.sort(function(a,b){return a.id-b.id})?.slice(-10).map((log) => (
                            <TableRow key={log.id} hover>
                              <TableCell sx={{ fontSize: '0.8rem' }}>
                                {formatDate(log.createdAt)}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>
                                <Chip
                                  icon={getStatusIcon(log.status)}
                                  label={log.status.toUpperCase()}
                                  size="small"
                                  color={getStatusColor(log.status)}
                                  sx={{ fontSize: '0.75rem', height: 22 }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>
                                {log.responseTime}ms
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>
                                <Chip
                                  label={log.isError ? 'Evet' : 'Hayır'}
                                  size="small"
                                  color={log.isError ? 'error' : 'success'}
                                  sx={{ fontSize: '0.75rem', height: 22 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          {/*Sağ taraf alanı*/}
          {monitor !== null && (
            <Grid
              item
              md={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                pr: 0,
                alignItems: 'center',
              }}
            >
              <Grid md={12} sx={{ mr: 3 }}>
                <ReportTable stats={stats} />

                {monitor?.serverOwner && (
                  <Card sx={{ mt: 2, bgcolor: 'white' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '0.9rem',
                        }}
                      >
                        <Person color="primary" />
                        Sunucu Sahibi Bilgileri
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Ad Soyad
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              {monitor.serverOwner.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              E-posta
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              {monitor.serverOwner.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Rol
                            </Typography>
                            <Chip
                              label={monitor.serverOwner.role}
                              size="small"
                              color="info"
                              sx={{ fontSize: '0.75rem', height: 22 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Durum
                            </Typography>
                            <Chip
                              label={
                                monitor.serverOwner.status ? 'Aktif' : 'Pasif'
                              }
                              size="small"
                              color={
                                monitor.serverOwner.status ? 'success' : 'error'
                              }
                              sx={{ fontSize: '0.75rem', height: 22 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              E-posta Doğrulama
                            </Typography>
                            <Chip
                              label={
                                monitor.serverOwner.isEmailVerified
                                  ? 'Doğrulandı'
                                  : 'Doğrulanmadı'
                              }
                              size="small"
                              color={
                                monitor.serverOwner.isEmailVerified
                                  ? 'success'
                                  : 'warning'
                              }
                              sx={{ fontSize: '0.75rem', height: 22 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              Oluşturulma
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              {new Date(
                                monitor.serverOwner.created_at
                              ).toLocaleString('tr-TR')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <div></div>
  )
}
