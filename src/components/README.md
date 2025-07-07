# Shared Components

This directory contains shared UI components used across the app.

## Layout & Navigation
- `Sidebar.tsx`: Branded, collapsible sidebar for navigation (company logo, links, user avatar)
- `Header.tsx`: Sticky top header with page title and breadcrumbs
- `Breadcrumbs.tsx`: Breadcrumb navigation for user orientation
- `DashboardLayout.tsx`: Layout wrapper combining sidebar and header, used by all BDM pages

All BDM pages should be wrapped with `DashboardLayout` for a consistent, branded experience.

