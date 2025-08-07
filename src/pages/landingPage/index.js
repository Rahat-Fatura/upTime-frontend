import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Speed,
  Notifications,
  BarChart,
  Language,
  Security,
  Support,
  ArrowForward,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '../../utils/animateCSS/animate.css'
import Swal from 'sweetalert2'
import downScrollPng from '../../assets/images/down_scroll.png'
import api from '../../api/auth/axiosInstance'
import { useFormik } from 'formik'
import { landingFormSchema } from '../../utils/formSchema/formSchemas'
const features = [
  {
    icon: <Speed sx={{ fontSize: 40 }} />,
    title: 'Gerçek Zamanlı İzleme',
    description: 'Web sitenizin performansını saniye saniye takip edin.',
  },
  {
    icon: <Notifications sx={{ fontSize: 40 }} />,
    title: 'Anlık Bildirimler',
    description: 'Herhangi bir sorun olduğunda anında haberdar olun.',
  },
  {
    icon: <BarChart sx={{ fontSize: 40 }} />,
    title: 'Detaylı Raporlar',
    description: 'Performans metriklerini detaylı raporlarla analiz edin.',
  },
  {
    icon: <Language sx={{ fontSize: 40 }} />,
    title: 'Çoklu Lokasyon',
    description: 'Farklı bölgelerden kontrol noktaları ile izleme.',
  },
]

const pricingPlans = [
  {
    title: 'Başlangıç',
    price: 'Ücretsiz',
    features: [
      '1 Web Sitesi',
      '5 dakikalık kontrol aralığı',
      'Temel metrikler',
      'Email bildirimleri',
    ],
    buttonText: 'Başla',
    buttonType: 'free',
    highlighted: false,
  },
  {
    title: 'Pro',
    price: '₺99/ay',
    features: [
      '10 Web Sitesi',
      '1 dakikalık kontrol aralığı',
      'Gelişmiş metrikler',
      'SMS ve Email bildirimleri',
      'API erişimi',
    ],
    buttonText: 'Seç',
    buttonType: 'solo',
    highlighted: true,
  },
  {
    title: 'Kurumsal',
    price: 'Özel Fiyat',
    features: [
      'Sınırsız Web Sitesi',
      '30 saniyelik kontrol aralığı',
      'Özel metrikler',
      '7/24 Destek',
      'Özel entegrasyonlar',
    ],
    buttonText: 'İletişime Geç',
    buttonType: 'private',
    highlighted: false,
  },
]

const LandingPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const [vaidateOnChangeState, setValidateOnChangeState] = useState(false)
  const [vaidateOnBlurState, setValidateOnBlurState] = useState(true)
  const loginPage = () => {
    navigate('/login')
  }

  const registerPage = () => {
    navigate('/register')
  }
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const handlePricingButton = (text) =>{
    switch(text){
      case'free':{
        navigate('/login')
        break
      }
      case'solo':{
        Swal.fire({
          icon: 'info',
          title: 'Bilgilendirme',
          text: 'Bu paket geliştirme aşamasında !'
        })
        break
      }
      case'private':{
        scrollToSection("iletişim")
        break
      }
      default:{
        break
      }
    }
  }

  const handlContactUser = async(values,action) =>{
     try{
      console.log("Burdaaaa")
        const response = await api.post('users/landing',{
          name: values.name,
          email: values.email,
          message: values.message
        })
        Swal.fire({
          icon: 'success',
          title: 'Email Gönderildi !',
          text: 'Sistem Yöneticileri En Kısa Zamanda Sizinle İletişme Geçecekler',
          confirmButtonText: 'Tamam'
        })
     }
     catch(error){
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Email Gönderlemedi !',
        text: 'Lütfen Emilinizi Kontrol Ediniz Yada +90 (555) 123 45 67 Numaramızla Whatsappdan İletişme Geçiniz !'
      })

     }
  }

  const {values,errors,handleChange,handleSubmit} = useFormik({
    initialValues:{
      name: '',
      email: '',
      message: ''
    },
    validationSchema: landingFormSchema,
    onSubmit: handlContactUser,
    validateOnChange: vaidateOnChangeState,
    validateOnBlur: vaidateOnBlurState,
  })

   useEffect(() => {
      if (Object.keys(errors).length > 0) {
        setValidateOnChangeState(true)
        setValidateOnBlurState(false)
      }
    }, [errors])
  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Navbar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <img
                src="/rahatsistem-logo.png"
                alt="Logo"
                width={40}
                height={40}
                style={{
                  borderRadius: '10px',
                  paddingRight: '25px',
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: { xs: 'primary.main', sm: 'primary.main', md: 'primary.main', lg: scrolled ? 'primary.main' : 'white', xl: scrolled ? 'primary.main' : 'white' },
                }}
              >
                Rahat Up
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{color: { xs: 'primary.main', sm: 'primary.main', md: 'primary.main', lg: scrolled ? 'primary.main' : 'white', xl: scrolled ? 'primary.main' : 'white' }}}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 3 }}>
                {['özellikler', 'fiyatlandırma', 'iletişim'].map((item) => (
                  <Button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    sx={{
                      color: scrolled ? 'primary.main' : 'white',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Button>
                ))}
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#7f0b9c',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#30063b',
                    },
                  }}
                  onClick={() => loginPage()}
                >
                  Giriş Yap
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          mt: { xs: '5rem', sm: '5rem', md: '0', lg: '0', xl: '0'}
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  Web Sitenizi 7/24 İzleyin,
                  <br />
                  Rahat Edin
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9, fontWeight: 'normal' }}
                >
                  Rahat Up ile web sitenizin performansını sürekli takip edin,
                  sorunları anında tespit edin ve kullanıcı deneyimini en üst
                  seviyede tutun.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#7f0b9c',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#30063b',
                    },
                  }}
                  onClick={() => registerPage()}
                >
                  Ücretsiz Deneyin
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 0.8 }}
                transition={{
                  duration: 20,
                  ease: 'backOut',
                  repeat: Infinity,
                }}
              >
                <Box
                  component="img"
                  src="https://static.vecteezy.com/system/resources/thumbnails/059/236/222/small/beautiful-modern-a-server-room-filled-with-glowing-servers-cool-blue-light-technical-illustration-style-premium-png.png"
                  alt="Dashboard Preview"
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    height: 'auto',
                    filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.3))',
                  }}
                />
              </motion.div>

              
            </Grid>
            {/* <Grid display={'flex'} justifyContent={'center'}>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 15, 0] }} // yukarı → aşağı → yukarı
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Box
                  component="img"
                  onMouseEnter={()=>scrollToSection('özellikler')}
                  src={downScrollPng}// ya da istediğin görs
                  alt="Scroll Down"
                  sx={{
                    width: { xs: 40, sm: 40, md: 50, lg: 70 , xl: 80 },
                    height: { xs: 40, sm: 40, md: 50, lg: 70 , xl: 80 },
                    //ml:{ xs: '50%', sm: '50%', md: '0', lg: '0', xl: '0' },
                   // mr:{xs: 0, sm: 0, md: 5, lg:'50%', xl: 15 },
                    mb: { xs: 3, sm: 3, md: 5},
                    borderRadius: '50%',
                    background: '#e8e9ff',
                    mx: 'auto',
                  }}
                />
            </motion.div>
            </Grid> */}
            
          </Grid>
        </Container>
      </Box>
      {/* Features Section */}
      <Box id="özellikler" sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Neden Rahat Up?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="fiyatlandırma" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Fiyatlandırma
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      ":hover": {
                        border: '2px solid',
                        borderColor: 'primary.main',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {plan.highlighted && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'primary.main',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderBottomLeftRadius: 8,
                        }}
                      >
                        <Typography variant="caption">Popüler</Typography>
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Typography variant="h5" gutterBottom>
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mb: 3, fontWeight: 'bold' }}
                      >
                        {plan.price}
                      </Typography>
                      <List>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ArrowForward
                              sx={{ color: 'primary.main', mr: 1 }}
                            />
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button
                        variant={plan.highlighted ? 'contained' : 'outlined'}
                        fullWidth
                        size="large"
                        onClick={()=>handlePricingButton(plan.buttonType)}
                      >
                        {plan.buttonText}
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="iletişim" sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Bizimle İletişime Geçin
          </Typography>
          <Card sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  id='name'
                  fullWidth
                  value={values.name}
                  label="Adınız"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  onChange={handleChange}
                  helperText={(<Typography variant='p' color={'red'}>{errors.name}</Typography>)}
                />
                <TextField
                  id='email'
                  fullWidth
                  value={values.email}
                  label="Email Adresiniz"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  onChange={handleChange}
                  helperText={(<Typography variant='p' color={'red'}>{errors.email}</Typography>)}
                />
                <TextField
                  id='message'
                  fullWidth
                  value={values.message}
                  label="Mesajınız"
                  variant="outlined"
                  multiline
                  rows={4}
                  onChange={handleChange}
                  helperText={(<Typography variant='p' color={'red'}>{errors.message}</Typography>)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 3,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    İletişim Bilgileri
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Email: covhandata@gmail.com
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Tel: +90 (506) 315 88 12
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton color="primary">
                      <Security />
                    </IconButton>
                    <IconButton color="primary">
                      <Support />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button variant="contained" size="large" sx={{ px: 4, py: 1.5 }} onClick={()=>handleSubmit()}>
                Gönder
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Rahat Up
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Web sitenizi güvenle izleyin.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3.7}>
              <Typography variant="h6" gutterBottom>
                Hızlı Bağlantılar
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['özellikler', 'fiyatlandırma', 'iletişim'].map((item) => (
                  
                  <Button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    sx={{
                      color: 'white',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      width: `${item.length}em`
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Button>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4.3} display={'flex'} flexDirection={'column'} gap={2}>
              <Typography variant="h6" gutterBottom>
                İletişim
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Şirket: Covhan Data Arge Yazılım Danışmalık Limited Şirketi
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: covhandata@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Tel: +90 (506) 315 88 12
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Adress: Çifte havuzlar mah. Eski londra asfaldlı cad. Kuluçka mrk. A1 blok no: 151 /1C iç kapı no: B35 esenler istanbul
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 Rahat Up. Tüm hakları saklıdır.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Mobile Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {['özellikler', 'fiyatlandırma', 'iletişim'].map((item) => (
              <ListItem key={item} button onClick={() => scrollToSection(item)}>
                <ListItemText
                  primary={item.charAt(0).toUpperCase() + item.slice(1)}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/login")}
          >
            Giriş Yap
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}

export default LandingPage
