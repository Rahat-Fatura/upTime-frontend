/* eslint-disable no-self-assign */
/* eslint-disable no-unused-vars */
import React from 'react';
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
  FormHelperText,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Language,
  Code as CodeIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
  Http as HttpIcon,
  RequestQuoteTwoTone,
} from '@mui/icons-material';
import { formSectionStyle, sectionTitleStyle } from '../styles/monitorStyles';
import { HTTP_METHODS, INTERVAL_UNITS, REPORT_TIME_UNITS } from '../constants/monitorConstants';

const MonitorForm = ({ formData, handleInputChange, hostError, isEdit = false }) => {
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
                helperText={!isEdit && "Sunucunuzu tanımlamak için benzersiz bir isim"}
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
                <FormHelperText>
                  Sunucunuza yapılacak istek türü
                </FormHelperText>
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
                error={!!hostError}
                helperText={hostError || 'Örnek: example.com veya 192.168.1.1'}
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
            fullWidth
            label="Body (JSON formatında)"
            name="body"
            value={formData.body || ''}
            onChange={handleInputChange}
            multiline
            rows={3}
            variant="outlined"
            size="small"
            helperText="POST, PUT veya PATCH istekleri için gönderilecek veri"
            InputProps={{
              startAdornment: (
                <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
              ),
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
              startAdornment: (
                <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
              ),
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
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Kontrol Aralığı"
                  name="interval"
                  value={formData.interval}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <TimerIcon sx={{ mr: 1, color: '#1976d2' }} />
                    ),
                  }}
                  helperText="Sunucu kontrol edilecek zaman aralığı"
                />
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Birim</InputLabel>
                  <Select
                    name="intervalUnit"
                    value={formData.intervalUnit || 'minutes'}
                    label="Birim"
                    onChange={handleInputChange}
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
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Raporlama Süresi"
                  name="report_time"
                  value={formData.report_time}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <CalendarIcon sx={{ mr: 1, color: '#1976d2' }} />
                    ),
                  }}
                  helperText={!isEdit && "Performans raporlarının oluşturulma sıklığı"}
                />
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Birim</InputLabel>
                  <Select
                    name="reportTimeUnit"
                    value={formData.reportTimeUnit || 'days'}
                    label="Birim"
                    onChange={handleInputChange}
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
  );
};

export default MonitorForm; 