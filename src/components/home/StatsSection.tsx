import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Award, BookOpen, TrendingUp, Target, Zap, Shield } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '2M+',
    label: 'Active Players',
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
    growth: '+25%',
    description: 'Growing daily'
  },
  {
    icon: Clock,
    value: '10M+',
    label: 'Games Played',
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    growth: '+40%',
    description: 'This month'
  },
  {
    icon: Award,
    value: '50K+',
    label: 'Tournaments',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
    growth: '+15%',
    description: 'Completed'
  },
  {
    icon: Target,
    value: '87%',
    label: 'Accuracy Rate',
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    growth: '+5%',
    description: 'Average player'
  }
];

const additionalStats = [
  {
    icon: BookOpen,
    value: '100K+',
    label: 'Training Puzzles',
    color: 'text-indigo-400'
  },
  {
    icon: Zap,
    value: '<100ms',
    label: 'Response Time',
    color: 'text-pink-400'
  },
  {
    icon: Shield,
    value: '99.9%',
    label: 'Uptime',
    color: 'text-cyan-400'
  },
  {
    icon: TrendingUp,
    value: '4.8★',
    label: 'User Rating',
    color: 'text-yellow-400'
  }
];

export const StatsSection = () => {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Platform Statistics
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of players improving their chess skills every day
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {/* Glow effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} 
                         rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
              />
              
              <div className={`relative p-8 rounded-2xl bg-black/40 backdrop-blur-md border ${stat.borderColor} 
                           hover:border-white/20 transition-all duration-300 h-full`}>
                {/* Icon and growth indicator */}
                <div className="flex items-start justify-between mb-6">
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} ${stat.borderColor} border`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">{stat.growth}</span>
                  </motion.div>
                </div>

                {/* Value */}
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                >
                  {stat.value}
                </motion.div>

                {/* Label and description */}
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats Bar */}
        <motion.div
          className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md rounded-2xl 
                   border border-white/10 p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {additionalStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <motion.div
                  className={`inline-flex p-3 rounded-xl bg-white/10 mb-4 ${stat.color}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="w-5 h-5" />
                </motion.div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Secure Platform</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-300">Lightning Fast</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Award Winning</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};