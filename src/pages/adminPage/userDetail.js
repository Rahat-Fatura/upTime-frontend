import { useState, useEffect } from 'react'
import {
  Grid,
  Avatar,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import UserInfo from './userInfo.js'
import UserSettings from './userSettings.js'
import localStorage from 'local-storage'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../../api/auth/axiosInstance.js'
import Swal from 'sweetalert2'
import { Monitor } from "@mui/icons-material";
const UserDetail = () => {
  const [params, setParams] = useState(useParams())
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const [userStatus, setUserStatus] = useState(true) //Kullanıcının aktif pasiflik durumunu belirtir.
  const [selectedButtonId, setSelectedButtonId] = useState(1)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`users/${params.userId}`)
        console.log(response.data)
        setUserInfo(response.data)
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata oluştu:', error)
      }
    }
    fetchUserInfo()
  }, [])

  const handleButtonClick = (buttonId) => {
    setSelectedButtonId(buttonId)
  }

  const deleteUser = () => {
    Swal.fire({
      title: 'Silmek istediğinizden emin misiniz',
      icon: 'warning',
      text: 'Kullanıcı sistemden tamamen silinecektir',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Evet silmek istiyorum',
      cancelButtonText: 'Hayır',
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await api.delete(`users/${userInfo.id}`)
          Swal.fire({
            icon: 'success',
            title: 'Kullanıcı Silindi',
            text: 'Başarılı şekilde silindi',
            confirmButtonText: 'Tamam',
          })
          navigate('/admin/users')
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
    //const response =
    /* */
  }
  return (
    <Grid container>

      <Grid
        item
        md={11.3}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          pr: '4vh',
        }}
      >
        <Grid //Profil Header Alanı
          item
          md={12}
          sx={{
            marginTop: '3vh',
            backgroundColor: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
        >
          <Card sx={{ width: '100%' }}>
            <Grid
              sx={{
                height: 150,
                background:
                  'linear-gradient(90deg, rgba(255,39,39,1) 8%, rgba(226,135,43,1) 24%, rgba(176,75,233,1) 65%, rgba(30,144,255,1) 100%)',
              }}
            />
            <CardContent sx={{ position: 'relative' }}>
              <Avatar
                alt={userInfo.name}
                src="/path-to-profile-image.jpg"
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid white',
                  position: 'absolute',
                  top: -60,
                  left: 20,
                }}
              />

              <Grid
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  position: 'relative',
                  top: 0,
                  left: 150,
                }}
              >
                <Grid item sx={{ marginRight: '1vh' }}>
                  <Typography variant="h5" component="div">
                    {userInfo.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  position: 'absolute',
                  top: 20,
                  right: 20,
                }}
              >
                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  ></Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ height: '5vh' }}
                />
                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  ></Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ height: '5vh' }}
                />
                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {String(userInfo.created_at).split('T')[0]}
                  </Typography>
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ height: '5vh' }}
                />
                <Grid
                  item
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Durum :
                  </Typography>
                  <Chip
                    label={userInfo.status ? 'Aktif' : 'Pasif'}
                    color={userInfo.status ? 'success' : 'error'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          md={12}
          sx={{
            display: 'flex',
            mt: '3vh',
            gap: 5,
            pt: '1vh',
            pb: '1vh',
            alignItems: 'center',
          }}
        >
          <Grid item md={1}>
            <Button
              fullWidth
              variant={selectedButtonId === 1 ? 'contained' : 'text'}
              type="submit"
              className={
                selectedButtonId === 1 ? 'selected-button' : 'unselected-button'
              }
              sx={{ display: 'flex', gap: 1 }}
              onClick={() => handleButtonClick(1)}
            >
              <BadgeOutlinedIcon fontSize="medium" />
              Bilgiler
            </Button>
          </Grid>
          <Grid item md={1}>
            <Button
              fullWidth
              variant={selectedButtonId === 2 ? 'contained' : 'text'}
              type="submit"
              className={
                selectedButtonId === 2 ? 'selected-button' : 'unselected-button'
              }
              sx={{ display: 'flex', gap: 1, pt: '1vh', pb: '1vh' }}
              onClick={() => handleButtonClick(2)}
            >
              <ManageAccountsOutlinedIcon fontSize="medium" />
              Ayarlar
            </Button>
          </Grid>
          <Grid item md={1} sx={{ justifyContent: 'end' }}>
            <Button
              fullWidth
              variant={'contained'}
              type="submit"
              sx={{
                display: 'flex',
                gap: 1,
                pt: '1vh',
                pb: '1vh',
                background: '#1976d2',
              }}
              onClick={() =>navigate(`/admin/userMonitors/${params.userId}`)}
            >
              <Monitor fontSize="medium" />
              
            </Button>
          </Grid>
          <Grid item md={1} sx={{ justifyContent: 'end' }}>
            <Button
              fullWidth
              variant={'contained'}
              type="submit"
              sx={{
                display: 'flex',
                gap: 1,
                pt: '1vh',
                pb: '1vh',
                background: 'red',
              }}
              onClick={() => deleteUser()}
            >
              <DeleteIcon fontSize="medium" />
              
            </Button>
          </Grid>
        </Grid>
        {selectedButtonId === 1 ? (
          <UserInfo userInfo={userInfo} />
        ) : selectedButtonId === 2 ? (
          <UserSettings userInfo={userInfo} />
        ) : (
          ''
        )}
      </Grid>
    </Grid>
  )
}

export default UserDetail
