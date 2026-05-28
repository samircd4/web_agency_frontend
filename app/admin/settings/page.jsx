'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <motion.div
        {...fadeIn()}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">
            Settings
          </h1>
          <p className="text-slate-500 text-xs">
            Configure system preferences and settings.
          </p>
        </div>
      </motion.div>

      <motion.div
        {...fadeIn(0.1)}
        className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl text-slate-500 text-sm"
      >
        Settings module coming soon!
      </motion.div>
    </div>
  );
}
