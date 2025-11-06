import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Crown, Github, Linkedin, Sparkles, Trophy, Target } from 'lucide-react';
import { PreviewBoard } from './PreviewBoard';

interface HeroSectionProps {
  onPlayClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlayClick }) => {
  const [currentFeature, setCurrentFeature] = React.useState(0);
  
  const features = [
    { icon: Brain, text: "Advanced AI", color: "text-cyan-400" },
    { icon: Crown, text: "4 Difficulty Levels", color: "text-purple-400" },
    { icon: Target, text: "Move Analysis", color: "text-green-400" },
    { icon: Trophy, text: "Win Tracking", color: "text-yellow-400" }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-6 md:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div 
            className="space-y-6 md:space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                           border border-cyan-500/30 rounded-full text-sm text-cyan-300 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Chess Experience</span>
            </motion.div>

            {/* Main heading with enhanced typography */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Challenge Our AI
              </span>
              <br />
              <span className="text-white">Master Chess</span>
            </motion.h1>
            
            {/* Enhanced description */}
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Test your skills against our advanced chess AI. Multiple difficulty levels from beginner to grandmaster with real-time analysis.
            </motion.p>
            
            {/* Enhanced CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={onPlayClick}
                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 
                         rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3
                         shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-3">
                  Play Now
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </motion.button>
              
              {/* Animated feature showcase */}
              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    {(() => {
                      const CurrentIcon = features[currentFeature].icon;
                      return <CurrentIcon className={`w-5 h-5 ${features[currentFeature].color}`} />;
                    })()}
                    <span className="text-sm sm:text-base text-white font-medium">{features[currentFeature].text}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Enhanced social links */}
            <motion.div 
              className="flex items-center gap-6 justify-center lg:justify-start pt-8 lg:pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <motion.a 
                  href="https://github.com/Neorex80" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-gray-400 
                           hover:text-white hover:bg-white/20 transition-all hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/devrex/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-gray-400 
                           hover:text-white hover:bg-white/20 transition-all hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              </div>
              <div className="text-sm sm:text-base text-gray-400">
                Made with <span className="text-red-500">♥</span> by Rushikesh Pawar
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Preview Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Desktop Preview Board */}
            <div className="hidden lg:block">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  <PreviewBoard />
                </div>
              </motion.div>
            </div>

            {/* Tablet Preview Board */}
            <div className="hidden md:block lg:hidden w-full max-w-md mx-auto">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <PreviewBoard />
                </div>
              </motion.div>
            </div>

            {/* Mobile Preview Board */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:hidden w-full max-w-sm mx-auto"
            >
              <div className="relative bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <PreviewBoard />
              </div>
            </motion.div>

            {/* Floating badges around preview */}
            <motion.div
              className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 
                           text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [-5, 5, -5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              LIVE
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};