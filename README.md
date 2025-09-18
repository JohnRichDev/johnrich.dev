# John Rich - Portfolio

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*A cutting-edge portfolio platform showcasing technical expertise through real-time integrations and modern web technologies*

[Live Demo](https://johnrich.dev) • [Contact](mailto:contact@johnrich.dev) • [LinkedIn](https://linkedin.com/in/johnrich)

</div>

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Project Architecture](#project-architecture)
- [Technology Stack](#technology-stack)
- [License](#license)

## Project Overview

This portfolio application represents the convergence of modern web development practices and real-time data integration. Built on the Next.js 15 framework with the App Router architecture, it demonstrates advanced React patterns, TypeScript implementation, and seamless third-party service integrations.

The platform serves as both a personal portfolio and a technical showcase, featuring sophisticated animations, responsive design principles, and live Discord presence functionality—all optimized for performance and accessibility across diverse user environments.

## Key Features

### User Experience
- **Responsive Design System**: Fluid, mobile-first interface optimized for all viewport sizes
- **Advanced Animation Framework**: Sophisticated Framer Motion implementations with performance optimizations
- **Accessibility Compliant**: WCAG 2.1 AA standards with comprehensive keyboard navigation and screen reader support

### Real-time Integrations
- **Discord Presence API**: Live status updates via WebSocket or configurable polling mechanisms
- **Dynamic Profile Management**: Seamless switching between static and live profile configurations
- **Connection Resilience**: Automatic reconnection logic with exponential backoff strategies

### Technical Excellence
- **Type-Safe Architecture**: Comprehensive TypeScript implementation with strict type checking
- **Performance Monitoring**: Integrated Vercel Analytics for real-time performance insights
- **Modern Build Pipeline**: Turbopack-powered development with optimized production builds

## Prerequisites

### System Requirements

| Requirement | Minimum Version | Recommended |
|-------------|----------------|-------------|
| **Node.js** | 18.17.0 | 20.x LTS |
| **npm** | 9.0.0 | Latest |
| **Git** | 2.34.0 | Latest |

### Development Environment
- Modern code editor (VS Code recommended with TypeScript extensions)
- Terminal with PowerShell 5.1+ or equivalent
- Browser with ES2022 support for development

## Quick Start

### 1. Repository Setup
```powershell
# Clone the repository
git clone https://github.com/JohnRichDev/johnrich.dev.git
cd johnrich.dev

# Verify Node.js version
node --version  # Should be 18.17.0 or higher
```

### 2. Dependency Installation
```powershell
# Install project dependencies
npm install

# Alternative package managers
# yarn install
# pnpm install
```

### 3. Environment Configuration (Optional)
```powershell
# Copy environment template
copy .env.example .env.local

# Configure environment variables as needed
```

### 4. Development Server Launch
```powershell
# Start development server with Turbopack
npm run dev

# Navigate to http://localhost:3000
```

## Configuration

### Discord Integration Setup

The application provides flexible Discord presence integration through the centralized [`ProfileConfig.ts`](src/app/components/config/ProfileConfig.ts) configuration module:

```typescript
export const profileConfig = {
  type: 'discord' as 'static' | 'discord',
  staticImagePath: '/profile.png',
  discord: {
    userId: 'YOUR_DISCORD_USER_ID',
    apiEndpoint: 'YOUR_API_ENDPOINT',
    showStatus: true,
    connectionMode: 'websocket' as 'websocket' | 'polling',
    pollingInterval: 30000
  }
};
```

#### Configuration Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `type` | `'static' \| 'discord'` | Profile display mode | `'static'` |
| `userId` | `string` | Discord user identifier | `''` |
| `apiEndpoint` | `string` | Discord API endpoint URL | `''` |
| `showStatus` | `boolean` | Display online status indicator | `true` |
| `connectionMode` | `'websocket' \| 'polling'` | Real-time connection method | `'websocket'` |
| `pollingInterval` | `number` | Polling frequency (milliseconds) | `30000` |

### Profile Modes

#### Static Profile Configuration
- Set `type: 'static'` for offline portfolio display
- Place profile image at `public/profile.png`
- Optimal image dimensions: 256x256px (PNG/WEBP recommended)

#### Discord Integration Configuration
- Obtain Discord User ID from Developer Portal
- Configure secure API endpoint for presence data
- Implement proper error handling for connection failures

## Development

### Local Development Workflow

#### 1. Development Server
```powershell
# Start development server with hot reloading
npm run dev

# Alternative with explicit port specification
npm run dev -- --port 3001
```

#### 2. Code Quality Assurance
```powershell
# Run ESLint for code analysis
npm run lint

# Fix automatically resolvable ESLint issues
npm run lint -- --fix

# Type checking
npm run type-check
```

#### 3. Development Features
- **Hot Module Replacement**: Instant updates without page refresh
- **Turbopack Integration**: Accelerated build performance in development
- **TypeScript Validation**: Real-time type checking and IntelliSense
- **Automatic Port Selection**: Fallback to available ports if 3000 is occupied

### Development Best Practices

- Follow the established component architecture patterns
- Implement proper TypeScript typing for all new components
- Maintain consistent code formatting with the project's ESLint configuration
- Test Discord integration with both WebSocket and polling modes

## Build & Deployment

### Production Build Process

#### 1. Build Optimization
```powershell
# Generate optimized production build
npm run build

# Verify build output and bundle analysis
npm run build -- --analyze
```

#### 2. Local Production Testing
```powershell
# Start production server locally
npm run start

# Verify at http://localhost:3000
```

### Deployment Strategies

#### Recommended Platforms

| Platform | Suitability | Setup Complexity | Performance |
|----------|-------------|------------------|-------------|
| **Vercel** | ⭐⭐⭐⭐⭐ Optimal | Minimal | Excellent |
| **Netlify** | ⭐⭐⭐⭐ Good | Low | Very Good |
| **Railway** | ⭐⭐⭐ Suitable | Medium | Good |
| **Docker** | ⭐⭐⭐⭐ Advanced | High | Configurable |

#### Vercel Deployment (Recommended)
```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### Custom Server Deployment
```powershell
# Build for production
npm run build

# Transfer dist files to server
# Configure reverse proxy (nginx/Apache)
# Set NODE_ENV=production
# Start with process manager (PM2)
```

## Project Architecture

### Directory Structure Overview
```
src/
├── app/                          # Next.js App Router directory
│   ├── components/               # Reusable component library
│   │   ├── animations/           # Motion & transition components
│   │   │   ├── index.ts             # Barrel exports
│   │   │   └── MorphingTitle.tsx    # Dynamic title animations
│   │   ├── config/               # Application configuration
│   │   │   ├── index.ts             # Configuration exports
│   │   │   └── ProfileConfig.ts     # Profile & Discord settings
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── index.ts             # Hook exports
│   │   │   ├── useDiscordPolling.ts # Polling-based Discord integration
│   │   │   └── useDiscordSocket.ts  # WebSocket Discord integration
│   │   ├── profile/              # Profile-specific components
│   │   │   ├── DiscordProfile.tsx   # Discord integration component
│   │   │   ├── index.ts             # Profile exports
│   │   │   └── Profile.tsx          # Main profile component
│   │   └── ui/                   # Core UI component library
│   │       ├── AnimatedContainer.tsx # Container with enter/exit animations
│   │       ├── index.ts             # UI component exports
│   │       ├── Skeleton.tsx         # Loading state components
│   │       └── TechBadge.tsx        # Technology skill indicators
│   ├── globals.css               # Global styles & Tailwind imports
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main application entry point
└── public/                       # Static asset directory
    └── profile.png                # Default profile image
```

### Architectural Patterns

#### Component Organization
- **Barrel Exports**: Centralized component exports through `index.ts` files
- **Feature-Based Grouping**: Related components grouped by functionality
- **Separation of Concerns**: Clear distinction between UI, business logic, and configuration

#### State Management
- **React Hooks**: Custom hooks for complex state logic and side effects
- **Configuration-Driven**: Centralized settings in `ProfileConfig.ts`
- **Real-time Integration**: Dedicated hooks for Discord API interactions

#### Type Safety
- **Comprehensive TypeScript**: Strict type checking across all modules
- **Interface Definitions**: Well-defined component prop interfaces
- **Generic Components**: Reusable components with proper generic typing

## Technology Stack

### Frontend Framework & Core
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Next.js** | 15.x | Full-stack React framework with App Router | [Next.js Docs](https://nextjs.org/docs) |
| **React** | 19.x | Component-based UI library | [React Docs](https://react.dev) |
| **TypeScript** | 5.x | Static type checking and enhanced developer experience | [TypeScript Docs](https://www.typescriptlang.org/docs) |

### Styling & UI Framework
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Tailwind CSS** | 4.x | Utility-first CSS framework | [Tailwind Docs](https://tailwindcss.com/docs) |
| **Framer Motion** | Latest | Production-ready motion library for React | [Framer Motion](https://www.framer.com/motion) |
| **React Icons** | Latest | Popular icon library with consistent styling | [React Icons](https://react-icons.github.io/react-icons) |

### Real-time & Networking
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Socket.IO Client** | Latest | Real-time bidirectional event-based communication | [Socket.IO Docs](https://socket.io/docs/v4) |
| **Native Fetch API** | Browser Native | HTTP client for REST API interactions | [MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) |

### Development & Build Tools
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Turbopack** | Latest | High-performance bundler for Next.js | [Turbopack Docs](https://turbo.build/pack/docs) |
| **ESLint** | 9.x | JavaScript/TypeScript linting and code quality | [ESLint Docs](https://eslint.org/docs) |
| **PostCSS** | Latest | CSS transformation and optimization | [PostCSS Docs](https://postcss.org) |

### Monitoring & Analytics
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Vercel Analytics** | Latest | Performance monitoring and user insights | [Vercel Analytics](https://vercel.com/docs/analytics) |

### Deployment & Infrastructure
- **Vercel Platform**: Serverless deployment with global CDN
- **Edge Runtime**: Optimized for performance and reduced cold starts
- **Automatic HTTPS**: SSL certificate management and security headers

## License

### MIT License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete terms and conditions.

#### Permission Summary
**Commercial use** - Use in commercial projects  
**Modification** - Modify and adapt the code  
**Distribution** - Share and distribute the code  
**Private use** - Use for private projects  

#### Limitations
**Liability** - Author not liable for damages  
**Warranty** - Software provided "as is"  

#### Attribution Required
Copyright notice and license text must be included in all copies or substantial portions

---

<div align="center">

**Copyright © 2025 [JohnRichDev](https://github.com/JohnRichDev)**

*Built with modern web technologies using Next.js, TypeScript, and cutting-edge development practices*

[![GitHub Stars](https://img.shields.io/github/stars/JohnRichDev/johnrich.dev?style=social)](https://github.com/JohnRichDev/johnrich.dev)
[![GitHub Issues](https://img.shields.io/github/issues/JohnRichDev/johnrich.dev?style=flat-square)](https://github.com/JohnRichDev/johnrich.dev/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/JohnRichDev/johnrich.dev?style=flat-square)](https://github.com/JohnRichDev/johnrich.dev/pulls)

</div>