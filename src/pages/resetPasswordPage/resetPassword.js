import React, { useEffect, useState } from 'react'
import { Container, Paper, Box, Button, Typography, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import InputAdornment from '@mui/material/InputAdornment'
import axios from 'axios'
import { cookies } from '../../utils/cookie'
import { useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { jwtDecode } from 'jwt-decode'
import { useFormik } from 'formik'
import { resetPasswordFormSchema } from '../../utils/formSchema/formSchemas'


const ResetPassword = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const [showPassword, setShowPassword] = useState(false)
  const [showVerifyPassword, setShowVerifyPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    let decodeToken;
    if(token){
      console.log("Token:",token)
    try{
      decodeToken = jwtDecode(token);
    }
    catch(error){
      decodeToken = null;
    }
     
     console.log("Decode Token", decodeToken)
     if(!decodeToken){
      Swal.fire({
        icon: 'error',
        title: 'Error Access',
        text: 'Please checked your email link !',
        confirmButtonText: 'Okey',
      })
      navigate("/forgot-password")
     }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error Access',
        text: 'Please checked your email link !',
        confirmButtonText: 'Okey',
      })
      navigate("/forgot-password")
    }
   
  },[]);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowVerifyPassword = () => setShowVerifyPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const submit = (values,action) => {
        axios
      .post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password?token=${token}`,
        {
          password: values.password,
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
    // Giriş başarılı olursa yönlendirme
  }

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues:{
      password: '',
      verifyPassword: ''
    },
    validationSchema: resetPasswordFormSchema,
    onSubmit: submit,
  });

   return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, transparent 50%)",
            animation: "rotate 30s linear infinite",
          },
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
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
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            
  
            {/* Login Formu */}
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: "550px",
                p: 4,
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                mt: 8,
              }}
            >
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                  variant="h4"
                >
                  Yeni parolanızı girin 🔒
                </Typography>
              </Box>
  
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  id="password"
                  fullWidth
                  label="Şifre"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  helperText={(<Typography variant='p' color={'red'}>{errors.password}</Typography>)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#1976d2" }}
                        >
                          {showPassword ? <Visibility /> :  <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
                <TextField
                  id="verifyPassword"
                  fullWidth
                  label="Şifre"
                  type={showVerifyPassword ? "text" : "password"}
                  value={values.verifyPassword}
                  onChange={handleChange}
                  helperText={(<Typography variant='p' color={'red'}>{errors.verifyPassword}</Typography>)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                          edge="end"
                          sx={{ color: "#1976d2" }}
                        >
                          {showVerifyPassword ?  <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: "12px",
                    background: "linear-gradient(45deg, #1976d2, #2196f3)",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #1976d2)",
                      boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Gönder
                </Button>
  
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 2,
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Giriş Sayfasına dön
                  </Typography>
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#1976d2",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        color: "#1565c0",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Giriş Sayfası
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  
}

export default ResetPassword;