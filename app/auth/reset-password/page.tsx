'use client';

import { useSearchParams } from 'next/navigation';
import { Metadata } from 'next';
import AuthLayout from '@/components/auth/AuthLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Create a new password for your account',
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  if (!oobCode) {
    return (
      <AuthLayout>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Invalid reset link
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This password reset link is invalid or has expired. Please request a
                  new password reset link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>
      <ResetPasswordForm oobCode={oobCode} />
    </AuthLayout>
  );
} 