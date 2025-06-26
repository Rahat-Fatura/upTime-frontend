import React from "react";
import { Box, Typography, Tooltip, Chip } from "@mui/material";
import { CheckCircle, ErrorOutline } from "@mui/icons-material";

export default function MonitorDetail({ monitor }) {
  if (!monitor) return null;

  const logs = (monitor.logs || []).slice(-15);
  const total = monitor.logs?.length || 0;
  const successCount = monitor.logs?.filter((log) => log.status === "up").length || 0;
  const errorCount = monitor.logs?.filter((log) => log.status === "down" || log.isError).length || 0;
  const rate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  // Pulse animasyonunu globalde bir defa eklemeniz yeterli
  // (styled-components veya global css ile de eklenebilir)
  const pulseKeyframes = `
    @keyframes pulseAnim {
      0% { transform: scale(1); opacity: 0.7; }
      70% { transform: scale(1.7); opacity: 0; }
      100% { transform: scale(1.7); opacity: 0; }
    }
  `;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 4px 24px 0 rgba(25,118,210,0.08)",
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        position: "relative",
      }}
    >
      <style>{pulseKeyframes}</style>
      <Typography variant="h5" fontWeight={700} mb={1}>
        {monitor.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {monitor.httpMonitor?.host} <Chip label={monitor.httpMonitor?.method} size="small" sx={{ ml: 1 }} />
      </Typography>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Chip
          icon={<CheckCircle />}
          label={`Başarı Oranı: %${rate}`}
          color={rate >= 80 ? "success" : rate >= 50 ? "warning" : "error"}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          icon={<ErrorOutline />}
          label={`Toplam Log: ${total}`}
          color="info"
          sx={{ fontWeight: 600 }}
        />
      </Box>
      <Box mb={1}>
        <Typography fontWeight={600} fontSize={15} mb={1}>
          Son 15 Log
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {logs.map((log, idx) => {
            let color = "#bdbdbd";
            let pulseColor = "#e0e0e0";
            if (log.status === "up") {
              color = "#2e7d32";
              pulseColor = "rgba(46,125,50,0.3)";
            } else if (log.status === "down" || log.isError) {
              color = "#d32f2f";
              pulseColor = "rgba(211,47,47,0.3)";
            }
            return (
              <Tooltip
                key={log.id || idx}
                title={
                  <Box>
                    <Typography fontSize={13} fontWeight={600}>
                      Log Detay
                    </Typography>
                    <Typography fontSize={12}>
                      Durum: {log.status === "up" ? "Başarılı" : log.status === "down" ? "Başarısız" : "Belirsiz"}
                    </Typography>
                    <Typography fontSize={12}>Yanıt Süresi: {log.responseTime} ms</Typography>
                    <Typography fontSize={12}>Tarih: {log.createdAt}</Typography>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 22,
                    height: 22,
                    mx: 0.2,
                  }}
                >
                  {/* Pulse animasyon */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: pulseColor,
                      animation: "pulseAnim 1.6s infinite cubic-bezier(0.66,0,0,1)",
                      zIndex: 1,
                    }}
                  />
                  {/* Ana renkli yuvarlak */}
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: color,
                      border: "2px solid white",
                      boxShadow: `0 0 6px 0 ${color}`,
                      zIndex: 2,
                      position: "relative",
                      transition: "box-shadow 0.3s, filter 0.3s",
                      "&:hover": {
                        boxShadow: `0 0 12px 2px ${color}`,
                        filter: "brightness(1.15)",
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
      <Box mt={2}>
        <Typography fontSize={14} color="text.secondary">
          Başarılı: {successCount} &nbsp; | &nbsp; Hatalı: {errorCount}
        </Typography>
      </Box>
    </Box>
  );
}