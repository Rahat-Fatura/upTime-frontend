import React from "react";
import { Box, Grid, Typography, Tooltip, Chip, Button, useTheme, Divider } from "@mui/material";
import { CheckCircle, ErrorOutline } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sideBar/sideBar";
import MonitorStatus from "../../components/Animate/monitorStatus";
export default function MonitorDetail({ monitor }) {
  const [isOpen,setIsOpen] = useState(false);
  const theme=useTheme();
  const navigate = useNavigate();
  const toggleSidebar=()=>{
   setIsOpen(!isOpen);
  }
  return (
    <Grid container spacing={2}>
      <Grid item md={isOpen?2.3:0.75}>
        <Sidebar status={isOpen} toggleSidebar={toggleSidebar}/>
      </Grid>
      <Grid item md={isOpen?9.7:11.25}
        sx={{
           display: "flex",
           flexDirection: 'column',
           mt: 2,
           flexShrink: 0,
           flexGrow: 1,
        }}>
          {/*<Grid item md={3}>
              <Button variant="outlined" sx={{borderRadius:'5%', height: '2rem', borderColor: 'black', color: 'black'}} onClick={()=>{navigate('/user/monitors')}}> {'<'} Geri dön</Button>
          </Grid>*/}
          <Grid item md={12} sx={{mb:2}}>
          <Typography variant="h5" sx={{
            fontSize: {
                xs: '0.8rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.2rem',
                xlg: '1.5rem',
              },
              color: theme.palette.primary.main,
          }}>İzleme Detayı</Typography>
          <Divider/>
       </Grid>
       <Grid container spacing={1}>
          <Grid item md={12} sx={{
            display:'flex'
          }}>
            <Grid item md={3} justifyItems={'start'}>
                <Box>
                  <MonitorStatus sx={{width:25, height: 25, animeWidth: 18, animeHeight: 18}} status={'up'}/>
                </Box>
            </Grid>
            <Grid item md={4}>
              
            </Grid>
            <Grid item md={5}>
              
            </Grid>
          </Grid>
       </Grid>
      
       </Grid>
    </Grid>
    
  );
}