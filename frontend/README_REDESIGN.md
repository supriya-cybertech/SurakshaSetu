# SurakshaSetu UI Redesign - Design System & Implementation Guide

## Overview
This document outlines the comprehensive redesign of the SurakshaSetu security dashboard. The new interface adopts a **Light Enterprise Theme**, focusing on clarity, professionalism, and modern aesthetics suitable for high-stakes security monitoring environments.

## Design Philosophy
- **Theme**: Light, airy, and clinical (clean white/gray backgrounds) with high-contrast text.
- **Accent Colors**: 
  - **Primary**: Deep Blue/Indigo (`primary-600`) for trust and actionable elements.
  - **Status Colors**: distinct Red (`status-danger`), Amber (`status-warning`), and Green (`status-success`) for immediate signal recognition.
  - **Accent**: Teal (`accent-teal`) for AI/Machine Learning related features.
- **Visuals**: 
  - **Glassmorphism**: Subtle translucency on cards and overlays (`glass-card` utility).
  - **Shadows**: Soft, multi-layered shadows (`shadow-soft`, `shadow-float`) to create depth without clutter.
  - **Typography**: Clean sans-serif fonts with strict hierarchy.

## Component Library
The UI is built using a set of reusable, styled components:

| Component | Description | key Props |
|-----------|-------------|-----------|
| **KPICard** | Displays key metrics with trend indicators and sparklines. | `title`, `value`, `icon`, `trend`, `color` |
| **StatusBadge** | Uniform badges for incidence severity and camera status. | `status` (active, warning, danger, etc.) |
| **Modal** | standardized dialogs for actions (e.g., specific camera view, forms). | `isOpen`, `title`, `size` |
| **Sidebar/Topbar** | Responsive navigation framework. | `isCollapsed`, `activePage` |
| **RegisterResidentModal** | Complex multi-step form with camera integration. | - |

## Page Breakdown

### 1. Landing Page (`LandingPage.jsx`)
- **Hero**: Immersive background with animated gradient orbs and glassmorphic login card.
- **Features**: Grid layout highlighting core AI capabilities.
- **Stats**: Social proof metrics (Cameras active, Residents secured).

### 2. Dashboard (`Dashboard.jsx`)
- **Executive Summary**: 4-column KPI grid for instant health check.
- **Charts**: Weekly Incident Overview and Visitor Traffic for quick insights.
- **Recent Activity**: Quick-glance table for latest system events.

### 3. Analytics (`Analytics.jsx`)
- **Deep Dive**: Detailed statistical analysis of system performance.
- **Visualizations**: 
  - Incident vs Verified Traffic trends (Area Chart).
  - Threat Distribution by type (Donut Chart).
  - Staff Response Efficiency (Bar Chart).
- **KPIs**: Advanced metrics like Average Response Time, Security Score, and Detection Rate.

### 4. Live Monitoring (`LiveMonitoring.jsx`)
- **Grid Layout**: Responsive camera feed grid (1x1 to 3x3).
- **Control Bar**: Filtering options and global actions (e.g., Mute All).
- **Incident Handling**: Real-time alert overlays on specific camera feeds.

### 4. Incident Logs (`IncidentLog.jsx`)
- **Data Table**: Sortable, filterable list of all security events.
- **Detail View**: Modal with high-res snapshot and metadata.
- **Tools**: Search, Date Range, and Export functionality.

### 5. Settings (`Settings.jsx`)
- **Tabbed Interface**: Organized configuration for AI, Cameras, Notifications, etc.
- **Controls**: Custom-styled range sliders and toggle switches.

## Implementation Details
- **CSS Architecture**: Tailwind CSS with custom configuration.
- **Icons**: `lucide-react` for a consistent, lightweight icon set.
- **Charts**: `recharts` for responsive, animated data visualization.
- **State Management**: React `useState` and `useEffect` for local UI state.

## Next Steps
- **Backend Integration**: Connect the `RegisterResidentModal` and `IncidentLog` to real API endpoints (currently mocked or using placeholders).
- **Real-time Updates**: Implement WebSocket connections for live camera feed statuses and instant alert notifications.
