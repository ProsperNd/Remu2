import { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';
import AuthLayout from '@/components/auth/AuthLayout';

export const metadata: Metadata = {
  title: 'Sign Up - Remu',
  description: 'Create your account on Remu',
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
            sign in to your existing account
          </a>
        </p>
      </div>
      <SignUpForm />
    </AuthLayout>
  );
} 