# Remu2 - Temu-like Shopping App

A Flutter-based shopping application with features similar to Temu, including user authentication (sign-in/sign-up), product browsing, shopping cart, and an admin dashboard for product management.

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
├── lib/                    # Main source code
│   ├── models/             # Data models
│   ├── screens/            # UI screens
│   ├── widgets/            # Reusable UI components
│   ├── services/           # Backend services
│   ├── utils/              # Utility functions and constants
│   └── main.dart           # Entry point
├── assets/                 # Images, fonts, etc.
└── test/                   # Test files
```

## Setup Instructions

1. Ensure Flutter is installed on your machine
2. Clone this repository
3. Run `flutter pub get` to install dependencies
4. Run `flutter run` to start the application

## Backend

This project uses Firebase for backend services:
- Firebase Authentication for user management
- Cloud Firestore for database
- Firebase Storage for image storage

## Development Status

This project is currently under development.