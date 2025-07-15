import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../../api/auth/axiosInstance.js'
import Swal from 'sweetalert2'
import { Container, Typography, Paper, Box, Button, Icon } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
const VerifyEmailPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const navigate = useNavigate()
  const [tokenStatus, setTokenStatus] = useState()

  const checkToken = async () => {
    try {
      if (!token) {
        navigate('/')
        return
      }
      const decodedToken = jwtDecode(token)
      const response = await api.post(
        `${process.env.REACT_APP_API_URL}auth/verify-email?token=${token}`
      )
      // console.log('Response bölgeey', response)
      // setTokenStatus(true)
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Email Doğrulandı',
      //   text: 'Email adresiniz başarıyla doğrulandı.',
      //   confirmButtonText: 'Tamam',
      // })
      setTokenStatus(true)
    } catch (error) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Hatalı Token',
      //   text: 'Bu token geçersiz veya süresi dolmuş.',
      //   confirmButtonText: 'Tamam',
      // })
      setTokenStatus(false)
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background:
            'radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, transparent 50%)',
          animation: 'rotate 30s linear infinite',
        },
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      {/* Logo 
            <Box
              component="img"
              src="/rahatsistem-logo.png"
              alt="RahatUp Logo"
              sx={{
                position: "absolute",
                top: 20,
                left: 20,
                width: "120px",
                height: "auto",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />*/}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {/* Login Formu */}
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: '550px',
              p: 4,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              mt: 8,
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
               {tokenStatus?(<MailIcon sx={{fontSize :50}} color='success'/>):(<MailIcon sx={{fontSize :50}} color='error'/>)}
              <Typography variant="h5">{tokenStatus? 'Mail doğrulamanız başarıyla gerçekleşti !': 'Bu token geçersiz veya süresi dolmuş.'}</Typography>
            </Box>
            <Box sx={{display: 'flex',justifyContent: 'end'}}>
              <Button onClick={()=>navigate('/user')}>Ana sayfaya git</Button>
            </Box>
            
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default VerifyEmailPage
