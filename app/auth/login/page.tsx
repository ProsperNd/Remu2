'use client';

import SignInForm from '@/components/auth/SignInForm';
import AuthLayout from '@/components/auth/AuthLayout';

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/auth/signup" className="font-medium text-orange-600 hover:text-orange-500">
            create a new account
          </a>
        </p>
      </div>
      <SignInForm />
    </AuthLayout>
  );
} 