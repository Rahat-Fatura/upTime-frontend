import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sideBar/sideBar'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Public as PublicIcon,
  Timer as TimerIcon,
  DeveloperBoard as DeveloperBoardIcon,
  Code as CodeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

const TeamMembersPage = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [monitors, setMonitors] = useState([
    {
      id: 1,
      name: 'Website Monitor',
      url: 'https://example.com',
      type: 'http',
      status: 'up',
      uptime: '99.9%',
      lastChecked: '2 dakika önce',
    },
    {
      id: 2,
      name: 'API Endpoint',
      url: 'https://api.example.com',
      type: 'http',
      status: 'down',
      uptime: '98.5%',
      lastChecked: '5 dakika önce',
    },
    {
      id: 3,
      name: 'Database Server',
      url: '192.168.1.100',
      type: 'ping',
      status: 'up',
      uptime: '100%',
      lastChecked: '1 dakika önce',
    },
  ])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const getMonitorIcon = (type) => {
    switch (type) {
      case 'http':
        return <PublicIcon sx={{ color: '#3f51b5' }} />
      case 'ping':
        return <TimerIcon sx={{ color: '#4caf50' }} />
      case 'port':
        return <DeveloperBoardIcon sx={{ color: '#ff9800' }} />
      case 'keyword':
        return <CodeIcon sx={{ color: '#e91e63' }} />
      default:
        return <PublicIcon />
    }
  }

  const getStatusColor = (status) => {
    return status === 'up' ? 'success' : 'error'
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '240px' }}>
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Monitörler
            </Typography>
            <Tooltip title="Yenile">
              <IconButton color="inherit" sx={{ mr: 2 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Yeni Monitör
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {monitors.map((monitor) => (
              <Grid item xs={12} sm={6} md={4} key={monitor.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getMonitorIcon(monitor.type)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {monitor.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {monitor.url}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={monitor.status === 'up' ? 'Çalışıyor' : 'Çalışmıyor'}
                        color={getStatusColor(monitor.status)}
                        size="small"
                      />
                      <Chip
                        label={`Uptime: ${monitor.uptime}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Son kontrol: {monitor.lastChecked}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Yeni Monitör Ekle</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Monitör Tipi</InputLabel>
                  <Select label="Monitör Tipi">
                    <MenuItem value="http">HTTP(S)</MenuItem>
                    <MenuItem value="ping">Ping</MenuItem>
                    <MenuItem value="port">Port</MenuItem>
                    <MenuItem value="keyword">Keyword</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monitör Adı"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL veya IP Adresi"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button variant="contained" onClick={handleCloseDialog}>
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default TeamMembersPage
