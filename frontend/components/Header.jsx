'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import useAuthStore from '@/store/useAuthStore';

export default function Header({ title, subtitle }) {
  const { user } = useAuthStore();
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between pb-6 mb-8"
      style={{
        borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
      }}
    >
      {/* Left side */}
      <div>
        <motion.h1
          className="text-3xl font-bold gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-sm mt-1"
            style={{ color: 'rgba(148, 163, 184, 0.6)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Right side */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Date */}
        <div
          className="px-4 py-2 rounded-xl text-xs font-medium"
          style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            color: 'rgba(148, 163, 184, 0.7)',
          }}
        >
          <span className="mr-2">📅</span>
          {today}
        </div>

        {/* User avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
          }}
        >
          {userInitial}
        </div>
      </motion.div>
    </motion.header>
  );
}
