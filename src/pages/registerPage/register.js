/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { registerFormSchema } from '../../utils/formSchema/formSchemas'
import {
  Box,
  Button,
  Typography,
  Checkbox,
  TextField,
  InputAdornment,
  IconButton,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  Link,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Visibility, VisibilityOff, Person, Email, Lock } from '@mui/icons-material'
import axios from 'axios'

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const submit = async (values,action) => {
      axios
      .post(`${process.env.REACT_APP_API_URL}auth/register`, {
        name: values.username,
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        Swal.fire({
          title: 'Kayıt İşlemi',
          icon: 'success',
          text: 'Başarıyla kayıt oldunuz.',
          confirmButtonText: 'Tamam',
        })
        navigate('/login')
      })
      .catch((error) => {
        Swal.fire({
          title: error.response.data.message,
          icon: 'error',
          text: 'Kayıt işlemi başarısız oldu.',
          confirmButtonText: 'Tamam',
        })
      })
    
  }

  const {values,errors,handleChange,handleSubmit}=useFormik({
      initialValues:{
        username: '',
        email: '',
        password: '',
        agree: false
      },
      validationSchema: registerFormSchema,
      onSubmit: submit,
      validateOnChange: false,
      validateOnBlur: false
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
        src="/RahatUp-logo.png"
        alt="RahatUp Logo"
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          width: "120px",
          height: "auto",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      /> */}

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
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: "500px",
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
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  mb: 1,
                  background: "linear-gradient(45deg, #1976d2, #2196f3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Kayıt Ol
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#666", fontSize: "0.95rem" }}
              >
                Lütfen gerekli bilgileri doğru ve eksiksiz doldurunuz
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id='username'
                fullWidth
                label="Kullanıcı Adı"
                variant="outlined"
                value={values.username}
                onChange={handleChange}
                helperText={(<Typography variant='p' color={'red'}>{errors.username}</Typography>)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#1976d2" }} />
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
                id='email'
                fullWidth
                label="Email"
                variant="outlined"
                value={values.email}
                onChange={handleChange/*(e) => setEmail(e.target.value)*/}
                helperText={(<Typography variant='p' color={'red'}>{errors.email}</Typography>)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#1976d2" }} />
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
                id='password'
                fullWidth
                label="Şifre"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange/*(e) => setPassword(e.target.value)*/}
                helperText={(<Typography variant='p' color={'red'}>{errors.password}</Typography>)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#1976d2" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                }}
              >
                <Checkbox
                  id='agree'
                  checked={values.agree}
                  onChange={handleChange/*(e) =>{
                    setAgree(e.target.checked)
                    if(e.target.checked){
                      setErrorMessage('')
                    }
                  }*/}
                  sx={{
                    color: "#1976d2",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
                <Link
                  href="https://uptime-test-api.rahatyonetim.com/privasyPolisy.html"
                  target='_blank'
                  className="unframed-button"
                  sx={{
                    color: "#1976d2",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    textDecoration: 'none',
                    "&:hover": {
                      color: "#1565c0",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Gizlilik Politikası ve Şartlarını
                </Link>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  kabul ediyorum
                </Typography>
                
              </Box>
              <Typography variant="body2" sx={{ color: "red" }}>
                  {errors.agree}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={()=>handleSubmit()}
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
                Kayıt Ol
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
                  Zaten bir hesabınız var mı?
                </Typography>
                <Button
                  onClick={() => navigate('/login')}
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
                  Giriş yap
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default Register
