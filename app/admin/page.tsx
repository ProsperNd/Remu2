import { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Remu2',
  description: 'Admin dashboard for Remu2',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard />
    </div>
  );
} 