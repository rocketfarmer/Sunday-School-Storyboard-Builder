import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  className?: string;
}
export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  className = ''
}: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) &&
      <div className="flex justify-between mb-1">
          {label &&
        <span className="text-sm font-medium text-gray-700">{label}</span>
        }
          {showPercentage &&
        <span className="text-sm font-medium text-gray-500">
              {Math.round(progress)}%
            </span>
        }
        </div>
      }
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-amber-500 h-2.5 rounded-full"
          initial={{
            width: 0
          }}
          animate={{
            width: `${progress}%`
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut'
          }} />

      </div>
    </div>);

}