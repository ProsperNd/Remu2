import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Registration - Remu2',
  description: 'Register as an admin for Remu2',
};

import AdminRegistrationForm from '@/components/admin/AdminRegistrationForm';

export default function AdminRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Admin Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AdminRegistrationForm />
        </div>
      </div>
    </div>
  );
} 