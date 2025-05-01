import { useState, useEffect } from 'react'
import alertify from 'alertifyjs'
import api from '../../api/auth/axiosInstance'
import { cookies } from '../../utils/cookie'
import BuildIcon from '@mui/icons-material/Build';
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
  Modal,
  Stack,
} from '@mui/material'
import {
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { Edit } from 'tabler-icons-react'
import MonitorForm from './MonitorForm'
import {
  modalStyle,
  formContainerStyle,
  buttonContainerStyle,
} from '../../styles/monitorStyles'
import { INITIAL_STATS } from './constants/monitorConstants'
import Sidebar from '../../components/sideBar/sideBar'
import * as Yup from 'yup'
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
  const [modalOpen, setModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedMonitor, setSelectedMonitor] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [currentStats, setCurrentStats] = useState(INITIAL_STATS)

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
        reportTime: formData.reportTime,
        reportTimeUnit: formData.reportTimeUnit,
        allowedStatusCodes:
          typeof formData.allowedStatusCodes === 'string'
            ? formData.allowedStatusCodes.split(',').map((code) => code.trim())
            : formData.allowedStatusCodes,
      }
      const response = await api.post(`monitor/`, formattedData, {
        headers: {
          Authorization: `Bearer ${cookies.get('jwt-access')}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('Response:', response.data)
      if (response.data) {
        setMonitors((prevMonitors) => [...prevMonitors, response.data])
        setModalOpen(false)
        setFormData(initialFormData)
        alertify.success(`${response.data.host} başarılı şekilde eklendi !`)
      }
    } catch (error) {
      alertify.error(error.response.data.message)
      console.error('Sunucu eklenirken hata oluştu:', error)
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
        const response = await api.get(`monitor/`)
        if (response.data) {
          setMonitors(response.data)
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

  const handleMonitorAction = async (action, monitorId) => {
    try {
      const token = cookies.get('jwt-access')
      switch (action) {
        case 'start':
          const res = await api.put(`monitor/${monitorId}/play`, {})
          setMonitors((prevMonitors) =>
            prevMonitors.map((m) =>
              m.id === monitorId
                ? { ...m, isActiveByOwner: true, status: "uncertain" }
                : m
            )
          )
          alertify.success(`${res.data.host} sunucu başlatıldı`)
          break

        case 'pause':
          const response = await api.put(`monitor/${monitorId}/pause`, {})
          setMonitors((prevMonitors) =>
            prevMonitors.map((m) =>
              m.id === monitorId
                ? { ...m, is_active_by_owner: false, status: "uncertain" }
                : m
            )
          )
          alertify.warning(`${response.data.host} sunucu durduruldu`)
          break

        case 'delete':
          if (
            window.confirm('Bu sunucuyu silmek istediğinizden emin misiniz?')
          ) {
            const response = await api.delete(`monitor/${monitorId}`)
            setMonitors((prevMonitors) =>
              prevMonitors.filter((m) => m.id !== monitorId)
            )
            alertify.success(`${response.data.host} sunucu başarılı silindi`)
          }
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
        reportTime: selectedMonitor.reportTime,
        reportTimeUnit: selectedMonitor.reportTimeUnit,
        allowedStatusCodes:
          typeof selectedMonitor.allowedStatusCodes === 'string'
            ? selectedMonitor.allowedStatusCodes
                .split(',')
                .map((code) => code.trim())
            : selectedMonitor.allowedStatusCodes,
      }
      const response = await api.put(
        `monitor/${selectedMonitor.id}`,
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
        alertify.success(` sunucu başarıyla güncellendi!`)
      }
    } catch (error) {
      console.error('Sunucu güncellenirken hata oluştu:', error)
      alertify.error(
        `Hata: ${
          error.response?.data?.message ||
          'Sunucu güncellenirken bir hata oluştu.'
        }`
      )
    }
  }

  const handleDetailInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target

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
        if (params.value === "uncertain") {
          return (
            <Chip
              icon={<HelpOutline />}
              label="Uncertain"
              color="warning"
              size="medium"
              sx={{
                fontWeight: 'bold',
                '& .MuiChip-label': {
                  fontSize: '1rem', // örnek: 16px
                  fontWeight: 'bold',
                }
              }}
            />
          )
        }
        if (params.value === "maintanance") {
          return (
            <Chip
              icon={<BuildIcon />}
              label="Maintenance"
              color="info"
              size="medium"
              sx={{
                fontWeight: 'bold',
                '& .MuiChip-label': {
                  fontSize: '1rem', // örnek: 16px
                  fontWeight: 'bold',
                  fontColor: 'black',
                }
              }}
            />
          )
        }
        if (params.value === "down") {
          return (
            <Chip
              icon={ <WarningIcon />}
              label={'Down'}
              color={'error'}
              size="medium"
              sx={{
                fontWeight: 'bold',
                '& .MuiChip-label': {
                  fontSize: '1rem', // örnek: 16px
                  fontWeight: 'bold',
                }
              }}
            />
          )
        }
        if (params.value === "up") {
          return (
            <Chip
              icon={<CheckCircleIcon />}
              label={'Up'}
              color={'success'}
              size="medium"
              sx={{
                fontWeight: 'bold',
                '& .MuiChip-label': {
                  fontSize: '1rem', // örnek: 16px
                  fontWeight: 'bold',
                }
              }}
            />
          )
        }
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
      field: 'createdAt',
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
      <Grid item md={isOpen ? 2.3 : 0.7}>
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Grid>
      <Grid
        item
        md={isOpen ? 9.7 : 11.3}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          pr: '4vh',
          gap: 1,
        }}
      >
      </Grid>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Monitoring Page.
            <hr />
        </Typography>
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
        onClose={() => {
          setDetailsModalOpen(false)
          setSelectedMonitor(selectedMonitor)
        }}
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
                handleInputChange={handleUpdateInputChange}
                isEdit={true}
              />
            )}
          </Box>

          <Box sx={buttonContainerStyle}>
            <Button
              onClick={() => {
                setDetailsModalOpen(false)
                setSelectedMonitor(selectedMonitor)
              }}
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
        onClose={() => {
          setFormData(initialFormData)
          setModalOpen(false)
        }}
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
              handleInputChange={handleDetailInputChange}
            />
          </Box>

          <Box sx={buttonContainerStyle}>
            <Button
              onClick={() => {
                setModalOpen(false)
                setFormData(initialFormData)
              }}
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
