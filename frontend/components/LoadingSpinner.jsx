'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#050816' }}>
      <div className="relative flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute w-24 h-24 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 rounded-full absolute"
          style={{
            border: '3px solid rgba(99, 102, 241, 0.1)',
            borderTopColor: '#6366f1',
            borderRightColor: '#8b5cf6',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="w-11 h-11 rounded-full absolute"
          style={{
            border: '2px solid rgba(139, 92, 246, 0.1)',
            borderTopColor: '#8b5cf6',
            borderLeftColor: '#06b6d4',
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="w-6 h-6 rounded-full absolute"
          style={{
            border: '2px solid rgba(6, 182, 212, 0.1)',
            borderBottomColor: '#06b6d4',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Center dot */}
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
          }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}
