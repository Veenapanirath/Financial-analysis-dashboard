'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const budgetEntry = payload.find((p) => p.dataKey === 'budgeted');
  const actualEntry = payload.find((p) => p.dataKey === 'actual');
  const budgeted = budgetEntry?.value || 0;
  const actual = actualEntry?.value || 0;
  const diff = budgeted - actual;
  const isOver = diff < 0;

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        minWidth: '160px',
      }}
    >
      <p className="text-xs text-slate-400 font-medium mb-3">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-400 opacity-60" />
            <span className="text-xs text-slate-300">Budget</span>
          </div>
          <span className="text-xs font-semibold text-white">
            ${budgeted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: isOver ? '#f43f5e' : '#10b981' }}
            />
            <span className="text-xs text-slate-300">Actual</span>
          </div>
          <span className="text-xs font-semibold text-white">
            ${actual.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="border-t border-slate-700/50 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Difference</span>
            <span
              className="text-xs font-bold"
              style={{ color: isOver ? '#fb7185' : '#34d399' }}
            >
              {isOver ? '-' : '+'}$
              {Math.abs(diff).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomLegend = () => (
  <div className="flex items-center justify-center gap-6 mt-4">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-sm bg-indigo-400 opacity-50" />
      <span className="text-xs text-slate-400">Budget</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-sm bg-emerald-400" />
      <span className="text-xs text-slate-400">Under Budget</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-sm bg-rose-400" />
      <span className="text-xs text-slate-400">Over Budget</span>
    </div>
  </div>
);

const ActualBarShape = (props) => {
  const { x, y, width, height, payload } = props;
  const isOver = payload.actual > payload.budgeted;
  const fillColor = isOver ? '#f43f5e' : '#10b981';
  const gradientId = `actual-${payload.category}-${Math.round(x)}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity={0.9} />
          <stop offset="100%" stopColor={fillColor} stopOpacity={0.5} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill={`url(#${gradientId})`}
        style={{
          filter: `drop-shadow(0 2px 8px ${fillColor}30)`,
        }}
      />
    </g>
  );
};

export default function BudgetBarChart({ data }) {
  const isEmpty = !data || data.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Budget vs Actual</h3>
        <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          {data?.length || 0} budgets
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
          <p className="text-slate-400 text-sm">No budget data available</p>
          <p className="text-slate-500 text-xs mt-1">
            Create budgets to see how your spending compares
          </p>
        </motion.div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barGap={4}
              barCategoryGap="25%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99, 102, 241, 0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                dy={10}
              />

              <YAxis
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                dx={-5}
                width={55}
              />

              <Tooltip content={<CustomTooltip />} cursor={false} />

              <Bar
                dataKey="budgeted"
                name="Budget"
                radius={[4, 4, 0, 0]}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {(data || []).map((entry, index) => (
                  <Cell
                    key={`budget-${index}`}
                    fill="rgba(99, 102, 241, 0.35)"
                    stroke="rgba(99, 102, 241, 0.2)"
                    strokeWidth={1}
                  />
                ))}
              </Bar>

              <Bar
                dataKey="actual"
                name="Actual"
                shape={<ActualBarShape />}
                animationDuration={1200}
                animationBegin={300}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
          <CustomLegend />
        </>
      )}
    </motion.div>
  );
}
