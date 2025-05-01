/* eslint-disable no-self-assign */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Stack,
  Slider,
  FormHelperText,
} from '@mui/material'
import {
  Computer as ComputerIcon,
  Language,
  Code as CodeIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
  Http as HttpIcon,
  RequestQuoteTwoTone,
  Label,
} from '@mui/icons-material'
import { formSectionStyle, sectionTitleStyle } from '../../styles/monitorStyles'
import {
  HTTP_METHODS,
  INTERVAL_UNITS,
  REPORT_TIME_UNITS,
} from './constants/monitorConstants'

const MonitorForm = ({ formData, handleInputChange, isEdit = false }) => {
  const [intervalUnit, setIntervalUnit] = useState(isEdit ? formData.intervalUnit : 'minutes')
  const [intervalValue, setIntervalValue] = useState(5)
  const [min, setMin] = useState()
  const [max, setMax] = useState()

  const getIntervalLimits = (unit) => {
    switch (unit) {
      case 'seconds':
        setIntervalValue(20)
        setMin(20)
        setMax(59)
        return { min: 20, max: 59 }
      case 'minutes':
        setIntervalValue(1)
        setMin(1)
        setMax(59)
        return { min: 1, max: 59 }
      case 'hours':
        setIntervalValue(1)
        setMin(1)
        setMax(23)
        return { min: 1, max: 23 }
      default:
        return ;
    }
  }
  useEffect(() => {
    console.log('Interval Unit:', intervalUnit)
    console.log('Interval Value:', intervalValue)
    getIntervalLimits(intervalUnit)
  }, [intervalUnit])

  const [reportTimeUnit, setReportTimeUnit] = useState(isEdit ? formData.reportTimeUnit :'days')
  const [reportTimeValue, setReportTimeValue] = useState(5)
  const [reportTimeMin, setReportTimeMin] = useState()
  const [reportTimeMax, setReportTimeMax] = useState()

  const reportTimeLimits = (unit) => {
    switch (unit) {
      case 'hours':
        setReportTimeUnit('hours')
        setReportTimeValue(5)
        setReportTimeMin(1)
        setReportTimeMax(23)
        return ;
      case 'days':
        setReportTimeUnit('days')
        setReportTimeValue(5)
        setReportTimeMin(1)
        setReportTimeMax(30)
        return ;
      case 'weeks':
        setReportTimeUnit('weeks')
        setReportTimeValue(2)
        setReportTimeMin(1)
        setReportTimeMax(4)
        return ;
      case 'months':
        setReportTimeUnit('months')
        setReportTimeValue(1)
        setReportTimeMin(1)
        setReportTimeMax(12)
        return ;
      default:
        return ;
    }
  }
  useEffect(() => {
    console.log('Report Time Unit:', reportTimeUnit)
    console.log('Report Time Value:', reportTimeValue)
    reportTimeLimits(reportTimeUnit)
  }, [reportTimeUnit])
  return (
    <form>
      <Stack spacing={3}>
        <Box sx={formSectionStyle}>
          <Box sx={sectionTitleStyle}>
            <ComputerIcon />
            <Typography variant="h6">Temel Bilgiler</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Sunucu Adı"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <ComputerIcon sx={{ mr: 1, color: '#1976d2' }} />
                  ),
                }}
                helperText={
                  !isEdit && 'Sunucunuzu tanımlamak için benzersiz bir isim'
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Method</InputLabel>
                <Select
                  name="method"
                  value={formData.method}
                  label="Method"
                  onChange={handleInputChange}
                  variant="outlined"
                >
                  {HTTP_METHODS.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
                <HttpIcon
                  sx={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#1976d2',
                  }}
                />
              </FormControl>
              {!isEdit && (
                <FormHelperText>Sunucunuza yapılacak istek türü</FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box>

        <Box sx={formSectionStyle}>
          <Box sx={sectionTitleStyle}>
            <Language />
            <Typography variant="h6">Bağlantı Bilgileri</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Host"
                name="host"
                value={formData.host || ''}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                helperText={
                  'Örnek: https://www.example.com veya http://392.198.10.18'
                }
                InputProps={{
                  startAdornment: (
                    <ComputerIcon sx={{ mr: 1, color: '#1976d2' }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="İzin Verilen Status Kodları"
                name="allowedStatusCodes"
                value={
                  Array.isArray(formData.allowedStatusCodes)
                    ? formData.allowedStatusCodes.join(',')
                    : formData.allowedStatusCodes
                }
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                helperText="Virgülle ayırarak yazın (örn: 200,201,409)"
                InputProps={{
                  startAdornment: (
                    <RequestQuoteTwoTone sx={{ mr: 1, color: '#1976d2' }} />
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={formSectionStyle}>
          <Box sx={sectionTitleStyle}>
            <CodeIcon />
            <Typography variant="h6">İstek Detayları</Typography>
          </Box>
          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Body (JSON formatında)"
            name="body"
            value={
              typeof formData.body === 'object'
                ? JSON.stringify(formData.body)
                : formData.body
            }
            onChange={handleInputChange}
            multiline
            rows={3}
            variant="outlined"
            size="small"
            helperText="POST, PUT veya PATCH istekleri için gönderilecek veri"
            InputProps={{
              startAdornment: <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />,
            }}
          />

          <TextField
            fullWidth
            label="Headers (JSON formatında)"
            name="headers"
            value={
              typeof formData.headers === 'object'
                ? JSON.stringify(formData.headers)
                : formData.headers
            }
            onChange={handleInputChange}
            multiline
            rows={2}
            variant="outlined"
            size="small"
            helperText="İsteğe bağlı HTTP başlıkları"
            InputProps={{
              startAdornment: <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />,
            }}
          />
        </Box>

        <Box sx={formSectionStyle}>
          <Box sx={sectionTitleStyle}>
            <TimerIcon />
            <Typography variant="h6">Zamanlama Ayarları</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={1} md={1} sm={1} lg={1}>
                    <TimerIcon sx={{ mr: 1, color: '#1976d2' }} />
                  </Grid>
                  <Grid item sx={11} md={11} sm={11} lg={11}>
                    <Grid item>
                      <Typography variant="body2" sx={{ color: 'text.secondary' ,mb: 1 }}>
                        Kontrol Aralığı
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Slider
                        name="interval"
                        value={formData.interval}
                        onChange={handleInputChange}
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
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{ color: 'text.secondary' ,mb: 1 }}>
                        Sunucu kontrol edilecek zaman aralığı
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <FormControl sx={{ minWidth: 120, mt: 3 }} size="small">
                  <InputLabel>Birim</InputLabel>
                  <Select
                    name="intervalUnit"
                    value={formData.intervalUnit || 'minutes'}
                    label="Birim"
                    onChange={(e) => {
                      setIntervalUnit(e.target.value)
                      handleInputChange(e)
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
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={1} md={1} sm={1} lg={1}>
                    <CalendarIcon sx={{ mr: 1, color: '#1976d2' }} />
                  </Grid>
                  <Grid item sx={11} md={11} sm={11} lg={11}>
                    <Grid item>
                      <Typography variant="body2" sx={{ color: 'text.secondary' ,mb: 1 }}>
                        Raporlama Süresi
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Slider
                        name="reportTime"
                        value={formData.reportTime}
                        onChange={handleInputChange}
                        min={reportTimeMin}
                        max={reportTimeMax}
                        step={1} // Her tıklamada 1 artar/azalır
                        valueLabelDisplay="auto" // Değeri üzerinde gösterir
                        marks={[
                          { value: reportTimeMin, label: `${reportTimeMin}` }, // Min değeri etiketliyor
                          { value: reportTimeMax, label: `${reportTimeMax}` }, // Max değeri etiketliyor
                        ]}
                        sx={{ color: '#1976d2' }} // Mavi renk
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{ color: 'text.secondary' ,mb: 1 }}>
                          Performans raporlarının oluşturulma sıklığı
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <FormControl sx={{ minWidth: 120, mt: 3}} size="small">
                  <InputLabel>Birim</InputLabel>
                  <Select
                    name="reportTimeUnit"
                    value={formData.reportTimeUnit || 'days'}
                    label="Birim"
                    onChange={(e) => {
                      setReportTimeUnit(e.target.value)
                      handleInputChange(e)
                    }}
                    variant="outlined"
                  >
                    {REPORT_TIME_UNITS.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </form>
  )
}

export default MonitorForm
