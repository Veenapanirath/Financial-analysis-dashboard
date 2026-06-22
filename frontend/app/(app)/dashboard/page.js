'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import SpendingPieChart from '@/components/charts/SpendingPieChart';
import TrendLineChart from '@/components/charts/TrendLineChart';
import { analyticsAPI } from '@/lib/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [summaryRes, trendsRes, breakdownRes, metricsRes] = await Promise.all([
          analyticsAPI.getSummary(),
          analyticsAPI.getTrends(),
          analyticsAPI.getBreakdown(),
          analyticsAPI.getMetrics(),
        ]);
        setSummary(summaryRes.data);
        setTrends(trendsRes.data?.trends || []);
        setBreakdown(breakdownRes.data);
        setMetrics(metricsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBudgetStatusColor = () => {
    if (!summary) return 'indigo';
    if (summary.percentSpent >= 90) return 'rose';
    if (summary.percentSpent >= 70) return 'amber';
    return 'emerald';
  };

  const getCategoryBreakdownObject = () => {
    if (!breakdown?.categories) return {};
    const obj = {};
    breakdown.categories.forEach((cat) => {
      obj[cat.category] = cat.amount;
    });
    return obj;
  };

  return (
    <PageTransition>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your financial overview."
      />

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-[140px]">
              <div className="shimmer h-4 w-24 mb-3 rounded" />
              <div className="shimmer h-8 w-32 mb-2 rounded" />
              <div className="shimmer h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Spent"
            value={summary?.totalSpent || 0}
            prefix="$"
            icon="💸"
            color="indigo"
            trend={metrics?.monthOverMonthChange}
            trendLabel="vs last month"
            delay={0}
          />
          <StatCard
            title="Budget Remaining"
            value={summary?.remaining || 0}
            prefix="$"
            icon="🎯"
            color={(summary?.remaining || 0) > 0 ? 'emerald' : 'rose'}
            delay={0.1}
          />
          <StatCard
            title="Transactions"
            value={summary?.transactionCount || 0}
            icon="💳"
            color="violet"
            delay={0.2}
          />
          <StatCard
            title="Budget Status"
            value={summary?.percentSpent || 0}
            suffix="%"
            icon="📊"
            color={getBudgetStatusColor()}
            trendLabel={summary?.budgetStatus || 'On track'}
            delay={0.3}
          />
        </div>
      )}

      {/* Charts Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-[400px]">
              <div className="shimmer h-5 w-40 mb-6 rounded" />
              <div className="shimmer h-[300px] w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Spending by Category
            </h3>
            <SpendingPieChart data={getCategoryBreakdownObject()} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Spending Trends
            </h3>
            <TrendLineChart data={trends} />
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
