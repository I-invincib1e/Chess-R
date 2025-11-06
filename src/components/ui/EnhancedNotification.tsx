import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info, Trophy, Brain } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'ai-thinking';

interface EnhancedNotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EnhancedNotification: React.FC<EnhancedNotificationProps> = ({
  type,
  message,
  description,
  isVisible,
  onClose,
  duration = 4000,
  action,
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getNotificationConfig = (notificationType: NotificationType) => {
    switch (notificationType) {
      case 'success':
        return {
          icon: Check,
          bgColor: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/50',
          iconColor: 'text-green-400',
          titleColor: 'text-green-300',
        };
      case 'error':
        return {
          icon: X,
          bgColor: 'from-red-500/20 to-pink-500/20',
          borderColor: 'border-red-500/50',
          iconColor: 'text-red-400',
          titleColor: 'text-red-300',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-500/50',
          iconColor: 'text-yellow-400',
          titleColor: 'text-yellow-300',
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/50',
          iconColor: 'text-blue-400',
          titleColor: 'text-blue-300',
        };
      case 'achievement':
        return {
          icon: Trophy,
          bgColor: 'from-purple-500/20 to-indigo-500/20',
          borderColor: 'border-purple-500/50',
          iconColor: 'text-purple-400',
          titleColor: 'text-purple-300',
        };
      case 'ai-thinking':
        return {
          icon: Brain,
          bgColor: 'from-cyan-500/20 to-purple-500/20',
          borderColor: 'border-cyan-500/50',
          iconColor: 'text-cyan-400',
          titleColor: 'text-cyan-300',
        };
      default:
        return {
          icon: Info,
          bgColor: 'from-gray-500/20 to-zinc-500/20',
          borderColor: 'border-gray-500/50',
          iconColor: 'text-gray-400',
          titleColor: 'text-gray-300',
        };
    }
  };

  const config = getNotificationConfig(type);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-24 right-6 z-50 max-w-sm"
          initial={{ opacity: 0, x: 400, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
        >
          <motion.div
            className={`relative bg-gradient-to-br ${config.bgColor} backdrop-blur-md rounded-2xl 
                     border ${config.borderColor} shadow-2xl overflow-hidden`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Animated background pattern */}
            {type === 'achievement' && (
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${20 + i * 20}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}

            {type === 'ai-thinking' && (
              <div className="absolute inset-0">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            <div className="relative p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  className={`p-2 bg-white/10 rounded-xl ${config.iconColor}`}
                  animate={type === 'ai-thinking' ? {
                    rotate: [0, 360],
                  } : {}}
                  transition={type === 'ai-thinking' ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  } : {}}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${config.titleColor} mb-1`}>
                    {message}
                  </h4>
                  {description && (
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {description}
                    </p>
                  )}

                  {/* Action button */}
                  {action && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.onClick}
                      className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg 
                               text-sm font-medium text-white transition-colors"
                    >
                      {action.label}
                    </motion.button>
                  )}
                </div>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Progress bar for auto-dismiss */}
              {duration > 0 && type !== 'ai-thinking' && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: duration / 1000, ease: "linear" }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast container for multiple notifications
interface ToastContainerProps {
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  return (
    <div className="fixed top-24 right-6 z-50 space-y-3 max-w-sm">
      {children}
    </div>
  );
};