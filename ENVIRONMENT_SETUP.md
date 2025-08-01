# 🔧 Environment Variables Setup

## ✅ **Environment Variables yang Perlu Di-Set:**

### Step 1: Di Vercel Dashboard
1. Go to project settings
2. Click "Environment Variables"
3. Add these variables:

### Required Variables:
```
VITE_API_BASE_URL=/api
```

### Optional Variables (untuk real data):
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
```

## 📋 **Step-by-Step Setup:**

### 1. **VITE_API_BASE_URL** (Required)
```
Name: VITE_API_BASE_URL
Value: /api
Environment: Production, Preview, Development
```

### 2. **Supabase Variables** (Optional - untuk real data)
```
Name: SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development

Name: SUPABASE_SERVICE_ROLE_KEY
Value: your_service_role_key_here
Environment: Production, Preview, Development
```

## 🎯 **What Each Variable Does:**

### VITE_API_BASE_URL
- **Purpose**: Tells React app where to find API endpoints
- **Value**: `/api` (for relative URLs)
- **Required**: ✅ Yes (untuk API integration)

### SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY
- **Purpose**: Untuk real database data (optional)
- **Default**: Mock data akan digunakan jika tidak di-set
- **Required**: ❌ No (dashboard tetap bekerja dengan mock data)

## 🔧 **How to Set in Vercel:**

### Method 1: Dashboard
1. Go to project settings
2. Click "Environment Variables"
3. Add each variable
4. Click "Save"
5. Redeploy

### Method 2: During Project Creation
1. When creating new project
2. Scroll to "Environment Variables" section
3. Add variables there
4. Deploy with variables set

## 📊 **Expected Result:**

### With VITE_API_BASE_URL set:
- ✅ **API calls work** - Dashboard connects to endpoints
- ✅ **Real-time data** - Metrics update properly
- ✅ **Error handling** - Graceful fallbacks

### Without Supabase variables:
- ✅ **Dashboard still works** - Uses mock data
- ✅ **All features functional** - No database needed
- ✅ **Beautiful UI** - Full functionality

## 🎉 **Quick Setup:**

### Minimal Setup (Recommended):
```
VITE_API_BASE_URL=/api
```

### Full Setup (Optional):
```
VITE_API_BASE_URL=/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

## 🚀 **After Setting Variables:**

1. **Redeploy** project
2. **Test API** endpoints
3. **Check dashboard** functionality
4. **Enjoy** working dashboard!

**Set environment variables and your dashboard will be perfect!** 🎉