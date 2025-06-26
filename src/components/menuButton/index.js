import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import Divider from '@mui/material/Divider'
import ArchiveIcon from '@mui/icons-material/Archive'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Swal from 'sweetalert2'
import InfoIcon from '@mui/icons-material/Info'
import api from '../../api/auth/axiosInstance'
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
import { useNavigate } from 'react-router-dom'
import { margin } from '@mui/system'
import { IconButton } from '@mui/material'
import MonitorDetail from '../../pages/monitorPage/monitorDetail'

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}))

export default function CustomizedMenus({ monitor, monitors, setMonitors }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEditDetails = (monitor) => {
    switch (monitor.monitorType) {
      case 'HttpMonitor':
        navigate(`/user/monitors/${monitor.id}/http`)
        handleClose()
        break
      case 'PingMonitor':
        navigate(`/user/monitors/${monitor.id}/ping`)
        handleClose()
        break
      case 'CronJobMonitor':
        navigate(`/user/monitors/${monitor.id}/cronjob`)
        handleClose()
        break
      case 'PortMonitor':
        navigate(`/user/monitors/${monitor.id}/port`)
        handleClose()
        break
      case 'KeywordMonitor':
        navigate(`/user/monitors/${monitor.id}/keyword`)
        handleClose()
        break
      default:
        console.error('Unknow monitor type ! :', monitor.monitorType)
        handleClose()
        break
    }
  }

  const handleTestButton = async (page) => {
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
              `monitors/instant-Control/${page.id}`
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
              <td style="padding: 6px;">${result.timestamp}</td>
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

      handleClose()
    } catch (error) {
      console.error('İstek hatası:', error)
      handleClose()
    } finally {
      handleClose()
    }
  }

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
          setMonitors((prevMonitors) =>
                  prevMonitors.filter((m) => m.id !== monitor.id)
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

  const handleWorkMonitorMenu = async (monitor) => {
    if (monitor.isActiveByOwner) {
      try {
        const response = await api.put(`monitors/${monitor.id}/pause`, {})
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'İzleme Durduruldu',
          text: 'İzleme başarıyla durduruldu.',
          confirmButtonText: 'Tamam',
        })
        setMonitors((prevMonitors) =>
            prevMonitors.map((m) =>
              m.id === monitor.id
                ? { ...m, isActiveByOwner: false, status: 'uncertain' }
                : m
            )
          )
      } catch (error) {
        console.error('Sunucu durdurulurken hata oluştu:', error)
        handleClose();
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'İzleme durdurulamadı. Lütfen tekrar deneyin.',
          confirmButtonText: 'Tamam',
        })
      }
    } else {
      try {
        const res = await api.put(`monitors/${monitor.id}/play`, {})
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'İzleme Çalıştırıldı',
          text: 'İzleme başarıyla başlatıldı.',
          confirmButtonText: 'Tamam',
        })
        setMonitors((prevMonitors) =>
            prevMonitors.map((m) =>
              m.id === monitor.id
                ? { ...m, isActiveByOwner: true, status: 'uncertain' }
                : m
            )
          )
      } catch (error) {
        console.error('Sunucu çalıştırılırken hata oluştu:', error)
        handleClose();
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'İzleme çalıştırılamadı. Lütfen tekrar deneyin.',
          confirmButtonText: 'Tamam',
        })
        
      }
  
    }
  }

  const handlDetailMenu = (monitor) => {
    console.log(monitor)
  }

  return (
    <div style={{'margin-top': '5px', 'margin-left': '15px'}}>
      <IconButton
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <MoreHorizIcon />
      </IconButton>
      <StyledMenu
        /*sx={{
          ml: '10%',
          mb: '5%',
          mt: '0%',
        }}*/
        id="demo-customized-menu"
        slotProps={{
          list: {
            'aria-labelledby': 'demo-customized-button',
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleEditDetails(monitor)} disableRipple>
          <EditIcon />
          Düzenle
        </MenuItem>
        <MenuItem onClick={()=>handlDetailMenu(monitor)} disableRipple>
          <InfoIcon />
          Detayı
        </MenuItem>
        {/*<Divider sx={{ my: 0.5 }} />*/}
        <MenuItem onClick={() => handleTestButton(monitor)} disableRipple>
          <ArchiveIcon />
          Test et
        </MenuItem>
        <MenuItem onClick={() => handleWorkMonitorMenu(monitor)} disableRipple>
          {monitor.isActiveByOwner ? <PauseIcon /> : <PlayArrowIcon />}
          {monitor.isActiveByOwner ? 'Durdur' : 'Çalıştır'}
        </MenuItem>
        <MenuItem onClick={() => handlDeleteMenu(monitor)} disableRipple>
          <DeleteIcon />
          Kaldır
        </MenuItem>
      </StyledMenu>
    </div>
  )
}
