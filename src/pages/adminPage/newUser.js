import { useState, useEffect } from 'react'
import api from '../../api/auth/axiosInstance'
import {
  Grid,
  Box,
  TextField,
  Typography,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Button,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { AccountCircle } from '@mui/icons-material'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LockIcon from '@mui/icons-material/Lock'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Swal from 'sweetalert2'

const NewUser = () => {
  const [userName, setUserName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('user')
  const navigate = useNavigate()


  const handleChange = (event) => {
    setRole(event.target.value)
    console.log(role)
  }

  const newUserHandler = async() => {
     try {
      const response = await api.post('users/',{
        email: email,
        password: password,
        name: userName, 
        role: role
      })
      Swal.fire({
        icon: 'success',
        title: 'Başarılı oluşuturldu',
        text: 'Sisteme yeni kullanıcı eklendi !',
        confirmButtonText: 'Tamam'
      })
      navigate('/admin/users')
     } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hatalı sonuç',
        text: error.response.data.message,
        confirmButtonText: 'Tamam'
      })
     }
  }

  const canselHandler = () => {
    navigate('/admin')
  }

  const userNameHandler = (event) => {
    setUserName(event.target.value)
    console.log(userName)
  }

  const emailHandler = (event) => {
    setEmail(event.target.value)
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value)
    console.log(password)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (event) => {
    event.preventDefault()
  }

  return (
    <Grid container width={'100%'}>
     
      <Grid
        item
        justifyContent="center"
        width={'100%'}
      >
        <Grid
          md={8}
          spacing={3}
          gap={3}
          className="grid-area"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            background: '#fffcff',
            justifyContent: 'center',
          }}
        >
          <Grid
            md={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body"
              component="h3"
              sx={{ textAlign: 'center' }}
            >
              Yeni Kullanıcı Ekle
            </Typography>
          </Grid>
          <Grid md={12}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                id="outlined-basic"
                label="Kullanıcı adı"
                variant="standard"
                onChange={userNameHandler}
                sx={{ width: '300px' }}
                required
              />
            </Box>
          </Grid>
          <Grid sx={12} md={12} lg={8}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AlternateEmailIcon
                sx={{ color: 'action.active', mr: 1, my: 0.5 }}
              />
              <TextField
                id="outlined-basic"
                label="Email"
                variant="standard"
                onChange={emailHandler}
                type="email"
                sx={{ width: '300px' }}
                required
              >
                Email
              </TextField>
            </Box>
          </Grid>
          <Grid md={12} sx={{ display: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField onChange={passwordHandler} label="Şifre" variant='standard' type={showPassword?'text':'password'} sx={{ width: '300px' }} required/>
              <IconButton onClick={handleClickShowPassword}>{showPassword?(<Visibility/>):(<VisibilityOff/>)}</IconButton>
            </Box>
          </Grid>
          <Grid md={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Yetkisi</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Yetkisi"
                onChange={handleChange}
              >
                <MenuItem value={'user'}>Kullanıcı</MenuItem>
                <MenuItem value={'admin'}>Yönetici</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid md={4} sx={{ display: 'flex' }}>
            <Grid md={6}>
              <Button
                onClick={() => canselHandler()}
                sx={{
                  background: '#fc7703',
                  color: 'white',
                  ':hover': {
                    color: 'black',
                  }
                }}
              >
                İptal
              </Button>
            </Grid>
            <Grid md={4}>
              <Button
                onClick={() => newUserHandler()}
                sx={{
                  background: 'blue',
                  color: 'white',
                  ':hover': {
                    color: 'black',
                }}}
              >
                Oluştur
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default NewUser;
