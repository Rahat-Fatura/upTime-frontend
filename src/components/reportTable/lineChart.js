import { bgcolor } from '@mui/system'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// logs: [{ responseTime, createdAt, ... }]
export default function ResponseTimeLineChart({ logs }) {
  // Sadece son 250 logu göster
  const lastLogs = logs.length > 250 ? logs.slice(-250) : logs
  // Tarihleri daha okunabilir yapmak için yıl, ay, gün ve saat formatı
  const data = lastLogs.map(log => {
    const d = new Date(log.createdAt)
    const pad = (n) => n.toString().padStart(2, '0')
    const formatted = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    return {
      responseTime: log.responseTime,
      createdAt: formatted
    }
  })

  return (
    <ResponsiveContainer width="100%" height={350} sx={{bgcolor:'red'}}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="createdAt"
          tick={{ fontSize: 10 }}
          angle={-30}
          ticks={[
            data[0]?.createdAt,
            data[50]?.createdAt,
            data[100]?.createdAt,
            data[150]?.createdAt,
            data[200]?.createdAt,
            data[data.length - 1]?.createdAt,
          ]}
          textAnchor="end"
          height={70}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12 }} label={{ value: 'ms', angle: -90, position: 'insideLeft', fontSize: 12 }} />
        <Tooltip formatter={(value) => `${value} ms`} labelFormatter={label => `Zaman: ${label}`} />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="responseTime" name="Yanıt Süresi (ms)" stroke="#1976d2" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
