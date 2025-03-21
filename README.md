# Remu2 - Temu-like Shopping App

A Next.js-based shopping application with features similar to Temu, including user authentication (sign-in/sign-up), product browsing, shopping cart, and an admin dashboard for product management.

## Features

- **User Authentication**
  - Sign up / Sign in functionality
  - Profile management

- **Shopping Experience**
  - Browse products by categories
  - Search functionality
  - Product details view
  - Cart and checkout
  - Order history

- **Admin Dashboard**
  - Product management (add, edit, delete)
  - Order management
  - User management
  - Analytics

## Project Structure

```
remu2/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── admin/              # Admin Dashboard Pages
│   ├── auth/               # Authentication Pages
│   ├── products/           # Product Pages
│   ├── cart/               # Shopping Cart
│   └── page.tsx            # Homepage
├── components/             # Reusable UI components
├── lib/                    # Utility functions, hooks, etc.
├── models/                 # Data models/types
├── public/                 # Static assets
└── styles/                 # Global styles
```

## Setup Instructions

1. Ensure Node.js is installed on your machine (v16+ recommended)
2. Clone this repository
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

## Backend

This project uses:
- Next.js API Routes for backend services
- Prisma ORM for database interactions
- NextAuth.js for authentication
- Cloudinary for image storage

## Development Status

This project is currently under development.