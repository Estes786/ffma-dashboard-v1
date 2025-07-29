# FMAA - Federated Micro-Agents Architecture

🚀 **Sistem Manajemen dan Analitik Keuangan Berbasis Micro-Agents**

## Overview

FMAA (Federated Micro-Agents Architecture) adalah sistem analitik keuangan modern yang menggunakan arsitektur micro-agents untuk memberikan layanan analitik yang scalable, reliable, dan intelligent. Sistem ini menggabungkan teknologi AI dengan arsitektur microservices untuk menghasilkan platform yang powerful dan user-friendly.

## ✨ Fitur Utama

- **🤖 Intelligent Agents**: Sentiment Analysis, Recommendation Engine, Performance Monitoring
- **📊 Real-time Dashboard**: Interactive charts dan metrics dengan live updates
- **🔍 Advanced Analytics**: Comprehensive performance tracking dan business intelligence
- **🛡️ Security**: JWT authentication, role-based access control, audit logging
- **📱 Responsive Design**: Mobile-friendly interface dengan modern UI/UX
- **⚡ High Performance**: Optimized untuk high-throughput analytics workloads

## 🏗️ Arsitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Agent Factory  │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼         ▼         ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ Sentiment   │ │Recommendation│ │Performance  │
            │ Agent       │ │ Agent        │ │ Monitor     │
            └─────────────┘ └─────────────┘ └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau pnpm
- Git

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd fmaa-ecosystem
```

2. **Install dependencies**
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd fmaa-dashboard
pnpm install
```

3. **Setup database**
```bash
# Create database schema
sqlite3 database/fmaa.db < database/schema.sql
```

4. **Start development servers**

Backend:
```bash
npm run dev
```

Frontend:
```bash
cd fmaa-dashboard
pnpm run dev
```

5. **Access dashboard**
```
http://localhost:5173
```

## 📁 Struktur Proyek

```
fmaa-ecosystem/
├── api/                    # Backend API dan agents
│   ├── agent-factory.js    # Agent management
│   ├── sentiment-agent.js  # Sentiment analysis
│   ├── recommendation-agent.js
│   ├── performance-monitor.js
│   └── utils/             # Utility functions
├── database/              # Database schema dan migrations
├── fmaa-dashboard/        # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/          # Utilities
└── docs/                  # Documentation
```

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env` di root directory:

```env
# Database
DATABASE_URL=./database/fmaa.db

# API Configuration
API_PORT=3000
API_HOST=0.0.0.0

# JWT Secret
JWT_SECRET=your-secret-key

# Hugging Face API (optional)
HUGGINGFACE_API_KEY=your-api-key
```

### Agent Configuration

Agents dapat dikonfigurasi melalui dashboard Settings atau langsung dalam kode:

```javascript
const agentConfig = {
  maxConcurrentTasks: 10,
  timeout: 30000,
  retryAttempts: 3
};
```

## 📊 Dashboard Features

### 🏠 Dashboard Utama
- Real-time system metrics
- Performance trends
- Agent status overview
- Recent activity feed

### 🤖 Agent Management
- Agent registry dan status
- Performance monitoring
- Configuration management
- Health checks

### 📋 Task Management
- Task queue monitoring
- Execution history
- Priority management
- Error tracking

### 📈 Analytics & Metrics
- Performance analytics
- Business intelligence
- Custom reports
- Data export

### 📝 Logs & Monitoring
- System logs
- Error tracking
- Audit trail
- Real-time monitoring

### ⚙️ Settings
- System configuration
- User management
- Security settings
- Integration setup

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
cd fmaa-dashboard
pnpm test

# Backend tests
npm run test:backend

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd fmaa-dashboard
pnpm run build

# Start production server
npm run start
```

### Docker Deployment

```bash
# Build dan run dengan Docker
docker-compose up -d
```

## 📚 Documentation

- [📖 Implementation Guide](./FMAA_Implementation_Documentation.md) - Dokumentasi lengkap implementasi
- [🔧 API Documentation](./docs/api.md) - API endpoints dan schemas
- [🎨 UI Components](./docs/components.md) - Frontend component library
- [🗄️ Database Schema](./docs/database.md) - Database design dan migrations

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🆘 Support

- 📧 Email: support@fmaa.dev
- 💬 Discord: [FMAA Community](https://discord.gg/fmaa)
- 📖 Wiki: [GitHub Wiki](https://github.com/fmaa/wiki)
- 🐛 Issues: [GitHub Issues](https://github.com/fmaa/issues)

## 🙏 Acknowledgments

- [React](https://react.dev/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [Recharts](https://recharts.org/) - Chart library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library

---

**Made with ❤️ by Manus AI**

*FMAA - Empowering Financial Analytics with Intelligent Micro-Agents*

# ffma-dashboard-v1
