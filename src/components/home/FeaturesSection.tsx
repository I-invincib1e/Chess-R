import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Trophy, Target, Zap, Sparkles, BarChart3, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Advanced AI Engine',
    description: 'Challenge our sophisticated chess AI powered by neural networks and advanced algorithms.',
    color: 'from-cyan-400 to-blue-500',
    stats: '4 Difficulty Levels',
    highlight: 'Neural Network Based'
  },
  {
    icon: Target,
    title: 'Precision Training',
    description: 'Improve your skills with targeted exercises and personalized feedback.',
    color: 'from-purple-400 to-pink-500',
    stats: '500+ Training Positions',
    highlight: 'Adaptive Learning'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track your progress with comprehensive statistics and performance metrics.',
    color: 'from-green-400 to-emerald-500',
    stats: 'Live Performance Data',
    highlight: 'Move-by-Move Analysis'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience instant responses and smooth gameplay with optimized performance.',
    color: 'from-yellow-400 to-orange-500',
    stats: '<100ms Response Time',
    highlight: 'Optimized Engine'
  },
  {
    icon: Shield,
    title: 'Fair Play Guarantee',
    description: 'Enjoy a secure and fair gaming environment with anti-cheat protection.',
    color: 'from-red-400 to-pink-500',
    stats: '100% Fair Play',
    highlight: 'Protected Environment'
  },
  {
    icon: Sparkles,
    title: 'Beautiful Themes',
    description: 'Customize your experience with stunning visual themes and board designs.',
    color: 'from-indigo-400 to-purple-500',
    stats: '10+ Unique Themes',
    highlight: 'Customizable Experience'
  }
];

export const FeaturesSection = () => {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                         border border-cyan-500/30 rounded-full text-sm text-cyan-300 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Next-Generation Chess Platform</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              AI-Powered Chess
            </span>
            <br />
            <span className="text-white">Experience</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Challenge yourself against our advanced chess engine with cutting-edge features designed to elevate your game
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
                         rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <div className="relative h-full p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300">
                {/* Icon with animation */}
                <motion.div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>

                {/* Stats and highlight */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span>{feature.stats}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                    <span className="text-xs text-cyan-300 font-medium">{feature.highlight}</span>
                  </div>
                </div>

                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="text-white text-sm">→</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                         border border-cyan-500/30 rounded-2xl backdrop-blur-sm">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div className="text-left">
              <div className="text-white font-semibold">Join 10,000+ Players</div>
              <div className="text-sm text-gray-400">Training daily and improving their skills</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};