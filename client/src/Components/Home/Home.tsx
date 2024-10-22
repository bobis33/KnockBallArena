import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Customize from '../Customize/Customize';
import Three1 from './Three1';
import Three2 from './Three2';

interface HomePageProps {
  onLogout: () => void;
}

export default function HomePage({ onLogout }: HomePageProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);

  const handleCustomizeClick = () => {
    setIsCustomizeMode(true);
  };

  const handleBackToHome = () => {
    setIsCustomizeMode(false);
  };

  return (
    <div>
      <AnimatePresence>
      {!isCustomizeMode ? (
        <>
          <Three1 />
          <div className='min-h-screen flex flex-col items-center justify-center relative'>
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-12 text-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to THE Game
            </motion.h1>
            <div className="space-y-6 space-x-12">
              <motion.button
                className={`w-64 py-4 text-xl font-semibold rounded-full transition duration-300 ${
                  hoveredButton === 'start' ? 'bg-white text-gray-800' : 'text-white border-4 border-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredButton('start')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Start
              </motion.button>
              <motion.button
                className={`w-64 py-4 text-xl font-semibold rounded-full transition duration-300 ${
                  hoveredButton === 'customize' ? 'bg-white text-gray-800' : 'text-white border-4 border-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredButton('customize')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleCustomizeClick}
              >
                Customize
              </motion.button>
            </div>

            <motion.button
              className="absolute top-0 right-0 mt-4 mr-4 w-32 py-2 text-lg font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
            >
              Disconnect
            </motion.button>
          </div>
        </>
      ) : (
        <div className="flex items-start">
          <Three2 />
          <motion.div
            className="flex-none"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1 }}
          >
            <Customize onBack={handleBackToHome} />
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
