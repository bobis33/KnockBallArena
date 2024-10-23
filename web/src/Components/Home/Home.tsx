import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Customize from '../Customize/Customize';
import Three1 from './Three1';
import Three2 from './Three2';
import { supabase } from '../../supabaseClient';
import Three3 from './Three3';
import Leaderboard from '../Stats/Leaderboard';
import ReturnButton from './ReturnButton';

interface HomePageProps {
  onLogout: () => void;
  userId: string;
}

const texturePaths = [
  'skins/BasketballColor.jpg',
  'skins/NewTennisBallColor.jpg',
  'skins/SoftballColor.jpg',
];

export default function HomePage({ onLogout, userId }: HomePageProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState<string>(texturePaths[0]);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data, error } = await supabase
            .from('profile')
            .select('username')
            .eq('user_id', userId)
            .single();

        if (error) {
          throw error;
        }

        if (data) {
          setCurrentUsername(data.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [userId]);

  const updateUsername = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
          .from('profile')
          .update({ username: newUsername })
          .eq('user_id', userId);
      if (error) {
        throw error;
      }

      alert('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizeClick = () => {
    setIsCustomizeMode(true);
  };

  const handleBackToHome = () => {
    setIsExiting(true);

    setTimeout(() => {
      setIsExiting(false);
      setIsCustomizeMode(false);
    }, 1000);
  };

  const handleTextureChange = (texturePath: string) => {
    setSelectedTexture(texturePath);
  };

  const handleStartClick = () => {
    setIsStarted(true);
  };

  const handleReturnToHome = () => {
    setIsStarted(false);
  };

  return (
    <div>
      <AnimatePresence>
        {!isCustomizeMode && !isStarted ? (
          <>
            <Leaderboard />
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
              <div className="space-x-12 px-20">
                <motion.button
                  className={`w-64 py-4 text-xl font-semibold bg-gray-800 bg-opacity-50 rounded-full transition duration-300 ${
                    hoveredButton === 'start' ? 'bg-white text-gray-800' : 'text-white border-4 border-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredButton('start')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={handleStartClick}
                >
                  Start
                </motion.button>
                <motion.button
                  className={`w-64 py-4 text-xl font-semibold bg-gray-800 bg-opacity-50 rounded-full transition duration-300 ${
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
        ) : isStarted ? (
          <div>
            <Three3 />
            <ReturnButton
              onReturn={handleReturnToHome}
              text='Back to Menu'
              className='absolute top-4 left-4 px-4 py-2 text-lg font-semibold rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition duration-300'
            />
          </div>
        ) : (
          <div className="flex items-start">
            <Three2 sphereTexturePath={selectedTexture} />
            <motion.div
              className="flex-none"
              initial={{ x: isExiting ? 0 : '-100%' }}
              animate={{ x: isExiting ? '-100%' : 0 }}
              transition={{ duration: 1 }}
            >
              <Customize
                onBack={handleBackToHome}
                onTextureChange={handleTextureChange}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
