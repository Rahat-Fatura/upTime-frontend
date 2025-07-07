import { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  useTheme,
  LinearProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'   
import Paper from '@mui/material/Paper'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const ReportTable = ({ stats }) => {
  const theme = useTheme()

  const chartData = () => [
    { name: 'Başarılı', value: stats.upLogs, color: '#4caf50' },
    { name: 'Başarısız', value: stats.downLogs, color: '#f44336' },
  ]
  const StatCard = styled(Card)(({ theme }) => ({
    borderRadius: 11,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  }))

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize:13
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 11,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    '&:hover': {
      //backgroundColor: theme.palette.action.selected,
      backgroundColor: '#7296f7bd'
    },
  }))


  const turnHost= (monitor) =>{
    switch(monitor.monitorType){
      case 'httpMonitor':{
        return monitor.httpMonitor.host
      }
      case 'pingMonitor':{
        return monitor.httpMonitor.host
      }
      case 'portMonitor':{
        return monitor.httpMonitor.host
      }
      case 'keywordMonitor':{
        return monitor.httpMonitor.host
      }
      case 'cronjobMonitor':{
        return monitor.httpMonitor.host
      }
      default:{
        break;
      }
    }
  }

  return stats?(
    <Grid container /*spacing={{ xs: 2, sm: 3, md: 4, lg: 8 }}*/>
      <Grid md={12}>
        <Card
          sx={{
           backgroundColor: '#ffff',
           width: '100%'
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.8rem',
                  xlg: '1rem',
                },
              }}
            >
              Sistem Performansı
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              gutterBottom
              sx={{
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.8rem',
                  xlg: '1rem',
                },
                wordBreak: 'break-all',
              }}
            >
              {/*turnHost(monitor)*/}
            </Typography>

            <Box sx={{ height: 180, mt: 1, justifyContent: 'start' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={theme.palette.primary.main}>
                    {chartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Metrik</StyledTableCell>
                    <StyledTableCell align="right">Değer</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>Toplam İstek</StyledTableCell>
                    <StyledTableCell align="right">
                      {stats.totalLogs}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell>Başarılı İstek</StyledTableCell>
                    <StyledTableCell align="right">
                      {stats.upLogs}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell>Başarısız İstek</StyledTableCell>
                    <StyledTableCell align="right">
                      {stats.downLogs}
                    </StyledTableCell>
                  </StyledTableRow>
                  {/*<StyledTableRow>
                    <StyledTableCell>Ortalama Yanıt Süresi</StyledTableCell>
                    <StyledTableCell align="right">
                      {avgResponseTime} ms
                    </StyledTableCell>
                  </StyledTableRow>*/}
                  <StyledTableRow>
                    <StyledTableCell>Başarı Oranı</StyledTableCell>
                    <StyledTableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(stats.uptime)}
                          sx={{
                            flexGrow: 1,
                            backgroundColor: '#ffcdd2',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#4caf50',
                            },
                          }}
                        />
                        <Typography variant="body2">
                          {stats.uptime}%
                        </Typography>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', p: 0.5 }}></CardActions>
        </Card>
      </Grid>
    </Grid>
  ):(<div></div>)
}

export default ReportTable
