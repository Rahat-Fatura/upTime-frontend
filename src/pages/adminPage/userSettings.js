import React from 'react'
import { Button, TextField, Grid, Divider, MenuItem } from '@mui/material'
import api from '../../api/auth/axiosInstance'
import Swal from 'sweetalert2'

const UserProfileSettingsPage = ({ userInfo }) => {
  const saveChangesInfo = async () => {
    try {
      const { email, password, name, role, isEmailVerified } = userInfo
      const updateBody = password
        ? {
            email: userInfo.email,
            password: userInfo.password,
            name: userInfo.name,
            role: userInfo.role,
            isEmailVerified: userInfo.isEmailVerified,
          }
        : {
            email: userInfo.email,
            name: userInfo.name,
            role: userInfo.role,
            isEmailVerified: userInfo.isEmailVerified,
          }
      userInfo = await api.patch(`/users/${userInfo.id}`,updateBody)
      userInfo.password = ''
      Swal.fire({
        icon: 'success',
        title: 'Kullanıcı Güncellendi !',
        text: 'Güncelleme başarılı şekilde gerçekleşti',
        confirmButtonText: 'Tamam',
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Hatalı güncelleme işlemi !',
        text: error.response.message,
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
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Adı"
            variant="outlined"
            defaultValue={userInfo.name}
            onChange={(event) => {
              userInfo.name = event.target.value
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
            onChange={(event) => {
              userInfo.email = event.target.value
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            className="input-field"
            label="Şifresi"
            variant="outlined"
            defaultValue={''}
            onChange={(event) => {
              userInfo.password = event.target.value
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            select
            className="input-field"
            label="Yetkisi"
            variant="outlined"
            defaultValue={userInfo.role}
            onChange={(event) => {
              userInfo.role = event.target.value
            }}
          >
            <MenuItem key={'Kullanıcı'} value={'user'}>
              Kullanıcı
            </MenuItem>
            <MenuItem key={'Yönetici'} value={'admin'}>
              Yönetici
            </MenuItem>
          </TextField>
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
        md={5.5}
        sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}
      >
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            select
            className="input-field"
            label="Email doğrulaması"
            variant="outlined"
            defaultValue={userInfo.isEmailVerified}
            onChange={(event) => {
              userInfo.isEmailVerified = event.target.value
            }}
          >
            <MenuItem key={'Onaylı'} value={true}>
              Onaylı
            </MenuItem>
            <MenuItem key={'Onaylı Değil'} value={false}>
              Onaylı Değil
            </MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Adres"
            className="input-field"
            variant="outlined"
            defaultValue={'....'}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Konum"
            variant="outlined"
            className="input-field"
            defaultValue={'.....'}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Posta Kodu"
            variant="outlined"
            className="input-field"
            defaultValue={'.......'}
            disabled
          />
        </Grid>
      </Grid>

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
            onClick={() => saveChangesInfo()}
          >
            Değişiklikleri Kaydet
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserProfileSettingsPage
