# John Rich Portfolio Website

A modern portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features real-time Discord status integration and smooth animations.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Build and Deployment](#build-and-deployment)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

## Overview

This portfolio website showcases personal information, technical skills, and real-time Discord presence. The application is built with modern web technologies and follows best practices for performance and user experience.

## Features

- **Responsive Design**: Optimized for all device sizes
- **Real-time Discord Status**: Live Discord presence integration via WebSocket or polling
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean interface with Tailwind CSS
- **Performance Optimized**: Includes analytics and performance monitoring

## Prerequisites

Before setting up this project, ensure you have the following installed:

- Node.js (version 18.0 or higher)
- npm or yarn package manager
- Git (for version control)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd johnrich.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Create environment file (optional)**
   ```bash
   cp .env.example .env.local
   ```

## Configuration

### Discord Integration

The application supports Discord status integration through the [`ProfileConfig.ts`](src/app/components/config/ProfileConfig.ts) file:

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

**Configuration Options:**
- `type`: Choose between 'static' or 'discord' profile display
- `userId`: Your Discord user ID
- `apiEndpoint`: Discord presence API endpoint
- `showStatus`: Enable or disable status indicator
- `connectionMode`: Choose between WebSocket or polling for real-time updates
- `pollingInterval`: Polling interval in milliseconds (when using polling mode)

### Static Profile Setup

For a static profile without Discord integration:
1. Set `type: 'static'` in [`ProfileConfig.ts`](src/app/components/config/ProfileConfig.ts)
2. Place your profile image in the `public` directory as `profile.png`

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

2. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

3. **Development with Turbopack (faster builds)**
   The project is configured to use Turbopack for faster development builds by default.

## Build and Deployment

### Production Build

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

### Deployment Options

The application is optimized for deployment on:
- Vercel (recommended for Next.js applications)
- Netlify
- Any Node.js hosting provider

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── animations/          # Animation components
│   │   ├── config/              # Configuration files
│   │   ├── hooks/               # Custom React hooks
│   │   ├── profile/             # Profile-related components
│   │   └── ui/                  # Reusable UI components
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── public/                      # Static assets
└── package.json                 # Project dependencies
```

### Key Components

- **[`Profile`](src/app/components/profile/Profile.tsx)**: Main profile component with Discord integration
- **[`MorphingTitle`](src/app/components/animations/MorphingTitle.tsx)**: Animated title component
- **[`TechBadge`](src/app/components/ui/TechBadge.tsx)**: Technology skill badges
- **[`AnimatedContainer`](src/app/components/ui/AnimatedContainer.tsx)**: Smooth page transitions

## Technologies Used

### Core Technologies
- **Next.js 15**: React framework with App Router
- **React 19**: JavaScript library for user interfaces
- **TypeScript 5**: Static type checking
- **Tailwind CSS 4**: Utility-first CSS framework

### Additional Libraries
- **Framer Motion**: Animation library
- **React Icons**: Icon components
- **Socket.IO Client**: Real-time communication
- **Vercel Analytics**: Performance monitoring

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundler for development

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 JohnRichDev. Anyone is free to use this code with proper attribution.