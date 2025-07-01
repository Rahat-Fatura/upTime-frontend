import React, { useState } from "react";
import { Container, Box, Button, Typography, TextField, Paper, InputAdornment } from "@mui/material";
import Email from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cookies } from "../../utils/cookie";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { forgotPasswordFormSchema } from "../../utils/formSchema/formSchemas";

const ForgotPassword = () => {
  const navigate = useNavigate();


  const submit = (values,action) => {
    axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`,{
      email: values.email
    },{
      headers:{
        'Authorization': `Bearer ${cookies.get("jwt-access")}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response=>{
      console.log(response)
      Swal.fire({
        icon: 'warning',
        title: 'E-posta adresinize şifre sıfırlama bağlantısı gönderildi',
        text: 'Lütfen e-posta adresinizi kontrol edin.',
        confirmButtonText: 'Tamam',
      })
      navigate("/login");
    })
    .catch(err=>{
      Swal.fire({
        icon: 'error',
        title: 'E-posta gönderilemedi',
        text: 'Lütfen e-postanız doğrumu kontrol edin !',
        confirmButtonText: 'Tamam',
      })
      console.log(err)
    });
     
     // Giriş başarılı olursa yönlendirme
  };
  
  const {values,errors,handleChange,handleSubmit}=useFormik({
    initialValues:{
      email:''
    },
    validationSchema: forgotPasswordFormSchema,
    onSubmit: submit
  })

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
                variant="h5"
              >
                Parolanızı mı unuttunuz 🔒
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#666", fontSize: "0.95rem" }}
              >
                Lütfen sisteme kayıtlı E-postanızı girin, şifrenizi sıfırlamanız için size bağlantı göndereceğiz.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id="email"
                fullWidth
                label="Email"
                variant="outlined"
                value={values.email}
                onChange={handleChange}
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
                  Giriş sayfasına git
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
                  Giriş sayfası
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
