# Panopticron Demo Setup Guide

**Quick deployment guide for presentation-ready demo**

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js 18+** and npm
- **Git** for cloning the repository

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/QRY91/panopticron-demo.git
cd panopticron-demo

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Start the demo
npm run dev
```

**🎯 Demo ready at: http://localhost:3000**

## 🎭 Demo Configuration

The demo is pre-configured with:
- ✅ **Offline mode** - No internet required
- ✅ **Auth disabled** - Direct access to all features  
- ✅ **Mock data** - 8 realistic client projects
- ✅ **Working APIs** - Priority history and lifeline charts

### Environment Variables (.env.local)
```bash
# Required for demo functionality
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_OFFLINE_MODE=true
```

## 🎬 Presentation Flow

### Recommended Demo Route Order
1. **`/landing-page`** - Project introduction (2 min)
2. **`/dashboard`** - Main monitoring overview (3 min)  
3. **`/projects`** - Project management interface (2 min)
4. **`/status`** - System health monitoring (1 min)

### Key Demo Features to Highlight
- **Priority System**: Low numbers = urgent, high numbers = healthy
- **Lifeline Charts**: Click project rows to expand priority history
- **Manual Overrides**: Project-2 and Project-4 show business escalations
- **Real-time Status**: GitHub CI and Vercel deployment indicators
- **Interactive Navigation**: Smooth transitions between all sections

## 📊 Mock Data Overview

### Featured Projects
- **Global Retail Mobile App** (150 priority) - Critical with manual override
- **Creative Minds CMS** (50 priority) - Healthy project escalated for security audit
- **TechFlow Dashboard** (8800 priority) - Stable, well-performing
- **MedTech Patient Portal** (6500 priority) - Healthcare compliance focus
- **Green Energy Portal** (4200 priority) - Environmental nonprofit

### Priority Patterns
Based on production Panopticron data:
- **Critical errors**: 10000 → 2000 (Vercel READY → ERROR)
- **Build states**: 10000 → 9000 (Vercel READY → BUILDING)  
- **CI failures**: 10000 → 9500 (GitHub success → failure)
- **Manual escalations**: Any score → 50-150 for business priority

## 🔧 Troubleshooting

### Common Issues

**Port 3000 already in use?**
```bash
# Use different port
npm run dev -- -p 3003
# Access at http://localhost:3003
```

**Lifeline charts not loading?**
```bash
# Ensure API endpoint is working
curl "http://localhost:3000/api/project-priority-history?project_id=project-1"
# Should return JSON array of priority history
```

**Missing favicons?**
```bash
# Verify favicon files exist
ls public/favicon*
# Should show: favicon.ico, favicon-16x16.png, favicon-32x32.png
```

### Reset Demo Data
The demo uses static mock data - no reset needed. Simply refresh the browser.

## 🎯 Presentation Tips

### Timing (15-minute presentation)
- **3 min**: Problem setup on landing page
- **5 min**: Dashboard demo showing priority system
- **4 min**: Project details and lifeline charts
- **2 min**: Status monitoring and integrations  
- **1 min**: Wrap-up and value proposition

### Talking Points
- **Priority Logic**: "Lower numbers mean higher urgency - think of it as project health where low scores need immediate attention"
- **Manual Overrides**: "Business needs sometimes override technical health - here's how we handle client escalations"
- **Real Integrations**: "This connects to actual GitHub and Vercel APIs in production"
- **Scalability**: "Built on modern React/Next.js stack for enterprise deployment"

### Demo Flow Tips
1. **Start with landing page** - Sets context and professionalism
2. **Expand project rows** - Show lifeline charts for visual impact
3. **Navigate smoothly** - Use browser back/forward, don't type URLs
4. **Highlight contrasts** - Show critical vs healthy projects side-by-side

## 📱 Responsive Design

The demo works on various screen sizes:
- **Desktop** (1920x1080+) - Full feature set
- **Laptop** (1366x768+) - Optimized layout
- **Tablet** (768px+) - Responsive sidebar

## 🔗 Links

- **GitHub Repository**: https://github.com/QRY91/panopticron-demo
- **Main Panopticron**: https://github.com/borndigitalbe/panopticron
- **QRY Labs**: https://github.com/QRY91

## 🆘 Last-Minute Setup

**If you only have 2 minutes:**
```bash
git clone https://github.com/QRY91/panopticron-demo.git
cd panopticron-demo
npm install && npm run dev
```

**Emergency backup**: Take screenshots of key screens before presenting in case of technical issues.

---

**Ready to showcase professional project monitoring! 🚀**