'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BUDGET_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other',
  'Overall',
];

const CATEGORY_ICONS = {
  Food: '🍕',
  Transport: '🚗',
  Entertainment: '🎬',
  Utilities: '⚡',
  Healthcare: '🏥',
  Shopping: '🛍️',
  Other: '📦',
  Overall: '📊',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 30,
    transition: { duration: 0.2 },
  },
};

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default function BudgetForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: getCurrentMonth(),
    alert: '80',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.limit || parseFloat(formData.limit) <= 0)
      newErrors.limit = 'Valid budget limit is required';
    if (!formData.month) newErrors.month = 'Month is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        category: formData.category,
        limit: parseFloat(formData.limit),
        month: formData.month,
        alert: parseInt(formData.alert, 10) || 80,
      });
      // Reset form
      setFormData({
        category: '',
        limit: '',
        month: getCurrentMonth(),
        alert: '80',
      });
      onClose();
    } catch (err) {
      console.error('Budget form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-card p-8 w-full max-w-lg mx-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
                         bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white
                         transition-all duration-200 z-10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Create Budget</h2>
              <p className="text-sm text-slate-400 mt-1">
                Set a spending limit for a category
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-glass w-full appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {BUDGET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_ICONS[cat]} {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-400 text-xs mt-1.5"
                  >
                    {errors.category}
                  </motion.p>
                )}
              </div>

              {/* Budget Limit & Month */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                    Budget Limit *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      name="limit"
                      value={formData.limit}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="input-glass pl-7"
                    />
                  </div>
                  {errors.limit && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-400 text-xs mt-1.5"
                    >
                      {errors.limit}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                    Month *
                  </label>
                  <input
                    type="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="input-glass"
                    style={{ colorScheme: 'dark' }}
                  />
                  {errors.month && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-400 text-xs mt-1.5"
                    >
                      {errors.month}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Alert Threshold */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Alert Threshold (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="alert"
                    value={formData.alert}
                    onChange={handleChange}
                    placeholder="80"
                    min="1"
                    max="100"
                    className="input-glass pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    %
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Get warned when spending reaches this percentage of your limit
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="60"
                          strokeDashoffset="20"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Budget</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
