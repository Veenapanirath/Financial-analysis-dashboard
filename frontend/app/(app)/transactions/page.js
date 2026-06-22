'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import TransactionTable from '@/components/TransactionTable';
import TransactionForm from '@/components/TransactionForm';
import { useToast } from '@/components/Toast';
import { transactionsAPI } from '@/lib/api';

const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];
const DATE_RANGES = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 7 Days', value: 'week' },
  { label: 'Last 30 Days', value: '30days' },
];

export default function TransactionsPage() {
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate, endDate;
    endDate = now.toISOString();

    switch (dateRange) {
      case 'week': {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString();
        break;
      }
      case 'month': {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = d.toISOString();
        break;
      }
      case '30days': {
        const d = new Date(now);
        d.setDate(d.getDate() - 30);
        startDate = d.toISOString();
        break;
      }
      default:
        startDate = undefined;
        endDate = undefined;
    }
    return { startDate, endDate };
  }, [dateRange]);

  const fetchTransactions = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      const category = categoryFilter === 'All' ? undefined : categoryFilter;
      const res = await transactionsAPI.getAll(category, startDate, endDate, 50, page);
      setTransactions(res.data?.data || []);
      setPagination({
        page: res.data?.pagination?.page || 1,
        pages: res.data?.pagination?.pages || 1,
        total: res.data?.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, getDateRange, toast]);

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  const handleCreate = async (data) => {
    try {
      await transactionsAPI.create(data);
      toast.success('Transaction created successfully!');
      setIsFormOpen(false);
      fetchTransactions(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setIsFormOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      await transactionsAPI.update(editData._id, data);
      toast.success('Transaction updated successfully!');
      setIsFormOpen(false);
      setEditData(null);
      fetchTransactions(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update transaction');
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionsAPI.delete(id);
      toast.success('Transaction deleted successfully!');
      fetchTransactions(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete transaction');
    }
  };

  const handleFormSubmit = (data) => {
    if (editData) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchTransactions(newPage);
    }
  };

  return (
    <PageTransition>
      <Header
        title="Transactions"
        subtitle="Manage and track all your transactions."
      />

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="select-glass"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            className="select-glass"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {DATE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {pagination.total > 0 && (
            <span className="text-sm text-slate-400">
              {pagination.total} transaction{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsFormOpen(true)}
        >
          <span className="text-lg">+</span>
          Add Transaction
        </button>
      </motion.div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TransactionTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <button
            className="btn-secondary px-3 py-2 text-sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            ← Prev
          </button>

          {[...Array(pagination.pages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === pagination.page;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="btn-secondary px-3 py-2 text-sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >
            Next →
          </button>
        </motion.div>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editData={editData}
      />
    </PageTransition>
  );
}
