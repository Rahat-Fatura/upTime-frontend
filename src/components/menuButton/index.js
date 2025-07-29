import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import NotificationsPaused from '@mui/icons-material/NotificationsPaused'
import Divider from '@mui/material/Divider'
import ArchiveIcon from '@mui/icons-material/Archive'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Swal from 'sweetalert2'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import InfoIcon from '@mui/icons-material/Info'
import api from '../../api/auth/axiosInstance'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { cookies } from '../../utils/cookie'
import { jwtDecode } from 'jwt-decode'
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
  Build,
  Visibility,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { fontSize, margin, maxHeight } from '@mui/system'
import { Alert, IconButton } from '@mui/material'
import MonitorDetail from '../../pages/monitorPage/monitorDetail'
import { pink } from '@mui/material/colors'
import {
  DateCalendar,
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'

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
    minWidth: 120,            // En az bu kadar genişlik
    maxHeight: 188,
    transform: 'translateY(-5px)',
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      minWidth: 120,
      maxWidth: 120,
      minHeight:30,
      maxHeight:30,
      '& .MuiSvgIcon-root': {
        fontSize: 15,
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
  const [openDialog, setOpenDialog] = React.useState(false)
  const [startDate, setStartDate] = React.useState(dayjs())
  const [endDate, setEndDate] = React.useState(dayjs())
  const [startTime, setStarTime] = React.useState(dayjs())
  const [endTime, setEndTime] = React.useState(dayjs())
  const [role, setRole] = React.useState('user')
  const [params] = React.useState(useParams())
  const handleClickOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEditDetails = (monitor) => {
    
    let token = cookies.get('jwt-access')
    let role = jwtDecode(token).role
    if (role === 'admin') {
          navigate(`/admin/userMonitors/${params.userId}/${monitor.id}/monitor`)
        }
    else{
          navigate(`/user/monitors/${monitor.id}/monitor`)
        }
    handleClose()
  }


  const handleDetailButton = async (page) => {
    let token = cookies.get('jwt-access')
    let role = jwtDecode(token).role
    if (role === 'admin') {
     navigate(`/admin/monitors/${page.id}/detail`)
    }
    else{
      navigate(`/user/monitors/${page.id}/detail`)
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
        handleClose()
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
        handleClose()
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
        handleClose()
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
        handleClose()
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'İzleme çalıştırılamadı. Lütfen tekrar deneyin.',
          confirmButtonText: 'Tamam',
        })
      }
    }
  }

  const handleMaintanceMenu = () => {
    handleClickOpenDialog()
    handleClose()
  }

   const handleMaintanance = async() => {
      const startDateTime = startDate.toDate()
      startDateTime.setSeconds(0)
      startDateTime.setMilliseconds(0)
      const startTimeValue = startTime.toDate();
      startDateTime.setHours(startTimeValue.getHours())
      startDateTime.setMinutes(startTimeValue.getMinutes())
      const endDateTime = endDate.toDate()
      endDateTime.setSeconds(0)
      endDateTime.setMilliseconds(0)
      const endTimeValue = endTime.toDate();
      endDateTime.setHours(endTimeValue.getHours())
      endDateTime.setMinutes(endTimeValue.getMinutes())
      const now = new Date()

      console.log("BAşlangıç Tarih", startDateTime)
      console.log("Bitiş Tarih", endDateTime)
      if (!startDateTime || !endDateTime) {
        handleCloseDialog();
        Swal.fire({
          title: 'Warning',
          text: 'Lütfen tüm tarih ve saat bilgilerini giriniz',
          icon: 'warning',
        })
        return
      }
  
      if (endDateTime < now) {
        handleCloseDialog();
        Swal.fire({
          title: 'Hata',
          text: 'Bitiş tarihi geçmişte olamaz',
          icon: 'warning',
        })
    
        return
      }
  
      if (startDateTime >= endDateTime) {
        handleCloseDialog();
        Swal.fire({
          title: 'Hata',
          text: 'Başlangıç tarihi geçmiş tarihten ön tarihte olamaz',
          icon: 'warning',
        })
        
        return
      }
  
      try {
        const response = await api.post(`monitors/maintanance/${monitor.id}`, {
          startTime: startDateTime,
          endTime: endDateTime,
        })
        setMonitors((prevMonitors) =>
          prevMonitors.map((m) =>
            m.id === monitor.id
              ? { ...m, maintanance: Object.assign(m.maintanance||{startTime:startDateTime,endTime: endDateTime},{status: true})}
              : m
          )
        )
        handleCloseDialog();
        Swal.fire({
          title: 'Success',
          text: 'Bakım planı başarıyla kaydedildi',
          icon: 'success',
        })
        
      } catch (error) {
        handleCloseDialog();
        Swal.fire({
          title: 'Hata',
          text: 'Bakım planı kaydedilirken bir hata oluştu',
          icon: 'error',
        })
      }
    }

    const handleCancelMaintenance = async () => {
        try {
          const response = await api.put(`monitors/maintanance/${monitor.id}`)
          setMonitors((prevMonitors) =>
          prevMonitors.map((m) =>
            m.id === monitor.id
              ? { ...m, maintanance: Object.assign(m.maintanance,{status: false}), status: 'uncertain' }
              : m
          )
        )
          Swal.fire({
            title: 'Başarılı',
            text: 'Bakım modu başarıyla iptal edildi.',
            icon: 'success',
          })
          handleCloseDialog();
        } catch (error) {
          Swal.fire({
            title: 'Hata',
            text: 'Bakım modu ipat edilirken bir hata oluştu',
            icon: 'error',
          })
          handleCloseDialog();
        }
      }

  return (
    <div style={{ 'margin-top': '0px', 'margin-left': '15px' }}>
      <IconButton
        size="small"
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
        <MenuItem
          sx={{
            fontSize: 12,
            weight: 'auto',
            color: '#f8833e',
          }}
          onClick={() => handleEditDetails(monitor)}
          disableRipple
        >
          <EditIcon color="primary" />
          Düzenle
        </MenuItem>
        <MenuItem
          sx={{
            fontSize: 12,
            weight: 'auto',
            color: '#413ef8f3',
          }}
          onClick={() => handleMaintanceMenu()}
          disableRipple
        >
          <Build />
          Bakım
        </MenuItem>
        {/*<Divider sx={{ my: 0.5 }} />*/}
        <MenuItem
          sx={{
            fontSize: 12,
            weight: 'auto',
          }}
          onClick={() => handleTestButton(monitor)}
          disableRipple
        >
          <NotificationsPaused fontSize="small" color="#ffff" />
          Test et
        </MenuItem>
        <MenuItem
          sx={{
            fontSize: 12,
            weight: 'auto',
            color: '#413ef8f3',
          }}
          onClick={() => handleDetailButton(monitor)}
          disableRipple
        >
          <Visibility fontSize="small" color="#ffff" />
          Detay
        </MenuItem>
        <MenuItem
          sx={{
            fontSize: 12,
            weight: 'auto',
            color: '#f533bb',
          }}
          onClick={() => handleWorkMonitorMenu(monitor)}
          disableRipple
        >
          {monitor.isActiveByOwner ? <PauseIcon /> : <PlayArrowIcon />}
          {monitor.isActiveByOwner ? 'Durdur' : 'Çalıştır'}
        </MenuItem>
        <MenuItem
          sx={{
            fontSize: 12,
            weight: 'auto',
            color: '#fc0a0a',
          }}
          onClick={() => handlDeleteMenu(monitor)}
          disableRipple
        >
          <DeleteIcon />
          Kaldır
        </MenuItem>
      </StyledMenu>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle fontSize={'1rem'}>{monitor.maintanance?.status?
        `"${monitor.name.substring(
          0,
          50
        )}" Monitörü Bakım Durumundan Çıkart`:
        `"${monitor.name.substring(
          0,
          50
        )}" Monitörü Bakım Durumuna Geçir`}</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText sx={{ marginBottom: 2 }}>
            <Alert severity={monitor.maintanance?.status?"warning":"info"}>{monitor.maintanance?.status?
            `Bakım Modu, aktif halde gözükyor isterseniz iptal edip yeniden kurabilirsiniz.`:`
              Bakım Modu, belirlediğiniz süre aralığında bu monitoring i devre
              dışı bırakır. Belirlediğiniz süre aralığında kesintiler sistem
              çalışma oranınızı etkilemez ve bildirim gönderilmez.`}
            </Alert>
          </DialogContentText>
          <form>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  'DatePicker',
                  'TimePicker',
                  'DatePicker',
                  'TimePicker',
                ]}
              >
                <Box display={'flex'} gap={2} justifyContent={'space-around'}>
                  <DatePicker
                    disabled={monitor.maintanance?.status||false}
                    label="Başlangıç Tarih"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -300], // yukarı kaydırma
                            },
                          },
                        ],
                        sx: {
                          zIndex: 1500, // popup görünürlüğü garanti
                        },
                      },
                      textField: {
                        size: 'small',
                        InputProps: {
                          sx: {
                            '& input': {
                              fontSize: '0.8rem',
                            },
                          },
                        },
                        InputLabelProps: {
                          sx: {
                            fontSize: '0.9rem',
                          },
                        },
                      },
                    }}
                    value={monitor?.maintanance?.status?dayjs(monitor.maintanance.startTime) : startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                  />
                  <Divider orientation="vertical" variant="large" flexItem />
                  <TimePicker
                    disabled={monitor.maintanance?.status||false}
                    minutesStep={1}
                    timeSteps={{ minutes: 1 }}
                    views={['hours', 'minutes']}
                    openTo="hours"
                    ampm={false}
                    label="Başlangıç Zaman"
                    value={monitor?.maintanance?.status?dayjs(monitor.maintanance.startTime) : startTime}
                    onChange={(newValue) => setStarTime(newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        InputProps: {
                          sx: {
                            '& input': {
                              fontSize: '0.7rem',
                            },
                          },
                        },
                        InputLabelProps: {
                          sx: {
                            fontSize: '0.8rem',
                          },
                        },
                      },
                    }}
                  />
                </Box>

                <Box display={'flex'} gap={2} justifyContent={'space-around'}>
                  <DatePicker
                    disabled={monitor.maintanance?.status||false}
                    label="Bitiş Tarih"
                    value={monitor?.maintanance?.status?dayjs(monitor.maintanance.endTime) : endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -300],
                            },
                          },
                        ],
                        sx: {
                          zIndex: 1500, 
                        },
                      },
                      textField: {
                        size: 'small',
                        InputProps: {
                          sx: {
                            '& input': {
                              fontSize: '0.8rem',
                            },
                          },
                        },
                        InputLabelProps: {
                          sx: {
                            fontSize: '0.9rem',
                          },
                        },
                      },
                    }}
                  />
                  <Divider orientation="vertical" flexItem />
                  <TimePicker
                    disabled={monitor.maintanance?.status||false}
                    minutesStep={1}
                    timeSteps={{ minutes: 1 }}
                    views={['hours', 'minutes']}
                    openTo="hours"
                    ampm={false}
                    label="Bitiş Zaman"
                    value={monitor?.maintanance?.status?dayjs(monitor.maintanance.endTime) : endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        InputProps: {
                          sx: {
                            '& input': {
                              fontSize: '0.7rem',
                            },
                          },
                          
                        },
                        InputLabelProps: {
                          sx: {
                            fontSize: '0.8rem',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </DemoContainer>
            </LocalizationProvider>

            <DialogActions sx={{marginTop: '1rem', gap: 2}}>
              <Button sx={{fontSize: '0.8rem', color: 'white', bgcolor: 'secondary.dark', ':hover':{bgcolor: 'secondary.main'}}} onClick={handleCloseDialog}>Kapat</Button>
              <Button sx={{fontSize: '0.8rem', color: 'white', bgcolor: monitor.maintanance?.status?'error.main':'primary.main', ':hover':{bgcolor: monitor.maintanance?.status?'error.dark': 'primary.dark'}}} onClick={monitor.maintanance?.status?handleCancelMaintenance:handleMaintanance}>{monitor.maintanance?.status?'Bakım Durumu İptal Et':'Bakım Durumunu Başlat'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
