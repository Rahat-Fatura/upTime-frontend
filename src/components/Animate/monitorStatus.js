import { useState } from 'react'
import { Typography, Box } from '@mui/material'

const MonitorStatus = ({ sx, status }) => {
    console.log("Status",status)
  let color;
  let pulseColor;
  let text;
  if (status === 'up') {
    color = '#2e7d32'
    pulseColor = 'rgba(46,125,50,0.3)'
    text = 'Çalışıyor'
  } else if (status=== 'down') {
    color = '#d32f2f'
    pulseColor = 'rgba(211,47,47,0.3)'
    text = 'Çalışmıyor'
  } else if (status === 'maintanance') {
    color = '#bdbdbd'
    pulseColor = '#e0e0e0'
    text= 'Bakım'
  }
  else {
    color = '#ed6c02'
    text= 'Bakım'
    pulseColor = 'rgba(247, 226, 43, 1)'
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,justifyContent:"center", sx }}>

        {/* Pulse animasyon */}
        <Box
          sx={{
            position: 'absolute',
            width: sx.animeWidth?sx.animeWidth: 12,
            height: sx.animeHeight?sx.animeHeight: 12,
            borderRadius: '50%',
            background: pulseColor,
            animation: 'pulseAnim 1.6s infinite cubic-bezier(0.66,0,0,1)',
            zIndex: 1,
            '@keyframes pulseAnim': {
                        '0%': { transform: 'scale(1.1)', opacity: 1 },
                        '5%': { transform: 'scale(1.2)', opacity: 0.95 },
                        '10%': { transform: 'scale(1.3)', opacity: 0.9 },
                        '20%': { transform: 'scale(1.4)', opacity: 0.87 },
                        '30%': { transform: 'scale(1.5)', opacity: 0.8 },
                        '40%': { transform: 'scale(1.6)', opacity: 0.77 },
                        '50%': { transform: 'scale(1.7)', opacity: 0.70 },
                        '60%': { transform: 'scale(1.8)', opacity: 0.66 },
                        '70%': { transform: 'scale(1.9)', opacity: 0.6 },
                        '80%': { transform: 'scale(2.1)', opacity: 0.55 },
                        '90%': { transform: 'scale(2.2)', opacity: 0.53 },
                        '100%': { transform: 'scale(2.3)', opacity: 0.5 },
                      },
         
          }}
        />
        {/* Ana renkli yuvarlak */}
        <Box
          sx={{
            width: sx.width?sx.width: 12,
            height: sx.height?sx.height: 12,
            borderRadius: '50%',
            background: color,
            border: '2.5px solid white',
            boxShadow: '0 0 8px 0 ' + color,
            zIndex: 1,
            position: 'relative',
            transition: 'box-shadow 0.3s, filter 0.3s',
          }}
        />

    </Box>
  )
}

export default MonitorStatus
