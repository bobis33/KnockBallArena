import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Customize from '../Customize/Customize';
import Three1 from './Three1';
import Three2 from './Three2';
import { supabase } from '../../supabaseClient';

interface HomePageProps {
  onLogout: () => void;
  userId: string;
}

export default function HomePage({ onLogout, userId }: HomePageProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

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
    setIsCustomizeMode(false);
  };

  return (
      <div>
        <AnimatePresence>
          {!isCustomizeMode ? (
              <>
                <Three1 />
                <div className="min-h-screen flex flex-col items-center justify-center relative">
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

                  <div className="mt-8">
                    <input
                        type="text"
                        placeholder={currentUsername || 'New Username'}
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="text-black px-4 py-2 rounded"
                    />
                    <motion.button
                        className="ml-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={updateUsername}
                        disabled={loading || !newUsername}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                      {loading ? 'Updating...' : 'Change Username'}
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
