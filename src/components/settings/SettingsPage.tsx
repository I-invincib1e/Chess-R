import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Volume2, Eye, Zap, Shield, Bell, User, Globe } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { GamePreferences } from './GamePreferences';
import { ThemeType } from '../../types/theme';

interface SettingsPageProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const settingsSections = [
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the visual theme and interface',
      component: <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
    },
    {
      icon: Volume2,
      title: 'Audio',
      description: 'Configure sound effects and notifications',
      component: <GamePreferences />
    },
    {
      icon: Eye,
      title: 'Accessibility',
      description: 'Adjust display and interaction settings',
      component: <div className="text-gray-400">Coming soon...</div>
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <motion.div
              className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Settings className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Settings</h1>
              <p className="text-xl text-gray-400">Customize your chess experience</p>
            </div>
          </div>

          {/* Quick Settings Bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: Bell, label: 'Notifications', value: 'On' },
              { icon: Volume2, label: 'Sound', value: 'Enabled' },
              { icon: Globe, label: 'Language', value: 'English' },
              { icon: Shield, label: 'Privacy', value: 'Protected' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 hover:bg-black/60 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <item.icon className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-sm text-gray-400">{item.label}</div>
                <div className="text-white font-medium">{item.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Settings Sections */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {settingsSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="p-3 bg-white/10 rounded-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <section.icon className="w-6 h-6 text-cyan-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                        <p className="text-sm text-gray-400">{section.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {section.component}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Profile Card */}
              <motion.div 
                className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <User className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Player Profile</h4>
                    <p className="text-sm text-gray-400">Level 12 • 2,450 XP</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Games Played</span>
                    <span className="text-white">342</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-green-400">67%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Accuracy</span>
                    <span className="text-cyan-400">82%</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <motion.button
                    className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">Clear Cache</span>
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white">Reset Settings</span>
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="text-white">Test Notifications</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};