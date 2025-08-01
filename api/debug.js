export default function handler(req, res) {
  res.status(200).json({
    status: 'success',
    message: 'Debug endpoint for FMAA API',
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlLength: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.length : 0
    },
    headers: req.headers,
    method: req.method,
    url: req.url
  });
}