import React from 'react'
import { Button, TextField, Grid, Divider, Box, Typography, Paper } from '@mui/material'
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
      try {
        const response = await api.put(
          `${process.env.REACT_APP_API_URL}auth/password-change`,
          {
            password: password,
            newPassword: newPassword,
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
        text: 'Mevcut şifre veya yeni şifre alanları boş bırakılamaz.',
        confirmButtonText: 'Tamam',
      })
    }
  }

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: '#ffffff'
        }}
      >
        <Typography 
          variant="h5" 
          component="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
          }}
        >
          Şifre Değiştir
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mevcut Şifre"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Yeni Şifre"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={showNewPassword ? 'text' : 'password'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showNewPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: { xs: 2, sm: 3 }
            }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  minWidth: { xs: '100%', sm: '200px' },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                Şifreyi Değiştir
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default PasswordChange
