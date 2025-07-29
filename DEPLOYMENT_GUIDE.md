# 🚀 FMAA Deployment Guide

## Masalah yang Sudah Diperbaiki

### ✅ **Perbaikan yang Dilakukan:**

1. **Dependencies Issues** - Semua dependencies dashboard sudah terinstall dengan `--legacy-peer-deps`
2. **Tailwind CSS** - Sudah ditambahkan import yang diperlukan ke `index.css`
3. **Vercel Configuration** - Split menjadi 2 deployment terpisah (API + Frontend)
4. **Environment Variables** - Template sudah dibuat
5. **Build Process** - Sudah ditest dan berhasil

## 📋 Langkah Deployment di Vercel

### **Opsi 1: Deploy Terpisah (RECOMMENDED)**

#### **A. Deploy API Backend:**
1. Buat project baru di Vercel untuk API
2. Connect ke repository Anda
3. Set Root Directory ke: `./` (root)
4. Gunakan `vercel.json` yang di root
5. Set Environment Variables di Vercel Dashboard:
   ```
   SUPABASE_URL=your_actual_supabase_url
   SUPABASE_ANON_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_key
   HUGGINGFACE_API_KEY=your_actual_huggingface_key
   NODE_ENV=production
   ```

#### **B. Deploy Frontend Dashboard:**
1. Buat project baru di Vercel untuk Dashboard
2. Connect ke repository yang sama
3. Set Root Directory ke: `./fmaa-dashboard`
4. Gunakan `vercel.json` yang di dalam folder `fmaa-dashboard`
5. Set Build Command: `npm run build`
6. Set Install Command: `npm install --legacy-peer-deps`

### **Opsi 2: Deploy Monorepo (Alternative)**

Jika ingin deploy sebagai satu project:

1. Gunakan vercel.json yang ada di root
2. Set Build Command: `npm install && cd fmaa-dashboard && npm install --legacy-peer-deps && npm run build`
3. Set Output Directory: `fmaa-dashboard/dist`

## 🔧 Troubleshooting

### **Error: Dependencies Conflict**
```bash
cd fmaa-dashboard
npm install --legacy-peer-deps
```

### **Error: Tailwind CSS not working**
Pastikan `fmaa-dashboard/src/index.css` berisi:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### **Error: Environment Variables**
1. Buat Supabase project dulu di https://supabase.com
2. Get API keys dari Supabase Dashboard > Settings > API
3. Get HuggingFace API key dari https://huggingface.co/settings/tokens
4. Set di Vercel Dashboard > Project Settings > Environment Variables

### **Error: API Routes not working**
Pastikan file API ada di folder `api/` dan vercel.json menggunakan:
```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 📂 Struktur File yang Benar

```
fmaa-ecosystem/
├── api/                          # Backend API
│   ├── agent-factory.js
│   ├── performance-monitor.js
│   ├── recommendation-agent.js
│   ├── sentiment-agent.js
│   └── utils/
├── fmaa-dashboard/               # Frontend React
│   ├── src/
│   │   ├── index.css            # ✅ Fixed Tailwind
│   │   └── ...
│   ├── package.json
│   └── vercel.json              # ✅ Frontend config
├── database/
│   └── schema.sql
├── package.json                 # Root dependencies
├── vercel.json                  # ✅ API config
├── .env.example                 # ✅ Environment template
└── DEPLOYMENT_GUIDE.md          # This file
```

## 🌐 URLs Setelah Deploy

- **API Endpoint**: `https://your-api-project.vercel.app/api/`
- **Dashboard**: `https://your-dashboard-project.vercel.app/`

## 🔐 Environment Variables Required

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
HUGGINGFACE_API_KEY=hf_xxxx...
NODE_ENV=production
```

## ✅ Verification Checklist

- [ ] Dependencies installed without errors
- [ ] Build completes successfully
- [ ] Environment variables set
- [ ] API endpoints accessible
- [ ] Frontend loads without errors
- [ ] Database connection works
- [ ] Tailwind CSS styling appears

## 🆘 Support

Jika masih ada error, cek:
1. Vercel deployment logs
2. Browser console untuk frontend errors
3. API endpoint responses dengan tools seperti Postman
4. Environment variables spelling dan values