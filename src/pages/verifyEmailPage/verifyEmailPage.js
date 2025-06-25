import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../../api/auth/axiosInstance.js'
import Swal from 'sweetalert2'

const VerifyEmailPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const navigate = useNavigate()

  const checkToken = async () => {
    try {
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Hatalı Erişim',
          text: 'Lütfen email doğrulama linkinizi kontrol edin.',
          confirmButtonText: 'Tamam',
        })
        navigate('/login')
        return
      }
      const decodedToken = jwtDecode(token)
        const response = await api.post(
          `${process.env.REACT_APP_API_URL}auth/verify-email?token=${token}`
        )
        console.log('Response bölgeey',  response)
        Swal.fire({
          icon: 'success',
          title: 'Email Doğrulandı',
          text: 'Email adresiniz başarıyla doğrulandı.',
          confirmButtonText: 'Tamam',
        })
        navigate('/login')
      
    } catch (error) {
      console.log('Error bölgeey geldi');
      Swal.fire({
        icon: 'error',
        title: 'Hatalı Token',
        text: 'Bu token geçersiz veya süresi dolmuş.',
        confirmButtonText: 'Tamam',
      })
      navigate('/login')
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  return <div></div>
}

export default VerifyEmailPage
