'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import SpendingPieChart from '@/components/charts/SpendingPieChart';
import TrendLineChart from '@/components/charts/TrendLineChart';
import BudgetBarChart from '@/components/charts/BudgetBarChart';
import { analyticsAPI } from '@/lib/api';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [trends, setTrends] = useState([]);
  const [budgetVsActual, setBudgetVsActual] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [metricsRes, breakdownRes, trendsRes, budgetRes] = await Promise.all([
          analyticsAPI.getMetrics(),
          analyticsAPI.getBreakdown(),
          analyticsAPI.getTrends(),
          analyticsAPI.getBudgetVsActual(),
        ]);
        setMetrics(metricsRes.data);
        setBreakdown(breakdownRes.data);
        setTrends(trendsRes.data?.trends || []);
        setBudgetVsActual(budgetRes.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryBreakdownObject = () => {
    if (!breakdown?.categories) return {};
    const obj = {};
    breakdown.categories.forEach((cat) => {
      obj[cat.category] = cat.amount;
    });
    return obj;
  };

  const getMonthChangeColor = () => {
    if (!metrics) return 'indigo';
    const change = metrics.monthOverMonthChange || 0;
    if (change > 0) return 'rose';
    if (change < 0) return 'emerald';
    return 'indigo';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <PageTransition>
      <Header
        title="Analytics"
        subtitle="Deep dive into your spending patterns."
      />

      {/* Metric Cards */}
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
            title="This Month"
            value={metrics?.thisMonthTotal || 0}
            prefix="$"
            icon="📅"
            color="indigo"
            delay={0}
          />
          <StatCard
            title="Last Month"
            value={metrics?.lastMonthTotal || 0}
            prefix="$"
            icon="📆"
            color="violet"
            delay={0.1}
          />
          <StatCard
            title="Month Change"
            value={Math.abs(metrics?.monthOverMonthChange || 0)}
            suffix="%"
            icon={metrics?.monthOverMonthChange >= 0 ? '📈' : '📉'}
            color={getMonthChangeColor()}
            trend={metrics?.monthOverMonthChange}
            trendLabel="vs previous month"
            delay={0.2}
          />
          <StatCard
            title="Avg Transaction"
            value={metrics?.avgTransaction || 0}
            prefix="$"
            icon="💰"
            color="cyan"
            delay={0.3}
          />
        </div>
      )}

      {/* Charts */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-[400px]">
              <div className="shimmer h-5 w-40 mb-6 rounded" />
              <div className="shimmer h-[300px] w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Spending Breakdown
            </h3>
            <SpendingPieChart data={getCategoryBreakdownObject()} />
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Monthly Trends
            </h3>
            <TrendLineChart data={trends} />
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Budget vs Actual
            </h3>
            <BudgetBarChart data={budgetVsActual?.comparisons || []} />
          </motion.div>
        </motion.div>
      )}

      {/* Summary Cards */}
      {!isLoading && budgetVsActual && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-slate-400 mb-1">Total Budgeted</p>
            <p className="text-2xl font-bold text-indigo-400">
              ${(budgetVsActual.totalBudgeted || 0).toLocaleString()}
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-slate-400 mb-1">Total Actual</p>
            <p className="text-2xl font-bold text-violet-400">
              ${(budgetVsActual.totalActual || 0).toLocaleString()}
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-slate-400 mb-1">Total Variance</p>
            <p
              className={`text-2xl font-bold ${
                (budgetVsActual.totalVariance || 0) >= 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              ${Math.abs(budgetVsActual.totalVariance || 0).toLocaleString()}
              <span className="text-sm ml-1">
                {(budgetVsActual.totalVariance || 0) >= 0 ? 'under' : 'over'}
              </span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Top Category Highlight */}
      {!isLoading && metrics?.topCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="glass-card p-6 mt-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <p className="text-sm text-slate-400">Top Spending Category</p>
              <p className="text-xl font-semibold text-white">
                {metrics.topCategory}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </PageTransition>
  );
}
