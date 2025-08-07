import React from 'react'
import {
  Button,
  TextField,
  Grid,
  Divider,
  MenuItem,
  InputAdornment,
  Box,
} from '@mui/material'
import Swal from 'sweetalert2'
import api from '../../api/auth/axiosInstance'

const UserProfileSettingsPage = ({ userInfo }) => {
  const saveChangesInfo = async () => {
    try {
      const { email, password, name, isEmailVerified } = userInfo
      const updateBody = password
        ? {
            email: userInfo.email,
            password: userInfo.password,
            name: userInfo.name,
          }
        : {
            email: userInfo.email,
            name: userInfo.name,
          }
      userInfo = await api.put(
        `${process.env.REACT_APP_API_URL}auth/register-change`,
        updateBody
      )
      userInfo.password = ''
      Swal.fire({
        icon: 'success',
        title: 'Kullanıcı Güncellendi !',
        text: 'Güncelleme başarılı şekilde gerçekleşti',
        confirmButtonText: 'Tamam',
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Hatalı güncelleme işlemi !',
        text: error.response.message,
        confirmButtonText: 'Tamam',
      })
    }
  }

  const handleSubmit = async () => {
    if (userInfo.name.length > 0 && userInfo.email.length > 0) {
      try {
        const response = await api.put(
          `${process.env.REACT_APP_API_URL}auth/register-change`,
          {
            name: userInfo.name,
            email: userInfo.email,
          }
        )
        Swal.fire({
          icon: 'success',
          title: 'Başarılı',
          text: response.data.message,
          confirmButtonText: 'Tamam',
        })
      } catch (error) {
        console.error('Error changing password:', error)
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: error.response.data.message,
          confirmButtonText: 'Tamam',
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı',
        text: 'Kullanıcı adı ve mail alanları boş bırakılamaz.',
        confirmButtonText: 'Tamam',
      })
    }
  }
  const handleVerificationLink = async () => {
    try {
      const response = await api.post(
        `${process.env.REACT_APP_API_URL}auth/send-verification-email`
      )
      Swal.fire({
        icon: 'success',
        title: 'Doğrulama Bağlantısı Gönderildi',
        text: 'Lütfen e-posta adresinizi kontrol edin ve doğrulama bağlantısını tıklayın.',
        confirmButtonText: 'Tamam',
      })
    } catch (error) {
      console.error('Error sending verification link:', error)
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: error.response.data.message,
        confirmButtonText: 'Tamam',
      })
    }
  }
  return (
    <Grid
      container
      item
      md={12}
      className="grid-area"
      justifyContent={'space-between'}
      gap={2}
    >
      <Grid
        item
        xs={12}
        md={5.5}
        sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}
      >
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Adı"
            InputLabelProps={{
              sx: {
                fontSize: '0.8rem',
              },
            }}
            variant="outlined"
            defaultValue={userInfo.name}
            onChange={(event) => {
              userInfo.name = event.target.value
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Email"
            InputLabelProps={{
              sx: {
                fontSize: '0.8rem',
              },
            }}
            variant="outlined"
            defaultValue={userInfo.email}
            onChange={(event) => {
              userInfo.email = event.target.value
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Şifresi"
            InputLabelProps={{
              sx: {
                fontSize: '0.8rem',
              },
            }}
            variant="outlined"
            defaultValue={''}
            onChange={(event) => {
              userInfo.password = event.target.value
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Yetkisi"
            InputLabelProps={{
              sx: {
                fontSize: '0.8rem',
              },
            }}
            variant="outlined"
            defaultValue={userInfo.role === 'user' ? 'Kullanıcı' : 'Admin'}
            disabled
          ></TextField>
        </Grid>
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: 'none', md: 'block' } }}
      />
      <Grid
        item
        xs={12}
        md={5.5}
        sx={{ display: 'flex', gap: { xs: 2, md: 2 }, flexDirection: 'column' }}
      >
        <Grid container xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Grid item xs={12} md={5}>
            <TextField
              className="input-field"
              label="Email doğrulaması"
              InputLabelProps={{
                sx: {
                  fontSize: '0.8rem',
                },
              }}
              sx={{
                fontSize: '0.8rem',
              }}
              variant="outlined"
              defaultValue={
                userInfo.isEmailVerified ? 'Onaylı' : 'Onaylı Değil'
              }
              disabled
            ></TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              onClick={() => handleVerificationLink()}
              sx={{
                borderRadius: '8px',
                fontSize: '0.6rem',
              }}
            >
              Doğrulama bağlantısı gönder
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Adres"
            InputLabelProps={{
              sx: {
                fontSize: '0.8rem',
              },
            }}
            className="input-field"
            variant="outlined"
            defaultValue={''}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label=""
            variant="outlined"
            className="input-field"
            defaultValue={''}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Telefon No"
            InputLabelProps={{
              sx: {
                fontSize: '0.8rem',
              },
            }}
            variant="outlined"
            className="input-field"
            defaultValue={''}
            disabled
          />
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          mt: '3vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid md={3}>
          <Button
            variant="contained"
            color="primary"
            className="custom-button"
            onClick={() => saveChangesInfo()}
          >
            Değişiklikleri Kaydet
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserProfileSettingsPage
