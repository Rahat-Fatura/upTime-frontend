const handleRequest = async (page) => {
  try {
    setLoadingRequests(prev => ({ ...prev, [page.id]: true }));
    const response = await api.post('monitor/instant-Control', {
      name: page.name,
      method: page.method,
      host: page.host,
      body: page.body,
      headers: page.headers,
      allowedStatusCodes: page.allowedStatusCodes
    });
    
    setRequestResults(prev => ({
      ...prev,
      [page.id]: {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        responseTime: response.config?.transitional?.requestStart ? 
          Date.now() - response.config.transitional.requestStart : 'N/A',
        timestamp: new Date().toLocaleTimeString()
      }
    }));
  } catch (error) {
    setRequestResults(prev => ({
      ...prev,
      [page.id]: {
        status: 'error',
        message: error.message,
        timestamp: new Date().toLocaleTimeString()
      }
    }));
  } finally {
    setLoadingRequests(prev => ({ ...prev, [page.id]: false }));
  }
};

                  <Collapse in={!!requestResults[page.id]}>
                    <Box sx={{ mt: 1 }}>
                      {requestResults[page.id]?.status === 200 ? (
                        <Alert 
                          icon={<CheckCircleIcon fontSize="inherit" />} 
                          severity="success"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            '& .MuiAlert-icon': { color: '#4caf50' }
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Başarılı!
                              </Typography>
                              <Chip 
                                label={`${requestResults[page.id].status} ${requestResults[page.id].statusText}`}
                                size="small"
                                sx={{ backgroundColor: '#4caf50', color: 'white' }}
                              />
                            </Box>
                            
                            <Box sx={{ 
                              backgroundColor: theme.palette.grey[100],
                              p: 1,
                              borderRadius: 1,
                              mt: 1
                            }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Yanıt Başlıkları:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {Object.entries(requestResults[page.id].headers).map(([key, value]) => (
                                  <Chip
                                    key={key}
                                    label={`${key}: ${value}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Yanıt Süresi: {requestResults[page.id].responseTime}ms
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Son kontrol: {requestResults[page.id].timestamp}
                              </Typography>
                            </Box>
                          </Box>
                        </Alert>
                      ) : requestResults[page.id]?.status === 'error' ? (
                        <Alert 
                          icon={<ErrorIcon fontSize="inherit" />} 
                          severity="error"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            '& .MuiAlert-icon': { color: '#f44336' }
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2">
                              Hata: {requestResults[page.id].message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Son kontrol: {requestResults[page.id].timestamp}
                            </Typography>
                          </Box>
                        </Alert>
                      ) : (
                        <Alert 
                          icon={<ErrorIcon fontSize="inherit" />} 
                          severity="warning"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            '& .MuiAlert-icon': { color: '#ff9800' }
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2">
                              Beklenmeyen Durum Kodu: {requestResults[page.id].status}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Son kontrol: {requestResults[page.id].timestamp}
                            </Typography>
                          </Box>
                        </Alert>
                      )}
                    </Box>
                  </Collapse> 