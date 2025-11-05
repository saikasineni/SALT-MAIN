import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Zap } from 'lucide-react';

export default function WinCelebration({ show, onClose, points, message }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-8 max-w-md text-center shadow-2xl">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="inline-block mb-4"
              >
                <Trophy className="w-20 h-20 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                🎉 Congratulations! 🎉
              </h2>
              
              <p className="text-white text-xl mb-4">
                {message || "You're doing great!"}
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="w-6 h-6 text-white" />
                <span className="text-4xl font-bold text-white">+{points}</span>
                <Zap className="w-6 h-6 text-white" />
              </div>
              
              <Button 
                onClick={onClose}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold"
              >
                Keep Learning! 🚀
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}