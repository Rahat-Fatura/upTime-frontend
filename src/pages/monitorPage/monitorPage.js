/* eslint-disable default-case */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { cookies } from '../../utils/cookie'
import {
  AppBar,
  Toolbar,
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
  Modal,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  FormHelperText,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Monitor as MonitorIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  EditAttributes,
  EditAttributesOutlined,
  Computer as ComputerIcon,
  Http as HttpIcon,
  AccessTime as AccessTimeIcon,
  Assessment as AssessmentIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
  PortableWifiOffOutlined,
  Usb,
  UsbRounded,
  RequestQuote,
  RequestPage,
  RestorePageOutlined,
  RequestQuoteTwoTone,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { Edit, World } from 'tabler-icons-react'
import { toast } from 'react-hot-toast'
import MonitorForm from '../../components/MonitorForm'
import {
  modalStyle,
  formContainerStyle,
  buttonContainerStyle,
} from '../../styles/monitorStyles'
import { INITIAL_STATS } from '../../constants/monitorConstants'

const drawerWidth = 240

const stats = [
  { title: 'Toplam Sunucu', value: '0', color: '#1976d2' },
  { title: 'Aktif Sunucu', value: '0', color: '#2e7d32' },
  { title: 'Düşen Sunucu', value: '0', color: '#d32f2f' },
  { title: 'Çalışan sunucuların yüzdesi', value: '0%', color: '#ed6c02' },
]

const methods = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
]

const formSectionStyle = {
  backgroundColor: '#f8f9fa',
  borderRadius: 2,
  p: 3,
  mb: 3,
  border: '1px solid',
  borderColor: 'divider',
}

const sectionTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mb: 2,
  color: '#1976d2',
  fontWeight: 'bold',
}

const stepIndicatorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 2,
  color: '#1976d2',
  fontWeight: 'bold',
  fontSize: '0.875rem',
}

const stepNumberStyle = {
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: '#1976d2',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 'bold',
}

const initialFormData = {
  name: '',
  method: 'GET',
  port: '8000',
  headers: {},
  interval: 5,
  intervalUnit: 'minutes',
  report_time: 1,
  reportTimeUnit: 'days',
  status: false,
  allowedStatusCodes: ['200', '201'],
  is_active_by_owner: true,
}

