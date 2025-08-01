export default function handler(req, res) {
  // Serve basic HTML for testing
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>FMAA Dashboard - Root Test</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            .status { color: green; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>🚀 FMAA Dashboard Root</h1>
        <div class="status">✅ API Server is working!</div>
        <p>Current time: ${new Date().toISOString()}</p>
        <p>Environment: ${process.env.NODE_ENV || 'unknown'}</p>
        <hr>
        <h3>Available Links:</h3>
        <ul>
            <li><a href="/api/health">Health Check</a></li>
            <li><a href="/api/debug">Debug Info</a></li>
            <li><a href="/api/metrics">Metrics API</a></li>
        </ul>
        <hr>
        <p><strong>Note:</strong> If you see this page, it means the API is working but there might be an issue with the React app serving.</p>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}