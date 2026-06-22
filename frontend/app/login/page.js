'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/useAuthStore';

// Finance icons floating in background
const FINANCE_ICONS = [
  { icon: '💹', x: '8%',  y: '15%', delay: 0,    size: '2rem',  duration: 7  },
  { icon: '📈', x: '88%', y: '10%', delay: 1.2,  size: '1.8rem',duration: 9  },
  { icon: '💰', x: '5%',  y: '70%', delay: 0.6,  size: '2.2rem',duration: 8  },
  { icon: '🏦', x: '90%', y: '65%', delay: 2,    size: '1.6rem',duration: 10 },
  { icon: '💳', x: '75%', y: '88%', delay: 0.3,  size: '1.5rem',duration: 6  },
  { icon: '📊', x: '20%', y: '90%', delay: 1.8,  size: '1.9rem',duration: 11 },
  { icon: '🪙', x: '93%', y: '38%', delay: 0.9,  size: '1.7rem',duration: 8  },
  { icon: '📉', x: '12%', y: '42%', delay: 1.5,  size: '1.4rem',duration: 9  },
  { icon: '💵', x: '55%', y: '5%',  delay: 0.4,  size: '1.6rem',duration: 7  },
  { icon: '🏧', x: '40%', y: '93%', delay: 2.2,  size: '1.8rem',duration: 10 },
];

export default function LoginPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const { login, isLoading, error, clearError, token, isInitialized, initialize } = useAuthStore();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [cursor, setCursor]     = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (isInitialized && token) router.replace('/dashboard');
  }, [isInitialized, token, router]);

  useEffect(() => {
    clearError();
  }, [email, password, clearError]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    if (!hasMoved) setHasMoved(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) router.push('/dashboard');
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #0e1428 0%, #050816 70%)' }}
    >
      {/* ── Cursor spotlight glow ── */}
      {hasMoved && (
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px,
              rgba(99,102,241,0.12) 0%,
              rgba(139,92,246,0.07) 30%,
              transparent 70%)`,
          }}
        />
      )}

      {/* ── Animated mesh gradient base ── */}
      <div className="absolute inset-0 z-0 animated-gradient-bg opacity-60" />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 z-0 dot-grid opacity-40" />

      {/* ── Floating finance icons ── */}
      {FINANCE_ICONS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: item.x, top: item.y, fontSize: item.size }}
          animate={{ y: [0, -18, 0], rotate: [-4, 4, -4], opacity: [0.18, 0.35, 0.18] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* ── Soft corner orbs ── */}
      <div className="floating-orb animate-orb-drift-1" style={{ width: 420, height: 420, background: '#6366f1', top: -120, left: -120 }} />
      <div className="floating-orb animate-orb-drift-2" style={{ width: 320, height: 320, background: '#8b5cf6', bottom: -80, right: -80 }} />
      <div className="floating-orb animate-orb-drift-3" style={{ width: 260, height: 260, background: '#06b6d4', bottom: '25%', right: '12%' }} />

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card gradient-border p-8 sm:p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">💹</span>
              <h1 className="text-3xl font-bold gradient-text">FinanceFlow</h1>
            </div>
            <p className="text-sm text-slate-400">Smart Financial Dashboard</p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
            >
              <p className="text-rose-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                className="input-glass"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                className="input-glass"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </motion.div>
          </form>

          {/* Register link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-center text-sm text-slate-400 mt-6"
          >
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign up
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
