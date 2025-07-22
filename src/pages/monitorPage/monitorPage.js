import { useState, useEffect } from 'react'
import alertify from 'alertifyjs'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'
import MenuButton from '../../components/menuButton/index.js'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
  Typography,
  IconButton,
  Box,
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
  Checkbox,
} from '@mui/material'
import {
  Add as AddIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Visibility,
  AttractionsOutlined,
  FilterList,
  RestartAlt,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'

import { INITIAL_STATS } from './constants/monitorConstants'

import { useNavigate } from 'react-router-dom'
import MonitorStatus from '../../components/Animate/monitorStatus.js'
import localStorage from 'local-storage'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

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

function FiltredMenu({ filtreOptions, setFiltereOptions }) {
  const [up, setUp] = useState(false)
  const [down, setDown] = useState(false)
  const [uncertain, setUnsertain] = useState(false)
  const [maintanance, setMaintanance] = useState(false)
  const [paused, setPaused] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  useEffect(() => {
    let tempArray = [...filtreOptions]
    if (up) {
      tempArray.push('up')
    } else {
      tempArray = tempArray.filter((item) => item !== 'up')
    }
    setFiltereOptions(tempArray)
  }, [up])

  const handleUpChange = () => {
    setUp(!up)
  }

  useEffect(() => {
    let tempArray = [...filtreOptions]
    if (down) {
      tempArray.push('down')
    } else {
      tempArray = tempArray.filter((item) => item !== 'down')
    }
    setFiltereOptions(tempArray)
  }, [down])

  const handleDownChange = () => {
    setDown(!down)
  }

  useEffect(() => {
    let tempArray = [...filtreOptions]
    if (uncertain) {
      tempArray.push('uncertain')
    } else {
      tempArray = tempArray.filter((item) => item !== 'uncertain')
    }
    setFiltereOptions(tempArray)
  }, [uncertain])

  const handleUncertainChange = () => {
    setUnsertain(!uncertain)
  }

  useEffect(() => {
    let tempArray = [...filtreOptions]
    if (maintanance) {
      tempArray.push('maintanance')
    } else {
      tempArray = tempArray.filter((item) => item !== 'maintanance')
    }
    setFiltereOptions(tempArray)
  }, [maintanance])

  const handleMaintananceChange = () => {
    setMaintanance(!maintanance)
  }

  useEffect(() => {
    let tempArray = [...filtreOptions]
    if (paused) {
      tempArray.push('uncertain')
    } else {
      tempArray = tempArray.filter((item) => item !== 'uncertain')
    }
    setFiltereOptions(tempArray)
  }, [paused])

  const handlePausedChange = () => {
    setPaused(!paused)
  }

  return (
    <div>
      <Button
        id="demo-filtred-button"
        aria-controls={open ? 'demo-filtred-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<FilterList fontSize="small" />}
        sx={{
          width: '7rem',
          height: '1.8rem',
          border: 'solid 0.1px gray',
          color: 'black',
          fontSize: '0.8rem',
          borderRadius: '7%',
          paddingBottom: 1,
        }}
      >
        Filtrele
      </Button>
      <Menu
        id="demo-filtred-menu"
        aria-labelledby="demo-filtred-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          width: '50rem',
          marginTop: 4,
          padding: 0,
          '& .MuiTypography-root': { fontSize: '0.8rem' },
        }}
      >
        <MenuItem
          sx={{
            borderBottom: 'solid 0.1px gray',
            height: '1.8rem',
            padding: 0,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox checked={up} onChange={handleUpChange} size="small" />
            }
            label="Çalışan"
            sx={{ marginLeft: 0.5 }}
          />
        </MenuItem>

        <MenuItem
          sx={{
            borderBottom: 'solid 0.1px gray',
            height: '1.8rem',
            padding: 0,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={down}
                onChange={handleDownChange}
                size="small"
              />
            }
            label="Çalışmayan"
            sx={{ marginLeft: 0.5 }}
          />
        </MenuItem>

        <MenuItem
          sx={{
            borderBottom: 'solid 0.1px gray',
            height: '1.8rem',
            padding: 0,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={uncertain}
                onChange={handleUncertainChange}
                size="small"
              />
            }
            label="Belirsiz"
            sx={{ marginLeft: 0.5 }}
          />
        </MenuItem>

        <MenuItem
          sx={{
            borderBottom: 'solid 0.1px gray',
            height: '1.8rem',
            padding: 0,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={paused}
                onChange={handlePausedChange}
                size="small"
              />
            }
            label="Durdurlan"
            sx={{ marginLeft: 0.5 }}
          />
        </MenuItem>

        <MenuItem
          sx={{
            borderBottom: 'solid 0.1px gray',
            height: '1.8rem',
            padding: 0,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={maintanance}
                onChange={handleMaintananceChange}
                size="small"
              />
            }
            label="Bakım"
            sx={{ marginLeft: 0.5 }}
          />
        </MenuItem>

        <MenuItem
          sx={{
            alignContent: 'center',
            justifyContent: 'center',
            height: '1.8rem',
            paddingTop: 1,
          }}
        >
          <Button
            onClick={() => {
              setUp(false)
              setDown(false)
              setUnsertain(false)
              setMaintanance(false)
              setPaused(false)
              setFiltereOptions([])
            }}
            startIcon={<RestartAlt />}
          >
            Sıfırla
          </Button>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [monitors, setMonitors] = useState([])
  const [filteredMonitors, setFilteredMonitors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [allSelected, setAllSelected] = useState(false)
  const [selectMonitors, setSelectMonitors] = useState([])
  const [filtreOptions, setFiltereOptions] = useState([])
  const [currentStats, setCurrentStats] = useState(INITIAL_STATS)
  const theme = useTheme()
  const navigate = useNavigate()

  function PositionedMenu({ selectMonitors, setSelectMonitors }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    const handleMultipleDeleteMonitors = async () => {
      Swal.fire({
        title: 'Silmek istediğinizden emin misiniz',
        icon: 'warning',
        text: 'İzlemeler sistemden tamamen silinecektir',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Evet silmek istiyorum',
        cancelButtonText: 'Hayır',
      })
        .then(async (result) => {
          if (result.isConfirmed) {
            await api.delete(`monitors/multiple-delete`, {
              data: { ids: selectMonitors },
            })
            Swal.fire({
              icon: 'success',
              title: 'İzlemeler Silindi',
              text: 'İzlemeler başarılı şekilde silindi',
              confirmButtonText: 'Tamam',
            })
            setMonitors((prevMonitors) =>
              prevMonitors.filter((m) => !selectMonitors.includes(m.id))
            )
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

    const handleMultiPlayMonitors = async () => {
      try {
        const response = await api.put(`/monitors/multi-play`, {
          ids: selectMonitors,
        })
        Swal.fire({
          icon: 'success',
          title: 'İzlemeler Çalıştırıldı',
          text: 'İzlemeler başarıyla başlatıldı.',
          confirmButtonText: 'Tamam',
        })
        setMonitors((prevMonitors) =>
          prevMonitors.map((m) =>
            selectMonitors.includes(m.id)
              ? { ...m, isActiveByOwner: true, status: 'uncertain' }
              : m
          )
        )
      } catch (error) {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'İzlemeler çalıştırılamadı. Lütfen tekrar deneyin.',
          confirmButtonText: 'Tamam',
        })
      }
    }

    const handleMultiPauseMonitors = async () => {
      try {
        const response = await api.put(`/monitors/multi-pause`, {
          ids: selectMonitors,
        })
        Swal.fire({
          icon: 'success',
          title: 'İzlemeler Durduruldu',
          text: 'İzlemeler başarıyla durduruldu.',
          confirmButtonText: 'Tamam',
        })
        setMonitors((prevMonitors) =>
          prevMonitors.map((m) =>
            selectMonitors.includes(m.id)
              ? { ...m, isActiveByOwner: false, status: 'uncertain' }
              : m
          )
        )
      } catch (error) {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'İzlemeler durdurlamadı. Lütfen tekrar deneyin.',
          confirmButtonText: 'Tamam',
        })
      }
    }
    return (
      <div>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={<AttractionsOutlined fontSize="small" />}
          disabled={selectMonitors.length > 0 ? false : true}
          sx={{
            width: '7rem',
            height: '1.8rem',
            border: 'solid 0.1px gray',
            color: 'black',
            fontSize: '0.8rem',
            borderRadius: '7%',
            paddingBottom: 1,
          }}
        >
          İşlemler
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            width: '50rem',
            marginTop: 4,
            padding: 0,
            '& .MuiTypography-root': { fontSize: '0.8rem' },
          }}
        >
          <MenuItem
            onClickCapture={handleMultiPauseMonitors}
            sx={{
              borderBottom: 'solid 0.1px gray',
              height: '1.8rem',
            }}
            onClick={handleClose}
          >
            <ListItemIcon>
              <PauseIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              sx={{ '& .MuiTypography-root': { color: 'secondary' } }}
            >
              Durdur
            </ListItemText>
          </MenuItem>

          <MenuItem
            onClickCapture={handleMultiPlayMonitors}
            sx={{
              height: '1.8rem',
              fontSize: '0.8rem',
              borderBottom: 'solid 0.1px gray',
            }}
            onClick={handleClose}
          >
            <ListItemIcon>
              <PlayArrowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              sx={{ '& .MuiTypography-root': { color: 'primary' } }}
            >
              Çalıştır
            </ListItemText>
          </MenuItem>

          <MenuItem
            onClickCapture={handleMultipleDeleteMonitors}
            sx={{
              height: '1.8rem',
              fontSize: '0.8rem',
            }}
            onClick={handleClose}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={{ '& .MuiTypography-root': { color: 'error' } }}>
              Sil
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>
    )
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
      { title: 'Belirsiz', value: uncertain.toString(), color: '#ed6c02' },
      {
        title: 'Çalışan Yüzdesi',
        value: avgActive ? avgActive.toString().substring(0, 5) + '%' : '0%',
        color: '#1976d2',
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

  const handleSelectMonitors = (id) => {
    let tempMonitors = [...selectMonitors]
    if (!tempMonitors.includes(id)) {
      tempMonitors.push(id)
      setAllSelected(tempMonitors.length === filteredMonitors.length)
    } else {
      tempMonitors = tempMonitors.filter((item) => id !== item)
      setAllSelected(tempMonitors.length > 0)
    }
    setSelectMonitors(tempMonitors)
  }

  useEffect(() => {
    if (!monitors || monitors.length === 0) {
      setFilteredMonitors([])
      return
    }

    const searchLower = searchQuery.toLowerCase().trim()

    if (searchLower === '') {
      if (filtreOptions.length > 0) {
        let tempFilter = monitors.filter((monitor) => {
          return filtreOptions.includes(monitor.status)
        })
        setFilteredMonitors(tempFilter)
      } else {
        setFilteredMonitors(monitors)
      }
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
    if (filtreOptions.length > 0) {
      let tempFilter = filtered.filter((monitor) => {
        return filtreOptions.includes(monitor.status)
      })
      setFilteredMonitors(tempFilter)
    } else {
      setFilteredMonitors(filtered)
    }
  }, [searchQuery, monitors, filtreOptions])

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectMonitors([])
      setAllSelected(false)
    } else {
      const allIds = filteredMonitors.map((row) => row.id)
      setSelectMonitors(allIds)
      setAllSelected(true)
    }
  }

  const columns = [
    {
      field: 'select',
      headerName: '',
      disableColumnMenu: true,
      sortable: false,
      flex: 0.5,
      renderHeader: () => (
        <Checkbox
          size="small"
          checked={allSelected}
          indeterminate={
            selectMonitors.length > 0 &&
            selectMonitors.length < filteredMonitors.length
          }
          onChange={handleSelectAll}
        />
      ),
      renderCell: (params) => {
        return (
          <Checkbox
            size="small"
            checked={selectMonitors.includes(params.id)}
            onChange={() => handleSelectMonitors(params.id)}
          />
        )
      },
    },
    {
      field: 'status',
      headerName: '',
      disableColumnMenu: true,
      sortable: false,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <MonitorStatus
            sx={{ width: 12, height: 12, animeWidth: 12, animeHeight: 12 }}
            status={params.value}
            iconSize={10}
          />
        )
      },
    },
    {
      field: 'name',
      headerName: 'Adı',
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, margin: '5' }}>
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
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
      disableColumnMenu: true,
      sortable: false,
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
      disableColumnMenu: true,
      sortable: false,
      headerName: 'Başarı Oranı',
      flex: 2,
      renderCell: (params) => {
        let logs = params.row.logs.sort(function (a, b) {
          return a.id - b.id
        })
        logs = logs.slice(-25) || []
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
    // {
    //   field: 'succesRate',
    //   headerName: '',
    //   flex: 0.5,
    //   renderCell: (params) => {
    //     const logsRate = params.row.logs || []
    //     const total = logsRate.length
    //     const successCount = logsRate.filter(
    //       (log) => log.status === 'up'
    //     ).length
    //     const errorCount = logsRate.filter(
    //       (log) => log.status === 'down' || log.isError
    //     ).length
    //     const lastLog = logsRate[logsRate.length - 1]
    //     const rate = total > 0 ? Math.round((successCount / total) * 100) : 0
    //     return (
    //       <Tooltip
    //         title={
    //           <Box>
    //             <Typography fontWeight={600} fontSize={15} mb={1}>
    //               Log Detayları
    //             </Typography>
    //             <Typography fontSize={13}>Toplam Log: {total}</Typography>
    //             <Typography fontSize={13}>Başarılı: {successCount}</Typography>
    //             <Typography fontSize={13}>Hatalı: {errorCount}</Typography>
    //             {lastLog && (
    //               <Box mt={1}>
    //                 <Typography fontSize={13} fontWeight={600}>
    //                   Son Log
    //                 </Typography>
    //                 <Typography fontSize={12}>
    //                   Durum:{' '}
    //                   {lastLog.status === 'up'
    //                     ? 'Başarılı'
    //                     : lastLog.status === 'down'
    //                     ? 'Başarısız'
    //                     : 'Belirsiz'}
    //                 </Typography>
    //                 <Typography fontSize={12}>
    //                   Yanıt Süresi: {lastLog?.responseTime} ms
    //                 </Typography>
    //                 <Typography fontSize={12}>
    //                   Tarih: {String(lastLog?.createdAt).split('T')[0] || ''}
    //                 </Typography>
    //                 <Typography fontSize={12}>
    //                   Saat:{' '}
    //                   {String(lastLog?.createdAt).split('T')[1].split('.')[0] ||
    //                     ''}
    //                 </Typography>
    //               </Box>
    //             )}
    //           </Box>
    //         }
    //         arrow
    //         placement="top"
    //       >
    //         <Box sx={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}>
    //           <Typography
    //             variant="caption"
    //             color={
    //               rate >= 80
    //                 ? 'success.main'
    //                 : rate >= 50
    //                 ? 'warning.main'
    //                 : 'error.main'
    //             }
    //             fontWeight={600}
    //             fontSize={{ xs: '0.5rem', sm: '0.8rem' }}
    //           >
    //             %{rate}
    //           </Typography>
    //         </Box>
    //       </Tooltip>
    //     )
    //   },
    // },
    {
      field: 'edit',
      headerName: 'İşlemler',
      disableColumnMenu: true,
      sortable: false,
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
    <Grid container>
      <Grid
        item
        xs={11.5}
        md={12}
        sx={{  backgroundColor: '#f8f9fa', width: '100%' }}
      >
  
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              mt:2,
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
                    borderRadius: '6%',
                    backgroundColor: '#ffff',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                      height: '100%',
                      gap: 2,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      component="div"
                      sx={{
                        lineHeight: '100%',
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
                        lineHeight: '100%',
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
                    borderRadius: '6%',
                    backgroundColor: '#ffff',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                      height: '100%',
                      gap: 2,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      component="div"
                      sx={{
                        lineHeight: '100%',
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
                        lineHeight: '100%',
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
                    borderRadius: '6%',
                    backgroundColor: '#ffff',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                      height: '100%',
                      gap: 2,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      // component="div"
                      sx={{
                        lineHeight: '100%',
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
                        lineHeight: '100%',
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
                    borderRadius: '6%',
                    backgroundColor: '#ffff',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                      height: '100%',
                      gap: 2,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      // component="div"
                      sx={{
                        lineHeight: '100%',
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
                        lineHeight: '100%',
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
                    borderRadius: '6%',
                    backgroundColor: '#ffff',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      component="div"
                      sx={{
                        lineHeight: '100%',
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
                        lineHeight: '100%',
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

              <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
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

                <PositionedMenu
                  selectMonitors={selectMonitors}
                  setSelectMonitors={setSelectMonitors}
                />
                <FiltredMenu
                  filtreOptions={filtreOptions}
                  setFiltereOptions={setFiltereOptions}
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
                  columnMenuSortAsc: 'Artan sırada sırala',
                  columnMenuSortDesc: 'Azalan sırada sırala',
                  columnMenuUnsort: 'Sıralamayı kaldır',
                  columnMenuHideColumn: 'Sütunu gizle',
                  columnMenuFilter: 'none',
                  columnMenuManageColumns: 'Sütunları yönet',
                  columnsManagementSearchTitle: 'Ara',
                  columnsManagementShowHideAllText: 'Göster/Hepsini Gizle',
                  columnsManagementReset: 'Yinele',
                  sortAscending: 'Artan sırala',
                  sortDescending: 'Azalan sırala',
                  noRowsLabel: 'Veri bulunamadı',

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
                disableColumnFilter
              />
            </Paper>
          </Box>
      
      </Grid>
    </Grid>
  )
}