export default function Dashboard() {
  const [monitors, setMonitors] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedMonitor, setSelectedMonitor] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [hostError, setHostError] = useState('')
  const [currentStats, setCurrentStats] = useState(INITIAL_STATS)

  const validateHost = (host) => {
    // IP adresi veya domain adı için regex
    const domainRegex =
      /^(https?:\/\/)(((?<Ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(?<Port>\d{2,4}))|((?<www>www)?\.?(?<Host>[a-zA-Z0-9]*)\.(?<Uzanti>[a-z]{3})\.?(?<Country>[a-z]{2})?))/gm

    if (!host) {
      return 'Host alanı zorunludur'
    } else if (!domainRegex.test(host)) {
      return 'Geçerli bir IP adresi veya domain adı giriniz'
    } else {
      return ''
    }
  }

  const validateInterval = (value) => {
    let unit = formData.intervalUnit
    value = Number(value)
    switch (unit) {
      case 'seconds':
        if (value > 59) {
          value = 59
        } else if (value < 20) {
          value = 20
        } else {
          value = value
        }
        break
      case 'minutes':
        if (value >= 60) {
          value = 59
        } else if (value < 1) {
          value = 1
        } else {
          value = value
        }
        break
      case 'hours':
        if (value >= 24) {
          value = 23
        } else if (value < 1) {
          value = 1
        } else {
          value = value
        }
        break
      default:
        break
    }
    return value;
  }

  const validateReportTime = (value) => {
    value = Number(value)
    let reportTimeUnit = formData.intervalUnit
    switch (reportTimeUnit) {
      case 'hours': {
        if (value > 23) {
          value = 23
        } else if (value < 1) {
          value = 1
        } else {
          value = value
        }
        break
      }
      case 'days': {
        if (value > 30) {
          value = 30
        } else if (value < 1) {
          value = 1
        } else {
          value = value
        }
        break
      }
      case 'weeks': {
        if (value > 3) {
          value = 3
        } else if (value < 1) {
          value = 1
        } else {
          value = value
        }
        break
      }
      case 'months': {
        if (value > 12) {
          value = 12
        } else if (value < 1) {
          value = 1
        } else {
          value = value
        }
        break
      }
    }
    return value;
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target

    if (name === 'interval') {
      value = validateInterval(value)
    }
    if (name === 'report_time') {
      value = validateReportTime(value)
    }
    if (name === 'host') {
      const error = validateHost(value)
      setHostError(error)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formattedData = {
        name: formData.name,
        method: formData.method,
        host: formData.host,
        body: formData.body
          ? typeof formData.body === 'string'
            ? JSON.parse(formData.body)
            : formData.body
          : {},
        headers: formData.headers
          ? typeof formData.headers === 'string'
            ? JSON.parse(formData.headers)
            : formData.headers
          : {},
        interval: formData.interval,
        intervalUnit: formData.intervalUnit,
        report_time: formData.report_time,
        reportTimeUnit: formData.reportTimeUnit,
        allowedStatusCodes:
          typeof formData.allowedStatusCodes === 'string'
            ? formData.allowedStatusCodes.split(',').map((code) => code.trim())
            : formData.allowedStatusCodes,
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}v1/monitor/`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${cookies.get('jwt-access')}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data) {
        setMonitors((prevMonitors) => [...prevMonitors, response.data])
        setModalOpen(false)
        setFormData(initialFormData)
        toast.success('Sunucu başarıyla eklendi!')
      }
    } catch (error) {
      console.error('Sunucu eklenirken hata oluştu:', error)
      toast.error(
        error.response?.data?.message || 'Sunucu eklenirken bir hata oluştu.'
      )
    }
  }

  const calculateStats = () => {
    const total = monitors.length
    const active = monitors.filter((m) => m.status === true).length
    const down = monitors.filter((m) => m.status === false).length
    const avgActive = (active / total) * 100
    return [
      { title: 'Toplam Sunucu', value: total.toString(), color: '#1976d2' },
      { title: 'Aktif Sunucu', value: active.toString(), color: '#2e7d32' },
      { title: 'Düşen Sunucu', value: down.toString(), color: '#d32f2f' },
      {
        title: 'Çalışan sunucuların yüzdesi',
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
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}v1/monitor/`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get('jwt-access')}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (response.data) {
          setMonitors(response.data)
        }
      } catch (error) {
        console.error('Monitör verileri alınırken hata oluştu:', error)
        toast.error('Monitör verileri alınırken bir hata oluştu.')
      }
    }

    const interval = setInterval(fetchMonitors, 20000)
    fetchMonitors()
    return () => clearInterval(interval)
  }, [])

  const handleMonitorAction = async (action, monitorId) => {
    try {
      const token = cookies.get('jwt-access')
      switch (action) {
        case 'start':
          await axios.put(
            `${process.env.REACT_APP_API_URL}v1/monitor/${monitorId}/play`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          setMonitors((prevMonitors) =>
            prevMonitors.map((m) =>
              m.id === monitorId
                ? { ...m, is_active_by_owner: true, status: null }
                : m
            )
          )
          toast.success('Sunucu başlatıldı')
          break

        case 'pause':
          await axios.put(
            `${process.env.REACT_APP_API_URL}v1/monitor/${monitorId}/pause`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          setMonitors((prevMonitors) =>
            prevMonitors.map((m) =>
              m.id === monitorId
                ? { ...m, is_active_by_owner: false, status: null }
                : m
            )
          )
          toast.success('Sunucu durduruldu')
          break

        case 'delete':
          if (
            window.confirm('Bu sunucuyu silmek istediğinizden emin misiniz?')
          ) {
            await axios.delete(
              `${process.env.REACT_APP_API_URL}v1/monitor/${monitorId}`,
              {
                headers: {
                  Authorization: `Bearer ${cookies.get('jwt-access')}`,
                  'Content-Type': 'application/json',
                },
              }
            )
            setMonitors((prevMonitors) =>
              prevMonitors.filter((m) => m.id !== monitorId)
            )
            toast.success('Sunucu silindi')
          }
          break

        default:
          console.error('Geçersiz işlem')
      }
    } catch (error) {
      console.error('İşlem sırasında bir hata oluştu:', error)
      toast.error(
        'İşlem sırasında bir hata oluştu: ' +
          (error.response?.data?.message || error.message)
      )
    }
  }

  const handleShowDetails = (monitor) => {
    setSelectedMonitor(monitor)
    setDetailsModalOpen(true)
  }

  const handleUpdateMonitor = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        name: selectedMonitor.name,
        method: selectedMonitor.method,
        host: selectedMonitor.host,
        body: selectedMonitor.body
          ? typeof selectedMonitor.body === 'string'
            ? JSON.parse(selectedMonitor.body)
            : selectedMonitor.body
          : {},
        headers: selectedMonitor.headers
          ? typeof selectedMonitor.headers === 'string'
            ? JSON.parse(selectedMonitor.headers)
            : selectedMonitor.headers
          : {},
        interval: selectedMonitor.interval,
        intervalUnit: selectedMonitor.intervalUnit,
        report_time: selectedMonitor.report_time,
        reportTimeUnit: selectedMonitor.reportTimeUnit,
        allowedStatusCodes:
          typeof selectedMonitor.allowedStatusCodes === 'string'
            ? selectedMonitor.allowedStatusCodes
                .split(',')
                .map((code) => code.trim())
            : selectedMonitor.allowedStatusCodes,
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}v1/monitor/${selectedMonitor.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${cookies.get('jwt-access')}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data) {
        setMonitors((prevMonitors) =>
          prevMonitors.map((monitor) =>
            monitor.id === selectedMonitor.id
              ? { ...response.data, logs: monitor.logs }
              : monitor
          )
        )
        setDetailsModalOpen(false)
        toast.success('Sunucu başarıyla güncellendi!')
      }
    } catch (error) {
      console.error('Sunucu güncellenirken hata oluştu:', error)
      toast.error(
        `Hata: ${
          error.response?.data?.message ||
          'Sunucu güncellenirken bir hata oluştu.'
        }`
      )
    }
  }

  const handleDetailInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'host') {
      const error = validateHost(value)
      setHostError(error)
    }

    setSelectedMonitor((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Sunucu adı',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'host',
      headerName: 'Host',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Durumu',
      width: 200,
      renderCell: (params) => {
        if (params.value === null) {
          return (
            <Chip
              icon={<HelpOutline />}
              label="Belirsiz"
              color="warning"
              size="small"
              sx={{ backgroundColor: '#9e9e9e', color: 'white' }}
            />
          )
        }

        return (
          <Chip
            icon={params.value ? <CheckCircleIcon /> : <WarningIcon />}
            label={params.value ? 'Ayakta' : 'Düştü'}
            color={params.value ? 'success' : 'error'}
            size="small"
          />
        )
      },
    },
    {
      field: 'logs',
      headerName: 'Başarı Durumu',
      width: 200,
      renderCell: (params) => {
        if (!params.value || params.value.length === 0) {
          return (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Veri yok
              </Typography>
            </Box>
          )
        }

        const totalRequests = params.value.length
        const successfulRequests = params.value.filter(
          (log) => !log.isError
        ).length
        const successRate = (successfulRequests / totalRequests) * 100
        const color =
          successRate >= 90
            ? 'success'
            : successRate >= 70
            ? 'warning'
            : 'error'

        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
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
              {`${successfulRequests}/${totalRequests} (${Math.round(
                successRate
              )}%)`}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'created_at',
      headerName: 'Oluşturulma Tarihi',
      width: 200,
      // eslint-disable-next-line no-unused-expressions
      valueFormatter: (params) => params.split('T')[0],
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {!params.row.is_active_by_owner && (
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
          {params.row.is_active_by_owner && (
            <Tooltip title="Durdur">
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleMonitorAction('pause', params.row.id)}
              >
                <PauseIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Sil">
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
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Edit />}
          onClick={() => handleShowDetails(params.row)}
        >
          ...
        </Button>
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <img
            src={'../../../rahatsistem-logo.png'}
            alt="Logo"
            width={50}
            height={50}
            style={{
              marginRight: '16px',
              backgroundColor: 'white',
              borderRadius: '5px',
            }}
          />
          <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
            Rahat Sistem Sunucu Kontrol Sayfası
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {currentStats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Sunucu Listesi</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                color="primary"
                onClick={() => setModalOpen(true)}
              >
                Yeni Sunucu Ekle
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <DataGrid
              rows={monitors}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              autoHeight
              disableRowSelectionOnClick
            />
          </Paper>
        </Container>
      </Box>

      <Modal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        aria-labelledby="details-modal-title"
      >
        <Box sx={modalStyle}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography
              id="details-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              Sunucu Düzenle
            </Typography>
          </Box>

          <Box sx={formContainerStyle}>
            {selectedMonitor && (
              <MonitorForm
                formData={selectedMonitor}
                handleInputChange={handleDetailInputChange}
                hostError={hostError}
                isEdit={true}
              />
            )}
          </Box>

          <Box sx={buttonContainerStyle}>
            <Button
              onClick={() => setDetailsModalOpen(false)}
              variant="outlined"
              color="inherit"
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleUpdateMonitor}
            >
              Güncelle
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="add-modal-title"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: '#f8f9fa',
            }}
          >
            <Typography
              id="add-modal-title"
              variant="h5"
              component="h2"
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Yeni Sunucu Ekle
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sunucunuzu izlemeye başlamak için aşağıdaki formu doldurun
            </Typography>
          </Box>

          <Box sx={formContainerStyle}>
            <MonitorForm
              formData={formData}
              handleInputChange={handleInputChange}
              hostError={hostError}
            />
          </Box>

          <Box sx={buttonContainerStyle}>
            <Button
              onClick={() => setModalOpen(false)}
              variant="outlined"
              color="inherit"
              size="large"
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
              startIcon={<AddIcon />}
            >
              Sunucuyu Ekle
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
