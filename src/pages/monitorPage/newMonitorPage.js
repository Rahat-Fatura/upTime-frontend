/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sideBar/sideBar'
import api from '../../api/auth/axiosInstance'
import Swal from "sweetalert2";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Tab,
  Tabs,
  IconButton,
  Chip,
  FormHelperText,
  Slider,
  Menu,
} from '@mui/material'
import {
  Language as LanguageIcon,
  Timer as TimerIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Help as HelpIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  DeveloperBoard as DeveloperBoardIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import ComputerIcon from '@mui/icons-material/Computer';
import { width } from '@mui/system'
import { useNavigate, useParams } from 'react-router-dom'
import {
  HTTP_METHODS,
  INTERVAL_UNITS,
  REPORT_TIME_UNITS,
} from './constants/monitorConstants'

const newMonitorPage = (update=false) => {
  const [params, setParams] = useState(useParams())
  const [monitorType, setMonitorType] = useState('http')
  const [friendlyName, setFriendlyName] = useState('')
  const [intervalUnit, setIntervalUnit] = useState('minutes')
  const [method, setMethod] = useState('GET')
  const [body, setBody] = useState()
  const [headers, setHeaders] = useState()
  const [allowedStatusCodes, setAllowedStatusCodes] = useState([])
  const [host, setHost] = useState('')
  const [interval, setInterval] = useState(5)
  const [timeout, setTimeout] = useState(30)
  const [alertContacts, setAlertContacts] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [emailInput, setEmailInput] = useState('')
  const [emailList, setEmailList] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Interval Unit:', intervalUnit)
    console.log('Interval Value:', interval)
    getIntervalLimits(intervalUnit)
  }, [intervalUnit])

  useEffect(() => {
    const fetchMonitorData= async()=>{
      try {
        const response = await api.get(`monitors/http/${params.id}`);
        console.log(response.data)
        setFriendlyName(response.data.monitor.name);
        setHost(response.data.host);
        setMethod(response.data.method);
        setBody(response.data.body
          ? JSON.stringify(response.data.body)
          : '');
        setHeaders(response.data.headers
          ? JSON.stringify(response.data.headers)
          : '');
        setAllowedStatusCodes(response.data.allowedStatusCodes
          ? response.data.allowedStatusCodes.join(',')
          : '');
        setInterval(response.data.monitor.interval);
        setIntervalUnit(response.data.monitor.intervalUnit);
        setTimeout(response.data.timeOut);
        setEmailList(response.data.monitor.alertContacts || []);
      }
      catch (error) {
       Swal.fire({
          title: "Hata",
          text: "Monitor bilgileri alınırken bir hata oluştu.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
        turnMonitorPage();
        console.error('Monitor bilgileri alınırken hata oluştu:', error)
      }
    }
    if (update.update) {
      fetchMonitorData();
    }
  },[])
  const getIntervalLimits = (unit) => {
    switch (unit) {
      case 'seconds':
        setInterval(interval>=20&&interval<60?interval:20)
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        setInterval(interval>0&&interval<60?interval:0)
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        setInterval(interval>0&&interval<24?interval:1)
        setMin(1)
        setMax(23)
        return { min: 1, max: 23 }
      default:
        return
    }
  }

  const createMonitor = async(e) => {
    try {
      const formattedData = {
        name: friendlyName,
        httpMonitor:{
          host: host,
          method: method,
          body: body
          ? typeof body === 'string'
            ? JSON.parse(body)
            : body
          : {},
        headers: headers
          ? typeof headers === 'string'
            ? JSON.parse(headers)
            : headers
          : {},
          allowedStatusCodes:  allowedStatusCodes.length > 0 
            ? []//allowedStatusCodes.split(',').map((code) => code.trim())
            : [],
          timeOut: timeout
        },
        interval: interval,
        intervalUnit: intervalUnit,
      }
      console.log(formattedData)
      const response = await api.post(`monitors/http/`, formattedData)
      console.log('Response:', response.data)
      if (response.data) {
        Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    confirmButtonText: "Tamam",
                });
        turnMonitorPage();
      }
    } catch (error) {
      Swal.fire({
                  title: error.response.data.message,
                  icon: "error",
                  confirmButtonText: "Tamam",
              });
      console.error('Sunucu eklenirken hata oluştu:', error)
    }
  }

  const updateMonitor = async(e) => {
    try {
      const formattedData = {
        name: friendlyName,
        httpMonitor:{
          host: host,
          method: method,
          body: body
          ? typeof body === 'string'
            ? JSON.parse(body)
            : body
          : {},
        headers: headers
          ? typeof headers === 'string'
            ? JSON.parse(headers)
            : headers
          : {},
          allowedStatusCodes: allowedStatusCodes.length>0
          ? allowedStatusCodes.split(',').map((code) => code.trim())
          :[],
          timeOut: timeout,
        },
        interval: interval,
        intervalUnit: intervalUnit
      }
      console.log(formattedData)
      const response = await api.put(`monitors/http/${params.id}`, formattedData)
      console.log('Response:', response.data)
      if (response.data) {
        Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    confirmButtonText: "Tamam",
                });
        turnMonitorPage();
      }
    } catch (error) {
      Swal.fire({
                  title: error.response.data.message,
                  icon: "error",
                  confirmButtonText: "Tamam",
              });
      console.error('Monitor update error :', error)
    }
  }

  const handleMonitorTypeChange = (event) => {
    setMonitorType(event.target.value)
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const turnMonitorPage = () => {
    navigate('/user/monitors/')
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAddEmail = () => {
    if (
      isValidEmail(emailInput) &&
      emailInput &&
      !emailList.includes(emailInput)
    ) {
      setEmailList([...emailList, emailInput])
      setEmailInput('')
    }
  }

  const handleRemoveEmail = (emailToRemove) => {
    setEmailList(emailList.filter((email) => email !== emailToRemove))
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '180px' }}>
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="500">
              {update.update?"Update Monitor":"New Monitor"}
            </Typography>

            {/* Monitor Type Selection */}
            <Box sx={{ mb: 4, mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                Monitor Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={monitorType}
                  onChange={handleMonitorTypeChange}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 2,
                    },
                  }}
                >
                  <MenuItem value="http">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#3f51b5',
                          p: 1.5,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 48,
                        }}
                      >
                        <PublicIcon sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          HTTP(S)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monitor websites and web services
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled={update.update?true:false} value="ping">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#4caf50',
                          p: 1.5,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 48,
                        }}
                      >
                        <ComputerIcon sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          Ping
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monitor network connectivity
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled={update.update?true:false} value="port">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#ff9800',
                          p: 1.5,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 48,
                        }}
                      >
                        <DeveloperBoardIcon
                          sx={{ color: 'white', fontSize: 28 }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          Port
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monitor specific ports
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled={update.update?true:false} value="keyword">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#e91e63',
                          p: 1.5,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 48,
                        }}
                      >
                        <CodeIcon sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          Keyword
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monitor for specific keywords
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled={update.update?true:false} value="cronjob">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: '#3f51b5',
                          p: 1.5,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 48,
                        }}
                      >
                        <TimerIcon sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="500">
                          CRON JOB
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cron job monitoring
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                  <Divider />
                </Select>
                <FormHelperText>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <InfoIcon
                      sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {monitorType === 'http'
                        ? 'Monitor websites and web services'
                        : monitorType === 'ping'
                        ? navigate('/user/monitors/new/ping')
                        : monitorType === 'port'
                        ? navigate('/user/monitors/new/port')
                        : monitorType === 'keyword'
                        ? navigate('/user/monitors/new/keyword')
                        : monitorType === 'cronjob'
                        ? navigate('/user/monitors/new/cronjob')
                        : 'Select a monitor type to get started.'
                      }
                    </Typography>
                  </Box>
                </FormHelperText>
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Monitor Details */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Friendly Name"
                  value={friendlyName}
                  onChange={(e) => setFriendlyName(e.target.value)}
                  helperText="A descriptive name for this monitor"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={
                    'URL (or IP)'
                  }
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder={
                    'https://example.com'
                  }
                  helperText={
                     'The URL to monitor including http:// or https://'
                  }
                />
              </Grid>
            </Grid>

            {monitorType === 'http' && (
              <Box sx={{ mt: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Basic Settings" />
                  <Tab label="Request Details" />
                  {/*<Tab label="Authentication" />*/}
                </Tabs>

                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {activeTab === 0 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Grid item>
                          <InputLabel>Monitoring Interval</InputLabel>
                        </Grid>
                        <FormControl fullWidth>
                          <Slider
                            name="interval"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            min={min}
                            max={max}
                            step={1} // Her tıklamada 1 artar/azalır
                            valueLabelDisplay="auto" // Değeri üzerinde gösterir
                            marks={[
                              { value: min, label: `${min}` }, // Min değeri etiketliyor
                              { value: max, label: `${max}` }, // Max değeri etiketliyor
                            ]}
                            sx={{ color: '#1976d2' }} // Mavi renk
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Grid item>
                          <InputLabel>Time Unit</InputLabel>
                        </Grid>
                        <FormControl fullWidth>
                          <Select
                            name="intervalUnit"
                            value={intervalUnit || 'minutes'}
                            label="Birim"
                            onChange={(e) => {
                              setIntervalUnit(e.target.value)
                            }}
                            variant="outlined"
                          >
                            {INTERVAL_UNITS.map((unit) => (
                              <MenuItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  )}
                  {activeTab === 1 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="HTTP Method"
                          select
                          defaultValue = {update.update? method : 'GET'}
                          onChange={(e) => setMethod(e.target.value)}
                        >
                          <MenuItem value="GET">GET</MenuItem>
                          <MenuItem value="POST">POST</MenuItem>
                          <MenuItem value="PUT">PUT</MenuItem>
                          <MenuItem value="DELETE">DELETE</MenuItem>
                          <MenuItem value="PATCH">PATCH</MenuItem>
                          <MenuItem value="HEAD">HEAD</MenuItem>
                        </TextField>
                      </Grid>
                      <Divider sx={{ my: 3 }} />
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Custom HTTP Headers (JSON TYPE)"
                          multiline
                          rows={3}
                          sx={{ mb: 2 }}
                          name="headers"
                          value={
                            typeof headers === 'object'
                              ? JSON.stringify(headers)
                              : headers
                          }
                          onChange={(e) => setHeaders(e.target.value)}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Divider sx={{ my: 3 }} />
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Custom HTTP Body (JSON TYPE)"
                          multiline
                          rows={3}
                          sx={{ mb: 2 }}
                          name="body"
                          value={
                            typeof body === 'object'
                              ? JSON.stringify(body)
                              : body
                          }
                          onChange={(e) => setBody(e.target.value)}
                          variant="outlined"
                          size="small"
                          helperText="POST, PUT veya PATCH istekleri için gönderilecek veri"
                          InputProps={{
                            startAdornment: (
                              <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Divider sx={{ my: 3 }} />
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          label="İzin Verilen Status Kodları"
                          name="allowedStatusCodes"
                          value={
                            Array.isArray(allowedStatusCodes)
                              ? allowedStatusCodes.join(',')
                              : allowedStatusCodes
                          }
                          onChange={(e) =>
                            setAllowedStatusCodes(e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          helperText="Virgülle ayırarak yazın (örn: 200,201,409)"
                        />
                      </Grid>
                    </Grid>
                  )}
                  {/*activeTab === 2 && (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Authentication Type</InputLabel>
                          <Select defaultValue="" label="Authentication Type">
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="basic">HTTP Basic</MenuItem>
                            <MenuItem value="digest">HTTP Digest</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          disabled={activeTab !== 2}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          disabled={activeTab !== 2}
                        />
                      </Grid>
                    </Grid>
                  )*/}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Grid item>
                  <InputLabel>Request Timeout</InputLabel>
                </Grid>

                <FormControl fullWidth>
                  <Select
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                    label="Timeout"
                  >
                    <MenuItem value={10}>10 seconds</MenuItem>
                    <MenuItem value={20}>20 seconds</MenuItem>
                    <MenuItem value={30}>30 seconds</MenuItem>
                    <MenuItem value={40}>40 seconds</MenuItem>
                    <MenuItem value={50}>50 seconds</MenuItem>
                    <MenuItem value={60}>60 seconds</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Alert Contacts */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                Alert Contacts
              </Typography>
              <Box sx={{ width: '%75', display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="example@gmail.com"
                />
                <Button
                  variant="contained"
                  onClick={handleAddEmail}
                  disabled={!emailInput}
                >
                  Ekle
                </Button>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  onClick={handleClick}
                  startIcon={<EmailIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ width: '40%', justifyContent: 'space-between' }}
                >
                  {`${emailList.length} Mails`}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 300,
                      width: '20%',
                    },
                  }}
                >
                  {emailList.map((email, index) => (
                    <MenuItem
                      key={index}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <EmailIcon sx={{ color: '#607d8b' }} />
                      <Typography sx={{ flex: 1 }}>{email}</Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveEmail(email)
                        }}
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    </MenuItem>
                  ))}
                  {emailList.length === 0 && (
                    <MenuItem disabled>
                      <Typography color="text.secondary">
                        No email added yet
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            </Box>
            {/* Action Buttons */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => turnMonitorPage()}
              >
                Cancel
              </Button>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={()=>{update.update? updateMonitor() :createMonitor()}}>
                  {update.update?'Update Monitor':'Create Monitor'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}

export default newMonitorPage
