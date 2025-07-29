# 🔐 PANDUAN SETUP ENVIRONMENT VARIABLES DI VERCEL

## ❌ **Error yang Anda Alami:**
```
Environment Variable "SUPABASE_URL" references Secret "supabase-url", which does not exist.
```

## ✅ **SOLUSI LENGKAP:**

### **Langkah 1: Hapus env dari vercel.json** 
Saya sudah perbaiki file `vercel.json` dengan menghapus bagian `env` yang menyebabkan error.

### **Langkah 2: Set Environment Variables di Vercel Dashboard**

#### **A. Untuk API Project:**
1. Buka project API Anda di Vercel Dashboard
2. Masuk ke **Settings** → **Environment Variables**
3. Tambahkan satu per satu:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `HUGGINGFACE_API_KEY` | `hf_xxxxxxxxxxxxxxxxxxxx` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

#### **B. Cara Mendapatkan Keys:**

**Supabase Keys:**
1. Login ke https://supabase.com
2. Pilih project Anda
3. Masuk ke **Settings** → **API**
4. Copy:
   - **URL**: Project URL
   - **anon public**: untuk SUPABASE_ANON_KEY
   - **service_role**: untuk SUPABASE_SERVICE_ROLE_KEY

**HuggingFace API Key:**
1. Login ke https://huggingface.co
2. Masuk ke **Settings** → **Access Tokens**
3. Create new token dengan role **Read**
4. Copy token (format: `hf_xxxxxxxxx`)

### **Langkah 3: Redeploy Project**
Setelah set environment variables:
1. Kembali ke **Deployments** tab
2. Klik **Redeploy** pada deployment terakhir
3. Atau push commit baru ke repository

## 📋 **CHECKLIST SETUP:**

```
□ Environment variables dihapus dari vercel.json
□ SUPABASE_URL di-set di Vercel Dashboard
□ SUPABASE_ANON_KEY di-set di Vercel Dashboard  
□ SUPABASE_SERVICE_ROLE_KEY di-set di Vercel Dashboard
□ HUGGINGFACE_API_KEY di-set di Vercel Dashboard
□ NODE_ENV=production di-set untuk Production environment
□ Project di-redeploy setelah env variables di-set
```

## 🚨 **COMMON MISTAKES:**

### ❌ **Salah:**
- Menggunakan format `@secret-name` di vercel.json
- Copy-paste key yang terpotong
- Lupa set untuk environment yang benar
- Tidak redeploy setelah set env vars

### ✅ **Benar:**
- Set langsung di Vercel Dashboard
- Copy full key (jangan sampai terpotong)
- Set untuk semua environment (Production, Preview, Development)
- Redeploy setelah set env vars

## 🔍 **VERIFICATION:**

Setelah setup, test API dengan:
```
curl https://your-api-project.vercel.app/api/sentiment-agent
```

Jika masih error, cek:
1. Vercel Function Logs
2. Spelling environment variable names
3. Key values tidak ada spasi/newline
4. Project sudah di-redeploy

## 📞 **Troubleshooting:**

**Error: "Missing environment variable"**
→ Pastikan nama variable exact match (case sensitive)

**Error: "Invalid Supabase URL"**  
→ Pastikan URL format: https://xxxxx.supabase.co

**Error: "Unauthorized"**
→ Cek Supabase keys, pastikan project masih aktif

**Error: Function timeout**
→ Cek apakah semua dependencies ter-install dengan benar