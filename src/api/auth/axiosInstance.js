import axios from 'axios'
import { cookies } from '../../utils/cookie'
import Swal from "sweetalert2"

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
})

instance.interceptors.request.use(config => {
  const accessToken = cookies.get('jwt-access');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

instance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error.response.status === 401 && cookies.get('jwt-refresh')) {
      try {
        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}auth/refresh-tokens`,
          { refreshToken: cookies.get('jwt-refresh') }
        )
        const newAccess = refreshResponse.data.access.token
        const newRefresh = refreshResponse.data.refresh.token
        cookies.set('jwt-access', newAccess)
        cookies.set('jwt-refresh', newRefresh)
        error.config.headers.Authorization = `Bearer ${newAccess}`
        return axios(error.config)
      } catch (err) {
        console.error(err)
        console.log('Refresh token geçersiz. Yeniden giriş yapılmalı.')
        Swal
          .fire({
            title: "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.",
            icon: "error", 
            confirmButtonText: "Tamam",
          })
          .then(() => {
            cookies.remove("jwt-access")
            cookies.remove("jwt-refresh")
            window.location.href = "/login"
          })
      }
    }

    return Promise.reject(error)
  }
)

export default instance
