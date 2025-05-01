import React, { useState } from 'react'
import { Grid, Button, Typography, TextField } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useNavigate } from 'react-router-dom'
import InputAdornment from '@mui/material/InputAdornment'
import axios from 'axios'
import { cookies } from '../../utils/cookie'
import { useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
const ResetPassword = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showVerifyPassword, setShowVerifyPassword] = useState(false)
  const navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowVerifyPassword = () => setShowVerifyPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const handleSubmit = (event) => {
    if (password !== verifyPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Parolalar eşleşmiyor',
        text: 'Lütfen parolanızı kontrol edin.',
        confirmButtonText: 'Tamam',
      })
      return
    }
    else{
        axios
      .post(
        `${process.env.REACT_APP_API_URL}v1/auth/reset-password?token=${token}`,
        {
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.get('jwt-access')}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Parola başarıyla değiştirildi',
          text: 'Yeni parolanızla giriş yapabilirsiniz.',
          confirmButtonText: 'Tamam',
        })
        console.log(response)
        navigate('/login')
      })
      .catch((err) => {
        const message = err.response.data.message
        Swal.fire({
          icon: 'error',
          title: 'Parola değiştirilemedi',
          text: message,
          confirmButtonText: 'Tamam',
        })
        console.log(err)
      })
    }
    // Giriş başarılı olursa yönlendirme
  }

  return (
    <Grid
      container
      sx={{
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5vh',
      }}
      md={12}
      spacing={2}
    >
      <Grid
        item
        md={8.5}
        sm={8.5}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        {' '}
        <Grid
          component="img"
          sx={{
            width: '80vh', // Genişliği %100 yaparak gridin tamamını kaplar
            height: '80vh', // Yüksekliği otomatik yaparak orijinal oranları korur
          }}
          alt="My Image"
          src={`/images/login-pages.png`} // public klasöründen çağırma
        />
      </Grid>

      <Grid
        item
        md={3.5}
        sm={3.5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20vh',
          marginBottom: '20vh',
          backgroundColor: '#ffffff',
          padding: '2vh',
        }}
      >
        {/* Sağ taraftaki giriş formu */}

        <Grid
          item
          md={12}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h5">Yeni parolanızı girin 🔒</Typography>
        </Grid>
        <Grid item md={12} sx={{ width: '100vh' }}>
          <TextField
            className="input-field"
            fullWidth
            placeholder="Yeni parola giriniz"
            label=""
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={password}
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
        <Grid item md={12} sx={{ width: '100vh' }}>
        <TextField
            className="input-field"
            fullWidth
            placeholder="Yeni parolayı tekrar giriniz"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={verifyPassword}
            onChange={(e) => {
              setVerifyPassword(e.target.value)
            }}
            type={showVerifyPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={handleClickShowVerifyPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showVerifyPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item md={12} sx={{ width: '100%' }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            type="submit"
            className="custom-button"
            onClick={handleSubmit}
            // Inline styles for background color and width
          >
            Gönder
          </Button>
        </Grid>
        <Grid
          item
          md={12}
          sx={{ display: 'flex', alignItems: 'center', gap: '2vh' }}
        >
          <Button
            variant="body2"
            onClick={() => navigate('/login')}
            className="unframed-button "
            sx={{
              color: '#786af2',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
            Giriş sayfasına dön
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ResetPassword
