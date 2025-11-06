import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Sparkles, Gamepad2 } from 'lucide-react';
import { GamePreferences, GameSetupStep } from '../../types/game';
import { PreferencesStep } from './PreferencesStep';
import { ThemeSelectionStep } from './ThemeSelectionStep';
import { ThemeType } from '../../types/theme';

interface GameSetupFlowProps {
  onComplete: (preferences: GamePreferences, theme: ThemeType) => void;
  onCancel: () => void;
}

export const GameSetupFlow: React.FC<GameSetupFlowProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<GameSetupStep>('preferences');
  const [preferences, setPreferences] = useState<GamePreferences>({
    difficulty: 'medium',
    soundEnabled: true,
    showHints: true,
  });
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('cyber');

  const handleNext = () => {
    if (step === 'preferences') {
      setStep('theme');
    } else if (step === 'theme') {
      onComplete(preferences, selectedTheme);
    }
  };

  const handleBack = () => {
    if (step === 'theme') {
      setStep('preferences');
    }
  };

  const getStepNumber = () => {
    return step === 'preferences' ? 1 : 2;
  };

  const getStepTitle = () => {
    return step === 'preferences' ? 'Game Preferences' : 'Choose Theme';
  };

  const getStepDescription = () => {
    return step === 'preferences' 
      ? 'Configure your game settings and difficulty level'
      : 'Select your preferred board theme and visual style';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-zinc-900/95 to-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
        className="relative w-full max-w-4xl bg-black/40 backdrop-blur-xl rounded-3xl 
                 border border-white/10 shadow-2xl overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <motion.div 
          className="relative bg-gradient-to-r from-cyan-500/10 to-purple-500/10 
                   border-b border-white/10 px-6 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 
                         rounded-xl border border-cyan-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Gamepad2 className="w-6 h-6 text-cyan-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Game Setup</h2>
                <p className="text-gray-400 mt-1">{getStepDescription()}</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              {[1, 2].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                              ${stepNum <= getStepNumber() 
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                                : 'bg-white/10 text-gray-500'}`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {stepNum <= getStepNumber() ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        ✓
                      </motion.div>
                    ) : (
                      stepNum
                    )}
                  </motion.div>
                  {stepNum < 2 && (
                    <motion.div
                      className={`h-1 w-16 rounded-full ${
                        stepNum < getStepNumber() ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-white/10'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: stepNum < getStepNumber() ? 64 : 64 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              Step {getStepNumber()} of 2: {getStepTitle()}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {step === 'preferences' ? (
                <PreferencesStep
                  preferences={preferences}
                  onPreferencesChange={setPreferences}
                  onNext={handleNext}
                  onCancel={onCancel}
                />
              ) : (
                <ThemeSelectionStep
                  selectedTheme={selectedTheme}
                  onThemeChange={setSelectedTheme}
                  onNext={() => onComplete(preferences, selectedTheme)}
                  onBack={handleBack}
                  onCancel={onCancel}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with navigation */}
        <motion.div 
          className="border-t border-white/10 px-6 py-4 bg-black/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={step === 'preferences' ? onCancel : handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 
                       rounded-xl text-gray-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 'preferences' ? 'Cancel' : 'Back'}
            </motion.button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">
                {step === 'preferences' ? 'Configure your game' : 'Choose your style'}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 
                       hover:from-cyan-400 hover:to-purple-500 rounded-xl text-white font-semibold 
                       shadow-lg hover:shadow-xl transition-all"
            >
              {step === 'theme' ? 'Start Game' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};