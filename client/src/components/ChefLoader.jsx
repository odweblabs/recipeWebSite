import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Utensils } from 'lucide-react';

const ChefLoader = ({ text = '', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <div className="relative">
        {/* Outer Glowing Circle */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-chefie-yellow/20 rounded-full blur-2xl"
        />

        {/* Orbiting Pot/Utensils Effect */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 w-24 h-24 -m-4 border-2 border-dashed border-chefie-yellow/30 rounded-full"
        />

        {/* Main Animated Icon */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-16 h-16 bg-chefie-yellow text-white rounded-[20px] shadow-xl flex items-center justify-center z-10"
        >
          <ChefHat className="w-9 h-9" />
          
          {/* Sparkles */}
          <motion.div
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="absolute -top-1 -right-1"
          >
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
          </motion.div>
          <motion.div
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-1 -left-1"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Text with Shimmer Effect */}
      {text && (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm font-black text-chefie-text uppercase tracking-[0.2em] ml-1"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default ChefLoader;
