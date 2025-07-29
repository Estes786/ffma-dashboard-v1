export default function handler(req, res) {
  res.status(200).json({
    status: 'success',
    message: 'FMAA API is running!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/sentiment-agent',
      '/api/recommendation-agent',
      '/api/performance-monitor',
      '/api/agent-factory'
    ]
  });
}
