import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Settings, User, ChevronLeft } from 'lucide-react';

interface NavigationProps {
  onNavigate: (page: 'home' | 'settings' | 'game') => void;
  currentPage: 'home' | 'settings' | 'game';
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const getButtonClasses = (isActive: boolean) => `
    relative px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3
    ${isActive 
      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
    }
    backdrop-blur-sm
    before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:opacity-0 hover:before:opacity-10
    before:transition-opacity before:duration-300
  `;

  return (
    <motion.nav 
      className="fixed top-6 right-6 z-50 flex items-center gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button when in game */}
      <AnimatePresence>
        {currentPage === 'game' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('home')}
            className="px-4 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 
                     text-orange-300 rounded-xl font-medium border border-orange-500/30 
                     backdrop-blur-sm shadow-lg shadow-orange-500/10
                     hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300
                     flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navigation container */}
      <motion.div 
        className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.id as 'home' | 'settings')}
              className={getButtonClasses(isActive)}
            >
              <Icon className="w-5 h-5" />
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:block whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
                           rounded-xl border border-cyan-500/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* User indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 
                 text-purple-300 rounded-xl font-medium border border-purple-500/30 
                 backdrop-blur-sm shadow-lg shadow-purple-500/10
                 flex items-center gap-2"
      >
        <User className="w-5 h-5" />
        <span className="hidden sm:inline">Player</span>
      </motion.div>
    </motion.nav>
  );
};