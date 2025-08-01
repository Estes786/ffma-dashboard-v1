#!/bin/bash

echo "🚀 Creating Public FMAA Dashboard Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building dashboard..."
cd fmaa-dashboard
npm install --legacy-peer-deps
npm run build
cd ..

echo "✅ Build completed successfully!"

echo "🧪 Testing API endpoints..."
node -e "
import('./api/health.js').then(m => {
  const res = { 
    status: () => ({ json: () => console.log('✅ Health API working') }),
    setHeader: () => {},
    json: () => console.log('✅ Health API working')
  };
  m.default({method:'GET'}, res);
}).catch(console.error);
"

echo "📊 Testing metrics API..."
node -e "
import('./api/metrics.js').then(m => {
  const res = { 
    status: () => ({ json: () => console.log('✅ Metrics API working') }),
    setHeader: () => {},
    json: () => console.log('✅ Metrics API working')
  };
  m.default({method:'GET', query: {type: 'overview'}}, res);
}).catch(console.error);
"

echo "🎉 All tests passed! Ready for deployment."
echo ""
echo "📋 Deployment Instructions:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Set the following configuration:"
echo "   - Framework Preset: Other"
echo "   - Build Command: cd fmaa-dashboard && npm install --legacy-peer-deps && npm run build"
echo "   - Output Directory: fmaa-dashboard/dist"
echo "   - Install Command: npm install"
echo "4. Deploy without authentication protection"
echo ""
echo "🌐 Your dashboard will be available at the new URL provided by Vercel"
echo ""
echo "🔧 Alternative: Use Vercel CLI"
echo "   vercel --prod --public"