'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import BudgetCard from '@/components/BudgetCard';
import BudgetForm from '@/components/BudgetForm';
import { useToast } from '@/components/Toast';
import { budgetsAPI } from '@/lib/api';

export default function BudgetsPage() {
  const toast = useToast();

  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await budgetsAPI.getAll();
      setBudgets(res.data || []);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleCreate = async (data) => {
    try {
      await budgetsAPI.create(data);
      toast.success('Budget created successfully!');
      setIsFormOpen(false);
      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create budget');
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetsAPI.delete(id);
      toast.success('Budget deleted successfully!');
      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete budget');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <PageTransition>
      <Header
        title="Budgets"
        subtitle="Set and track your spending limits."
      />

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="text-sm text-slate-400">
          {!isLoading && (
            <span>
              {budgets.length} budget{budgets.length !== 1 ? 's' : ''} configured
            </span>
          )}
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsFormOpen(true)}
        >
          <span className="text-lg">+</span>
          Create Budget
        </button>
      </motion.div>

      {/* Budget Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-[200px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="shimmer w-10 h-10 rounded-xl" />
                <div>
                  <div className="shimmer h-4 w-24 mb-2 rounded" />
                  <div className="shimmer h-3 w-16 rounded" />
                </div>
              </div>
              <div className="shimmer h-3 w-full rounded-full mb-3" />
              <div className="flex justify-between">
                <div className="shimmer h-3 w-20 rounded" />
                <div className="shimmer h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-16 text-center"
        >
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No budgets yet
          </h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Start managing your finances by creating your first budget.
            Set spending limits for different categories to stay on track.
          </p>
          <button
            className="btn-primary"
            onClick={() => setIsFormOpen(true)}
          >
            Create Your First Budget
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {budgets.map((budget) => (
              <motion.div
                key={budget._id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              >
                <BudgetCard budget={budget} onDelete={handleDelete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Budget Form Modal */}
      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />
    </PageTransition>
  );
}
