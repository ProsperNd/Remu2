'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import chart components with no SSR
const Chart = dynamic(() => import('chart.js/auto').then((mod) => mod.Chart), {
  ssr: false,
});

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

interface AnalyticsData {
  revenue: {
    labels: string[];
    data: number[];
  };
  orders: {
    labels: string[];
    data: number[];
  };
  topProducts: {
    labels: string[];
    data: number[];
  };
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartInitialized, setChartInitialized] = useState(false);

  useEffect(() => {
    const initChart = async () => {
      const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } = await import('chart.js');
      
      ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
      
      setChartInitialized(true);
    };

    initChart();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chartInitialized) {
      fetchAnalytics();
    }
  }, [chartInitialized]);

  if (loading || !data || !chartInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const revenueData = {
    labels: data.revenue.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.revenue.data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const ordersData = {
    labels: data.orders.labels,
    datasets: [
      {
        label: 'Orders',
        data: data.orders.data,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const topProductsData = {
    labels: data.topProducts.labels,
    datasets: [
      {
        label: 'Units Sold',
        data: data.topProducts.data,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Line options={chartOptions} data={revenueData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Line options={chartOptions} data={ordersData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Bar options={chartOptions} data={topProductsData} />
      </div>
    </div>
  );
} 