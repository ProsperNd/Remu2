# Remu2 - E-commerce Platform

Remu2 is a modern e-commerce platform inspired by Temu, built with Next.js, Firebase, and Stripe.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Firebase](https://firebase.google.com/) account
- [Stripe](https://stripe.com/) account (optional, for payment processing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd remu2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the required environment variables with your Firebase and Stripe credentials

## Configuration

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage services
3. Create a web app in your Firebase project
4. Copy the Firebase configuration to your `.env.local` file

### Stripe Setup (Optional)

1. Create a Stripe account at [https://stripe.com/](https://stripe.com/)
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env.local` file
4. For webhook testing, install the Stripe CLI and run:
```bash
npm run stripe:listen
```

## Backend Structure

The backend is built using Next.js API routes and Firebase services:

- `/app/api/products`: Product API endpoints
- `/app/api/cart`: Shopping cart API endpoints
- `/app/api/orders`: Order management API endpoints
- `/app/api/checkout`: Payment processing with Stripe
- `/app/api/webhook`: Stripe webhook handler

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Firebase Data Structure

### Collections

- `users`: User accounts and profiles
- `products`: Product information
- `carts`: Shopping carts for users
- `orders`: Order information

## API Endpoints

### Products

- `GET /api/products`: Get all products with optional filtering
- `GET /api/products/[id]`: Get a single product by ID

### Cart

- `GET /api/cart`: Get the cart for the authenticated user
- `POST /api/cart`: Update the cart for the authenticated user

### Orders

- `GET /api/orders`: Get all orders for the authenticated user
- `POST /api/orders`: Create a new order

### Checkout

- `POST /api/checkout`: Create a Stripe checkout session for payment processing

## Deployment

This application can be deployed using Vercel or any other Next.js-compatible hosting platform.

1. Set up environment variables in your hosting platform
2. Deploy the application

## License

[MIT](LICENSE)