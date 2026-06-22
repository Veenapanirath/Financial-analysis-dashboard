'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#06b6d4',
  Entertainment: '#8b5cf6',
  Utilities: '#6366f1',
  Healthcare: '#10b981',
  Shopping: '#f43f5e',
  Other: '#64748b',
};

const CATEGORY_ICONS = {
  Food: '🍕',
  Transport: '🚗',
  Entertainment: '🎬',
  Utilities: '⚡',
  Healthcare: '🏥',
  Shopping: '🛍️',
  Other: '📦',
};

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatAmount(amount) {
  return `$${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function TransactionTable({ transactions, onEdit, onDelete, isLoading }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (id) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-clear confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm((prev) => (prev === id ? null : prev)), 3000);
    }
  };

  const isEmpty = !isLoading && (!transactions || transactions.length === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="table-glass">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading state */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`shimmer-${i}`}>
                  <td>
                    <div className="shimmer h-4 w-20" />
                  </td>
                  <td>
                    <div className="shimmer h-6 w-24" />
                  </td>
                  <td>
                    <div className="shimmer h-4 w-36" />
                  </td>
                  <td>
                    <div className="shimmer h-4 w-16" />
                  </td>
                  <td>
                    <div className="shimmer h-4 w-20" />
                  </td>
                  <td>
                    <div className="shimmer h-6 w-16" />
                  </td>
                  <td>
                    <div className="shimmer h-8 w-24 ml-auto" />
                  </td>
                </tr>
              ))}

            {/* Empty state */}
            {isEmpty && (
              <tr>
                <td colSpan={7} className="!bg-transparent">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
                      <span className="text-xl">💳</span>
                    </div>
                    <p className="text-slate-400 text-sm">No transactions found</p>
                    <p className="text-slate-500 text-xs mt-1">
                      Add your first transaction to get started
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading && transactions && transactions.length > 0 && (
              <motion.tbody
                is="tbody"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'contents' }}
              >
                {transactions.map((tx) => {
                  const color = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;
                  const icon = CATEGORY_ICONS[tx.category] || CATEGORY_ICONS.Other;

                  return (
                    <motion.tr key={tx._id} variants={rowVariants} layout>
                      {/* Date */}
                      <td className="whitespace-nowrap text-slate-300 text-sm">
                        {formatDate(tx.date)}
                      </td>

                      {/* Category */}
                      <td>
                        <span
                          className="badge inline-flex items-center gap-1.5"
                          style={{
                            backgroundColor: `${color}18`,
                            color: color,
                            border: `1px solid ${color}25`,
                          }}
                        >
                          <span className="text-xs">{icon}</span>
                          {tx.category}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="text-slate-300 text-sm max-w-[200px] truncate">
                        {tx.description || '—'}
                      </td>

                      {/* Amount */}
                      <td className="font-semibold text-white whitespace-nowrap">
                        {formatAmount(tx.amount)}
                      </td>

                      {/* Payment Method */}
                      <td className="text-slate-400 text-sm whitespace-nowrap">
                        {tx.paymentMethod || '—'}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            tx.status === 'flagged'
                              ? 'badge-rose'
                              : tx.status === 'pending'
                              ? 'badge-amber'
                              : 'badge-emerald'
                          }`}
                        >
                          {tx.status || 'completed'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(tx)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium
                                       bg-indigo-500/10 text-indigo-400 border border-indigo-500/20
                                       hover:bg-indigo-500/20 hover:border-indigo-500/40
                                       transition-all duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(tx._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                              deleteConfirm === tx._id
                                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-lg shadow-rose-500/10'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40'
                            }`}
                          >
                            {deleteConfirm === tx._id ? 'Confirm?' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
