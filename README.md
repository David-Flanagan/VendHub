# VendHub - Global Catalog Management System

A modern React application for managing vending machine catalogs, built with Vite and Tailwind CSS.

## Features

### Core Catalog Management
- **Machine Category Management** - Admin management of categories (Snack, Drink, Sunscreen, Combo)
- **Product Type Management** - Product types linked to machine categories
- **Global Product Management** - Centralized product catalog with brand and product information
- **Company Product Management** - Operator-level product customization and pricing

### Key Functionality
- **Global → Company Import** - Easy product import from global to company catalogs
- **Activation Gatekeeping** - Ensures proper pricing before product activation
- **Catalog Navigation** - Intuitive interface with Products and Machine Templates views

## Getting Started

### Prerequisites
- Node.js 20.0.0 or higher
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5175`

## Project Structure

```
VendHub/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── catalog/        # Catalog management components
│   │   └── ui/             # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Architecture Overview

### Global vs Company Scope

| Concept | Global Scope | Company Scope |
|---------|-------------|---------------|
| Machine Category | Admin defined | Reference only |
| Product Type | Admin defined | Reference only |
| Products | Created by Admin | Copied and modified by Operator |
| Machine Templates | Global defaults | Copied and used by Operator |
| Activation for Customers | Not in Global | Only in Company |

### Key Pages

1. **Admin Pages**
   - `/admin/machine-categories` - Manage machine categories
   - `/admin/product-types` - Manage product types
   - `/admin/global-products` - Global product management

2. **Catalog Pages**
   - `/catalog/import-products` - Import products to company catalog
   - `/company/products` - Company product management

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Custom hooks** for state management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in the appropriate directory
2. Add routing in the main App component
3. Follow the established patterns for state management
4. Use Tailwind CSS for styling

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) #   V e n d H u b  
 