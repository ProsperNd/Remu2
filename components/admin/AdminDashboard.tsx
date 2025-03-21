'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Products', component: ProductManagement },
  { name: 'Orders', component: OrderManagement },
  { name: 'Users', component: UserManagement },
  { name: 'Analytics', component: Analytics },
];

export default function AdminDashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your products, orders, users, and view analytics.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-6',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                <tab.component />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 