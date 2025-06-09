import React from "react";
import { Button, TextField, Grid, Divider } from "@mui/material";
import Swal from 'sweetalert2';
import api from '../../api/auth/axiosInstance'
const UserProfileSettingsPage = ({ userInfo}) => {

  const handleSubmit = async () => {
      if (userInfo.name.length > 0 && userInfo.email.length > 0) {
        try {
          const response = await api.put(
            `${process.env.REACT_APP_API_URL}auth/register-change`,
            {
              name: userInfo.name,
              email:  userInfo.email,
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

  return (
    <Grid
      container
      item
      md={12}
      className="grid-area"
      justifyContent={"space-between"}
    >
      <Grid
        item
        xs={12}
        md={5.5}
        sx={{ display: "flex", gap: 2, flexDirection: "column" }}
      >
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Ad"
            variant="outlined"
            defaultValue={userInfo.name}
            onChange={(e)=>{
              userInfo["name"]= e.target.value;
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Email"
            variant="outlined"
            defaultValue={userInfo.email}
            onChange={(e)=>{
              userInfo["email"]= e.target.value;
            }}
          />
        </Grid>
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", md: "block" } }}
      />
      

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          mt: "3vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid md={3}>
          <Button onClick={()=>handleSubmit()} variant="contained" color="primary" className="custom-button">
            Değişiklikleri Kaydet
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserProfileSettingsPage;
