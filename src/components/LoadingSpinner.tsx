import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';

export const LoadingSpinner = () => {
  const loadingTexts = [
    "Preparing the board...",
    "Analyzing strategies...",
    "Warming up the AI...",
    "Setting up pieces...",
    "Ready to play..."
  ];

  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loadingTexts.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-zinc-900/95 to-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="relative">
        {/* Animated background circles */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-cyan-500/20"
              style={{
                width: `${120 + i * 40}px`,
                height: `${120 + i * 40}px`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Central chess piece */}
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 flex items-center justify-center text-6xl"
              animate={{
                textShadow: [
                  "0 0 20px rgba(6, 182, 212, 0.5)",
                  "0 0 40px rgba(168, 85, 247, 0.5)",
                  "0 0 20px rgba(6, 182, 212, 0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ♟
            </motion.div>
            
            {/* Sparkle effects */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Loading text with animation */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTextIndex}
              className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loadingTexts[currentTextIndex]}
            </motion.p>
          </AnimatePresence>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};