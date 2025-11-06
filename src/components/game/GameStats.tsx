import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Brain, Zap, Award } from 'lucide-react';

interface GameStatsProps {
  moveCount: number;
  captureCount: number;
  averageThinkTime: number;
  accuracy: number;
  bestMoveCount: number;
  mistakeCount: number;
  blunderCount: number;
  gameTime: string;
}

export const GameStats: React.FC<GameStatsProps> = ({
  moveCount,
  captureCount,
  averageThinkTime,
  accuracy,
  bestMoveCount,
  mistakeCount,
  blunderCount,
  gameTime,
}) => {
  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return 'text-green-400';
    if (acc >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAccuracyLabel = (acc: number) => {
    if (acc >= 90) return 'Excellent';
    if (acc >= 75) return 'Good';
    if (acc >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color = "text-cyan-400",
    trend 
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:bg-black/60 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 bg-white/10 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <motion.div
            className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : '0%'}
          </motion.div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
          <Brain className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Performance Analytics</h3>
          <p className="text-sm text-gray-400">Real-time game statistics</p>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={Target}
            label="Total Moves"
            value={moveCount}
            color="text-blue-400"
            trend="up"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            icon={Zap}
            label="Captures"
            value={captureCount}
            color="text-red-400"
            trend="neutral"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            icon={Clock}
            label="Avg Think Time"
            value={`${averageThinkTime}s`}
            color="text-yellow-400"
            trend="down"
          />
        </motion.div>
      </div>

      {/* Accuracy Section */}
      <motion.div
        className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Move Accuracy</h4>
              <p className="text-sm text-gray-400">Quality of your moves</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </div>
            <div className="text-sm text-gray-400">{getAccuracyLabel(accuracy)}</div>
          </div>
        </div>

        {/* Accuracy Bar */}
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${
              accuracy >= 90 ? 'from-green-500 to-emerald-500' :
              accuracy >= 75 ? 'from-yellow-500 to-orange-500' :
              'from-red-500 to-pink-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Move Quality Breakdown */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-lg font-semibold text-white">Move Quality Breakdown</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-300">Best Moves</span>
            </div>
            <span className="text-green-400 font-semibold">{bestMoveCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-gray-300">Mistakes</span>
            </div>
            <span className="text-yellow-400 font-semibold">{mistakeCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-gray-300">Blunders</span>
            </div>
            <span className="text-red-400 font-semibold">{blunderCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Game Time */}
      <motion.div
        className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">Game Duration</span>
          </div>
          <span className="text-white font-semibold">{gameTime}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};