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
  const [isOpen, setIsOpen] = useState(true);
      const toggleSidebar = () => {
          setIsOpen(!isOpen);
        };
      return (
          <div>
              <Sidebar status={isOpen} toggleSidebar={toggleSidebar}/>
              <h1 style={{textAlign : 'center'}}>Team Members</h1>
          </div>
      );
}

export default TeamMembersPage
