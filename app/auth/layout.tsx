import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Authentication - Remu',
    template: '%s - Remu'
  },
  description: 'Sign in or create an account on Remu'
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 