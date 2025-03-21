import { Metadata } from 'next';
import AuthLayout from '@/components/auth/AuthLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <ForgotPasswordForm />
    </AuthLayout>
  );
} 