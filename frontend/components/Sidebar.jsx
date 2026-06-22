'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/useAuthStore';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/transactions', label: 'Transactions', icon: '💳' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/budgets', label: 'Budgets', icon: '💰' },
];

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 },
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: 280,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 40,
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99, 102, 241, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <motion.div
        variants={itemVariants}
        className="px-6 py-8"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            📊
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">FinanceFlow</h1>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">Dashboard</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-2">
        <motion.p
          variants={itemVariants}
          className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3"
        >
          Menu
        </motion.p>
        <div className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');

            return (
              <motion.div key={link.href} variants={itemVariants}>
                <button
                  onClick={() => router.push(link.href)}
                  className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive ? '#ffffff' : 'rgba(148, 163, 184, 0.8)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {/* Active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15))',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.1)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 text-lg">{link.icon}</span>
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: '#6366f1', boxShadow: '0 0 8px #6366f1' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Divider */}
      <div className="mx-6 my-2">
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)' }} />
      </div>

      {/* User section */}
      <motion.div
        variants={itemVariants}
        className="p-4 mx-3 mb-4 rounded-xl"
        style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(99, 102, 241, 0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
            }}
          >
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.email || 'user@email.com'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-3 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: 'rgba(244, 63, 94, 0.08)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.12)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.25)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>🚪</span>
          Sign Out
        </button>
      </motion.div>
    </motion.aside>
  );
}
