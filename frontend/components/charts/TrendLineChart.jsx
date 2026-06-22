'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatMonth(value) {
  if (!value) return '';
  const parts = value.split('-');
  if (parts.length < 2) return value;
  const monthIndex = parseInt(parts[1], 10) - 1;
  return MONTH_NAMES[monthIndex] || value;
}

function formatCurrency(value) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <p className="text-xs text-slate-400 mb-2 font-medium">
        {formatMonth(label)} {label?.split('-')[0]}
      </p>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-2 h-2 rounded-full bg-indigo-400" />
        <span className="text-sm font-semibold text-white">
          ${payload[0].value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
      {payload[0]?.payload?.count != null && (
        <p className="text-[11px] text-slate-500">
          {payload[0].payload.count} transactions
        </p>
      )}
    </div>
  );
};

const CustomDot = ({ cx, cy, index }) => {
  if (cx == null || cy == null) return null;
  return (
    <g key={`dot-${index}`}>
      {/* Glow */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="rgba(99, 102, 241, 0.15)"
        className="transition-all duration-300"
      />
      {/* Dot */}
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#6366f1"
        stroke="#0f172a"
        strokeWidth={2}
      />
    </g>
  );
};

const CustomActiveDot = ({ cx, cy }) => {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill="rgba(99, 102, 241, 0.15)" />
      <circle cx={cx} cy={cy} r={8} fill="rgba(99, 102, 241, 0.3)" />
      <circle cx={cx} cy={cy} r={5} fill="#6366f1" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

export default function TrendLineChart({ data }) {
  const isEmpty = !data || data.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Spending Trends</h3>
        <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          {data?.length || 0} months
        </span>
      </div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-slate-400 text-sm">No trend data available</p>
          <p className="text-slate-500 text-xs mt-1">
            Trends will appear once you have transactions over multiple months
          </p>
        </motion.div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(99, 102, 241, 0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
            />

            <YAxis
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dx={-5}
              width={55}
            />

            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#trendGradient)"
              dot={<CustomDot />}
              activeDot={<CustomActiveDot />}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
