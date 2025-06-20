import React, { useState } from "react";
import { Grid, Button, Typography, TextField } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cookies } from "../../utils/cookie";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`,{
      email: email
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

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5vh",
      }}
      md={12}
      spacing={2}
    >
      <Grid
        item
        md={8.5}
        sm={8.5}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {" "}
        <Grid
          component="img"
          sx={{
            width: "80vh", // Genişliği %100 yaparak gridin tamamını kaplar
            height: "80vh", // Yüksekliği otomatik yaparak orijinal oranları korur
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
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20vh",
          marginBottom: "20vh",
          backgroundColor: "#ffffff",
          padding: "2vh",
        }}
      >
        {/* Sağ taraftaki giriş formu */}

        <Grid
          item
          md={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h5">Parolanızı mı unuttunuz 🔒</Typography>
          <Typography>
            Lütfen sisteme kayıtlı E-postanızı girin, şifrenizi sıfırlamanız
            için size bağlantı göndereceğiz.
          </Typography>
        </Grid>
        <Grid item md={12} sx={{ width: "100vh" }}>
          <TextField
            className="input-field"
            fullWidth
            placeholder="E-mail adresinizi giriniz"
            label="Email"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Grid>
        <Grid item md={12} sx={{ width: "100%" }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            type="submit"
            className="custom-button"
            onClick={handleSubmit}
            // Inline styles for background color and width
          >
            Şifremi Sıfırla
          </Button>
        </Grid>
        <Grid
          item
          md={12}
          sx={{ display: "flex", alignItems: "center", gap: "2vh" }}
        >
          <Button
            variant="body2"
            onClick={() => navigate("/login")}
            className="unframed-button "
            sx={{
              color: "#786af2",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
            Giriş sayfasına dön
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
