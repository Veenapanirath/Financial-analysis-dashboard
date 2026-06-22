'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#06b6d4',
  Entertainment: '#8b5cf6',
  Utilities: '#6366f1',
  Healthcare: '#10b981',
  Shopping: '#f43f5e',
  Other: '#64748b',
  Overall: '#6366f1',
};

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

function getStatusColor(percentSpent) {
  if (percentSpent > 100) return '#f43f5e';
  if (percentSpent >= 80) return '#f59e0b';
  return '#10b981';
}

function getStatusLabel(percentSpent) {
  if (percentSpent > 100) return 'Over Budget';
  if (percentSpent >= 80) return 'Warning';
  return 'On Track';
}

export default function BudgetCard({ budget, onDelete }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const {
    _id,
    category = 'Other',
    limit = 0,
    spent = 0,
    percentSpent = 0,
    remaining = 0,
    month,
    alert = 80,
  } = budget;

  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
  const statusColor = getStatusColor(percentSpent);
  const statusLabel = getStatusLabel(percentSpent);
  const isAlert = percentSpent >= alert;

  // Circular progress calculations
  const radius = 48;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const cappedPercent = Math.min(percentSpent, 100);
  const offset = circumference - (cappedPercent / 100) * circumference;

  // 3D tilt handlers
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleDeleteClick = () => {
    if (deleteConfirm) {
      onDelete(_id);
      setDeleteConfirm(false);
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  // Format month
  const formattedMonth = month
    ? (() => {
        const parts = month.split('-');
        if (parts.length < 2) return month;
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        const idx = parseInt(parts[1], 10) - 1;
        return `${monthNames[idx] || parts[1]} ${parts[0]}`;
      })()
    : '';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className="relative"
    >
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-card p-6 relative overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Subtle glow background */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
          style={{
            backgroundColor: color,
            opacity: isHovered ? 0.12 : 0.05,
          }}
        />

        {/* Alert pulse glow */}
        {isAlert && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: [
                `0 0 0px ${statusColor}00`,
                `0 0 20px ${statusColor}20`,
                `0 0 0px ${statusColor}00`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Month badge */}
        {formattedMonth && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
              {formattedMonth}
            </span>
            <span
              className="badge text-[11px]"
              style={{
                backgroundColor: `${statusColor}18`,
                color: statusColor,
                border: `1px solid ${statusColor}30`,
              }}
            >
              {statusLabel}
            </span>
          </div>
        )}

        {/* Circular Progress Ring */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative w-28 h-28">
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              className="transform -rotate-90"
            >
              {/* Background ring */}
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="rgba(99, 102, 241, 0.1)"
                strokeWidth={strokeWidth}
              />

              {/* Progress ring */}
              <motion.circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke={statusColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                style={{
                  filter: `drop-shadow(0 0 6px ${statusColor}40)`,
                }}
              />
            </svg>

            {/* Center percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatedCounter
                value={Math.round(percentSpent)}
                suffix="%"
                decimals={0}
                className="text-2xl font-bold text-white"
              />
              <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">
                Used
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-semibold text-white">{category}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
              Spent
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: statusColor }}
            >
              ${spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-center border-x border-slate-700/30">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
              Limit
            </p>
            <p className="text-sm font-bold text-white">
              ${limit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
              Left
            </p>
            <p
              className="text-sm font-bold"
              style={{
                color: remaining < 0 ? '#f43f5e' : remaining === 0 ? '#f59e0b' : '#10b981',
              }}
            >
              {remaining < 0 ? '-' : ''}${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentSpent, 100)}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="h-full rounded-full"
            style={{
              backgroundColor: statusColor,
              boxShadow: `0 0 8px ${statusColor}50`,
            }}
          />
        </div>

        {/* Delete button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDeleteClick}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 ${
              deleteConfirm
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                : 'bg-slate-800/40 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20'
            }`}
          >
            {deleteConfirm ? 'Confirm Delete?' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
