'use client';

import { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';
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

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 12px ${fill}66)` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 18}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="#e6e8f0"
        fontSize={11}
        fontWeight={600}
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill={fill}
        fontSize={16}
        fontWeight={700}
      >
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </text>
    </g>
  );
};

export default function SpendingPieChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  // Convert { categoryName: amount } to array
  const chartData = data
    ? Object.entries(data)
        .filter(([, amount]) => amount > 0)
        .map(([name, value]) => ({
          name,
          value,
          color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
          icon: CATEGORY_ICONS[name] || CATEGORY_ICONS.Other,
        }))
    : [];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const isEmpty = chartData.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Spending Breakdown</h3>
        <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          {chartData.length} categories
        </span>
      </div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-slate-400 text-sm">No spending data available</p>
          <p className="text-slate-500 text-xs mt-1">
            Start adding transactions to see your breakdown
          </p>
        </motion.div>
      ) : (
        <>
          {/* Chart */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={200}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                      style={{
                        filter:
                          activeIndex === index
                            ? `drop-shadow(0 0 8px ${entry.color}55)`
                            : 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center label (only when no active slice) */}
            {activeIndex === -1 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                  Total
                </span>
                <AnimatedCounter
                  value={total}
                  prefix="$"
                  decimals={0}
                  className="text-xl font-bold text-white"
                />
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {chartData.map((entry, index) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
                className="flex items-center gap-2.5 group cursor-default"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0 transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: entry.color,
                    boxShadow: `0 0 8px ${entry.color}40`,
                  }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-slate-300 truncate group-hover:text-white transition-colors">
                    {entry.icon} {entry.name}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: entry.color }}
                  >
                    ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
