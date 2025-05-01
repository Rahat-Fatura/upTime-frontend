/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
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
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Checkbox,
  InputLabel,
  Select,
  Divider,
  Tab,
  Tabs,
  IconButton,
  Avatar,
  Tooltip
} from '@mui/material';
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
  Email as EmailIcon
} from '@mui/icons-material';

const newMonitorPage = () => {
  const [monitorType, setMonitorType] = useState('http');
  const [friendlyName, setFriendlyName] = useState('');
  const [url, setUrl] = useState('');
  const [monitoringInterval, setMonitoringInterval] = useState(5);
  const [timeout, setTimeout] = useState(30);
  const [alertContacts, setAlertContacts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleMonitorTypeChange = (event) => {
    setMonitorType(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            New Monitor
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'orange' }}>U</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="500">
            New Monitor
          </Typography>

          {/* Monitor Type Selection */}
          <Box sx={{ mb: 4, mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              Monitor Type
            </Typography>
            <RadioGroup
              row
              value={monitorType}
              onChange={handleMonitorTypeChange}
            >
              <FormControlLabel 
                value="http" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PublicIcon sx={{ mr: 1, color: '#3f51b5' }} />
                    <Typography>HTTP(S)</Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value="ping" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon sx={{ mr: 1, color: '#4caf50' }} />
                    <Typography>Ping</Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value="port" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DeveloperBoardIcon sx={{ mr: 1, color: '#ff9800' }} />
                    <Typography>Port</Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value="keyword" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CodeIcon sx={{ mr: 1, color: '#e91e63' }} />
                    <Typography>Keyword</Typography>
                  </Box>
                } 
              />
            </RadioGroup>
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
                label={monitorType === 'http' ? 'URL (or IP)' : monitorType === 'ping' ? 'IP (or Host)' : monitorType === 'port' ? 'IP (or Host) : Port' : 'URL (or IP)'}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={monitorType === 'http' ? 'https://example.com' : monitorType === 'ping' ? '8.8.8.8' : monitorType === 'port' ? '8.8.8.8:53' : 'https://example.com'}
                helperText={monitorType === 'http' ? 'The URL to monitor including http:// or https://' : monitorType === 'ping' ? 'The IP address or hostname to ping' : monitorType === 'port' ? 'The IP and port to check in format IP:PORT' : 'The URL to check for keywords'}
              />
            </Grid>
          </Grid>

          {monitorType === 'http' && (
            <Box sx={{ mt: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab label="Basic Settings" />
                <Tab label="Advanced Settings" />
                <Tab label="Authentication" />
              </Tabs>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {activeTab === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Monitoring Interval</InputLabel>
                        <Select
                          value={monitoringInterval}
                          onChange={(e) => setMonitoringInterval(e.target.value)}
                          label="Monitoring Interval"
                        >
                          <MenuItem value={1}>1 minute</MenuItem>
                          <MenuItem value={5}>5 minutes</MenuItem>
                          <MenuItem value={10}>10 minutes</MenuItem>
                          <MenuItem value={15}>15 minutes</MenuItem>
                          <MenuItem value={30}>30 minutes</MenuItem>
                          <MenuItem value={60}>60 minutes</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timeout</InputLabel>
                        <Select
                          value={timeout}
                          onChange={(e) => setTimeout(e.target.value)}
                          label="Timeout"
                        >
                          <MenuItem value={10}>10 seconds</MenuItem>
                          <MenuItem value={30}>30 seconds</MenuItem>
                          <MenuItem value={60}>60 seconds</MenuItem>
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
                        defaultValue="GET"
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="HEAD">HEAD</MenuItem>
                        <MenuItem value="OPTIONS">OPTIONS</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Custom HTTP Headers"
                        multiline
                        rows={3}
                        placeholder="Header1:Value1&#10;Header2:Value2"
                        helperText="One header per line in format Header:Value"
                      />
                    </Grid>
                  </Grid>
                )}
                {activeTab === 2 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Authentication Type</InputLabel>
                        <Select
                          defaultValue=""
                          label="Authentication Type"
                        >
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
                )}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Alert Contacts */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              Alert Contacts
            </Typography>
            <FormGroup>
              <FormControlLabel 
                control={<Checkbox />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ mr: 1, color: '#607d8b' }} />
                    <Typography>example@email.com</Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                control={<Checkbox />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ mr: 1, color: '#607d8b' }} />
                    <Typography>alerts@company.com</Typography>
                  </Box>
                } 
              />
            </FormGroup>
            <Button 
              variant="text" 
              color="primary" 
              sx={{ mt: 1 }}
            >
              + Add/Edit Alert Contacts
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Monitor Status */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              Monitor Status
            </Typography>
            <FormGroup>
              <FormControlLabel 
                control={<Checkbox defaultChecked />} 
                label="Monitor is active" 
              />
            </FormGroup>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button variant="outlined" color="inherit">
              Cancel
            </Button>
            <Box>
              <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
                Create & New
              </Button>
              <Button variant="contained" color="primary">
                Create Monitor
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default newMonitorPage;