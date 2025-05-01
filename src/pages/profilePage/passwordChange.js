import React from 'react'
import { Button, TextField, Grid, Divider } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'
const PasswordChange = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show)
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (event) => {
    event.preventDefault()
  }

  const handleSubmit = async () => {
    if (password.length > 0 && newPassword.length > 0) {
      console.log('Password:', password)
      console.log('New Password:', newPassword)
      try {
        const response = await api.post(
          `${process.env.REACT_APP_API_URL}auth/password-change`,
          {
            password: password,
            newPassword: newPassword,
          }
        )
        console.log('Password change response:', response.data)
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
      console.log('Password:', password)
      console.log('New Password:', newPassword)
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı',
        text: 'Mevcut şifre veya yeni şifre alanları boş bırakılamaz.',
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
    >
      <Grid
        item
        xs={12}
        md={5.5}
        sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}
      >
        <Grid item xs={12} md={12} lg={7}>
          <TextField
            fullWidth
            className="input-field"
            label="Mevcut Şifre"
            variant="outlined"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={7}>
          <TextField
            fullWidth
            className="input-field"
            label="Yeni Şifre"
            variant="outlined"
            onChange={(e) => {
              setNewPassword(e.target.value)
            }}
            type={showNewPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showNewPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showNewPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
            onClick={() => handleSubmit()}
          >
            Şifreyi Değiştir
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PasswordChange
