/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { cookies } from "../../utils/cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Checkbox,
  Typography,
  InputAdornment,
  IconButton,
  TextField,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { login } from "../../api/auth/login/index";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(cookies.get("email"));
    setPassword(cookies.get("password"));
    setRememberMe(cookies.get("rememberMe"));
  }, []);

  const handleLogin = (event) => {
    login(email, password)
      .then((resp) => {
        cookies.set("jwt-access", resp.data.access.token);
        cookies.set("jwt-access-expires", resp.data.access.expires);
        cookies.set("jwt-refresh", resp.data.refresh.token);
        cookies.set("jwt-refresh-expires", resp.data.refresh.expires);
        if (rememberMe) {
          cookies.set("email", email, { path: "/", maxAge: 60 * 60 * 24 * 30 });
          cookies.set("password", password, { path: "/", maxAge: 60 * 60 * 24 * 30 });
          cookies.set("rememberMe", rememberMe, { path: "/", maxAge: 60 * 60 * 24 * 30 });
        } else {
          cookies.remove("email");
          cookies.remove("password");
          cookies.remove("rememberMe");
        }
        const decodedToken = jwtDecode(resp.data.access.token);
        if (decodedToken.role === "user") {
          navigate("/user/monitors");
        } else if (decodedToken.role === "admin") {
          navigate("/admin");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        Swal.fire({
          title: err.response.data.message,
          icon: "error",
          confirmButtonText: "Tamam",
        });
      });
  };

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
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  mb: 1,
                  background: "linear-gradient(45deg, #1976d2, #2196f3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Rahat Up
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#666", fontSize: "0.95rem" }}
              >
                Hesabınıza giriş yapın ve "RAHAT"ınıza bakın
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                fullWidth
                label="Şifre"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "#1976d2",
                      "&.Mui-checked": {
                        color: "#1976d2",
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Beni Hatırla
                  </Typography>
                </Box>
                <Button
                  onClick={() => navigate("/forgot-password")}
                  sx={{
                    color: "#1976d2",
                    textTransform: "none",
                    "&:hover": {
                      color: "#1565c0",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Şifreni mi unuttun?
                </Button>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
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
                Giriş Yap
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
                  Henüz hesabınız yok mu?
                </Typography>
                <Button
                  onClick={() => navigate("/register")}
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
                  Kayıt Ol
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;