'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon,
  trend,
  trendLabel,
  color = '#6366f1',
  delay = 0,
}) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef(null);

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

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const isPositive = trend > 0;
  const trendColor = isPositive ? '#10b981' : '#f43f5e';
  const trendArrow = isPositive ? '↑' : '↓';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
      }}
    >
      <div
        className="glass-card p-6 relative overflow-hidden group cursor-default"
        style={{
          '--glow-color': color,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 8px 40px ${color}22, 0 0 60px ${color}11`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Header: Icon and Trend */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          {/* Icon circle */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              border: `1px solid ${color}25`,
            }}
          >
            {icon}
          </div>

          {/* Trend badge */}
          {trend !== undefined && trend !== null && (
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{
                background: `${trendColor}15`,
                color: trendColor,
              }}
            >
              <span>{trendArrow}</span>
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* Title */}
        <p
          className="text-xs font-medium uppercase tracking-wider mb-2 relative z-10"
          style={{ color: 'rgba(148, 163, 184, 0.6)' }}
        >
          {title}
        </p>

        {/* Value */}
        <div className="text-2xl font-bold text-white relative z-10">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={prefix === '$' ? 2 : 0}
            duration={1}
          />
        </div>

        {/* Trend label */}
        {trendLabel && (
          <p
            className="text-[11px] mt-2 relative z-10"
            style={{ color: 'rgba(148, 163, 184, 0.45)' }}
          >
            {trendLabel}
          </p>
        )}

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}
