# Panopticron Demo

**Offline Demo Version of the Panopticron Project Monitoring Dashboard**

This repository contains a presentation-ready demo of [Panopticron](https://github.com/borndigitalbe/panopticron), a comprehensive project monitoring dashboard designed for digital product studios managing multiple client projects.

## 🎯 Demo Purpose

Created for jury presentations and demonstrations, this version showcases Panopticron's capabilities with:
- **Offline functionality** - No internet connection required
- **Realistic mock data** - 8 diverse client projects with authentic priority patterns
- **Bypassed authentication** - Direct access to all features
- **Production-like behavior** - Based on real Panopticron usage patterns

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the demo server
npm run dev

# Access the demo at http://localhost:3000
```

### Demo Flow Routes
1. **`/landing-page`** - Project introduction and context
2. **`/dashboard`** - Main project monitoring overview
3. **`/projects`** - Detailed project list and management
4. **`/status`** - System health and worker monitoring

## ✨ Key Demo Features

### Project Priority System
- **Critical Projects** (50-500): Urgent attention required
- **High Priority** (1000-3000): Active development focus
- **Medium Priority** (4000-7000): Stable progress
- **Healthy Projects** (8000+): Running smoothly

### Realistic Mock Data
- **8 Client Projects** across FinTech, E-commerce, Healthcare, etc.
- **Priority History Charts** showing realistic Vercel/GitHub status changes
- **Manual Override Examples** demonstrating priority management
- **Worker Run Status** with GitHub sync, deployment monitoring

### Interactive Features
- **Lifeline Charts** - Visual priority history over time
- **Collapsible Project Details** - Comprehensive project information
- **Real-time Status Indicators** - GitHub CI, Vercel deployments
- **Manual Priority Overrides** - Business-critical escalation examples

## 🎭 Demo Configuration

Demo mode is enabled via environment variables in `.env.local`:

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_OFFLINE_MODE=true
```

## 📊 Mock Data Highlights

### Featured Projects
- **TechFlow Dashboard V2** - Stable, high-performing project (8800 priority)
- **Global Retail Mobile App** - Critical project with deployment issues (150 priority, manual override)
- **Creative Minds CMS** - Healthy project with urgent security audit (50 priority, manual override)
- **MedTech Patient Portal** - HIPAA-compliant healthcare project (6500 priority)
- **Green Energy Portal** - Nonprofit environmental project (4200 priority)

### Priority History Patterns
Based on production Panopticron data:
- **10000** → **2000** for deployment errors (`READY` → `ERROR`)
- **10000** → **9000** for build states (`READY` → `BUILDING`)
- **Manual overrides** for business-critical escalations
- **Realistic timestamps** and state change reasons

## 🛠 Technical Stack

- **Frontend**: React, Next.js 14, TypeScript
- **UI Framework**: Material-UI with custom theming
- **Admin Framework**: Refine for rapid dashboard development
- **Charts**: Recharts for priority lifeline visualization
- **Mock Data**: Comprehensive offline data providers
- **Deployment**: Vercel-ready configuration

## 🎨 Design Features

- **Dark Theme** - Professional presentation appearance
- **Responsive Design** - Works on various screen sizes
- **JetBrains Mono** - Monospace font for technical aesthetics
- **Color-coded Priorities** - Visual hierarchy for project urgency
- **Smooth Animations** - Professional presentation experience

## 📋 Demo Testing

Run the complete demo test checklist:

```bash
# Test all demo routes
curl http://localhost:3000/landing-page
curl http://localhost:3000/dashboard
curl http://localhost:3000/projects
curl http://localhost:3000/status

# Test priority history API
curl "http://localhost:3000/api/project-priority-history?project_id=project-1"
```

## 🔗 Related Projects

- **[Main Panopticron](https://github.com/borndigitalbe/panopticron)** - Production version
- **[Presentation Materials](./presentation_breadcrumbs.md)** - 15-minute presentation guide

## 📄 License

MIT License - Built for demonstration and educational purposes.

---

**Built by [QRY Labs](https://github.com/QRY91)** | *Transforming development work into visible achievements*