import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Customize from '../Components/Customize/Customize';
import Three1 from '../Components/Home/Three1';
import Three2 from '../Components/Home/Three2';
import Three3 from '../Components/Home/Three3';
import Three4 from '../Components/Home/Three4';
import Leaderboard from '../Components/Stats/Leaderboard';
import ReturnButton from '../Components/Home/ReturnButton';
import Settings from '../Components/Settings/Settings';
import { supabase } from '../supabaseClient';

interface HomePageProps {
  onLogout: () => void;
}

const texturePaths = [
  'skins/polboule.jpg',
  'skins/titanboule.png',
  'skins/bobiboule.png',
  'skins/julboule.png',
];

export default function HomePage({ onLogout }: HomePageProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState<string>(texturePaths[0]);
  const [isStarted, setIsStarted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStartPopupOpen, setIsStartPopupOpen] = useState(false);
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [isMultiMode, setIsMultiMode] = useState(false);

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
    setIsStartPopupOpen(true);
  };

  const handleSoloClick = () => {
    setIsSoloMode(true);
    setIsStarted(true);
    setIsStartPopupOpen(false);
  };

  const handleMultiClick = () => {
    setIsMultiMode(true);
    setIsStarted(true);
    setIsStartPopupOpen(false);
  };

  const handleReturnToHome = () => {
    setIsStarted(false);
    setIsSoloMode(false);
    setIsMultiMode(false);
  };

  const BackgroundMusic = ({ musicPath }: { musicPath: string }) => {
    useEffect(() => {
      const audio = new Audio(musicPath);
      audio.loop = true; // Pour que la musique se répète
      audio.volume = 0.5; // Ajuste le volume si nécessaire
      audio.play().catch((error) => {
        console.error('Erreur lors de la lecture de la musique :', error);
      });

      return () => {
        audio.pause(); // Arrête la musique quand le composant est démonté
        audio.currentTime = 0; // Réinitialise le temps de lecture
      };
    }, []);
  
    return null; // Ne rend rien dans le DOM
  };

  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            setUserId(data.session.user.id);
        }

    };

    checkSession();
}, []);

  

  return (
    <div>
      <AnimatePresence>
        {!isCustomizeMode && !isStarted ? (
          <>
            <Leaderboard />
            <Three1 />
            <BackgroundMusic musicPath="menu.mp3" />
            <div className="min-h-screen flex flex-col items-center justify-center relative">
              <img
                src="/logo.png"
                alt="KnockBallArena2"
                className="mx-auto mb-12"
                style={{ width: '40%', height: 'auto' }}
              />
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
              <div className="mt-4">
                <motion.button
                  className={`w-64 py-4 text-xl font-semibold bg-gray-800 bg-opacity-50 rounded-full transition duration-300 ${
                    hoveredButton === 'settings' ? 'bg-white text-gray-800' : 'text-white border-4 border-white'
                  }`}
                  onMouseEnter={() => setHoveredButton('settings')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => setIsSettingsOpen(true)}
                >
                  Settings
                </motion.button>
              </div>
              {isSettingsOpen && (
                <Settings
                  onClose={() => setIsSettingsOpen(false)}
                  onLogout={onLogout}
                />
              )}

              {isStartPopupOpen && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg space-y-4">
                    <motion.button
                      className="w-64 py-4 text-xl font-semibold bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSoloClick}
                    >
                      Solo
                    </motion.button>
                    <motion.button
                      className="w-64 py-4 text-xl font-semibold bg-gray-800 text-white rounded-full transition duration-300 hover:bg-gray-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMultiClick}
                    >
                      Multi
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : isSoloMode ? (
          <div>
            <BackgroundMusic musicPath="ingame.mp3" />
            <Three4 userId={userId.toString()} score={score} shpereTexturePath={selectedTexture} />
            <ReturnButton
              onReturn={handleReturnToHome}
              text="Back to Menu"
              className="absolute top-4 left-4 px-4 py-2 text-lg font-semibold rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition duration-300"
            />
            <div>
              <h1>Score: {score}</h1>
              <Three4 userId={userId.toString()} score={score} shpereTexturePath={selectedTexture} />
            </div>
          </div>
        ) : isMultiMode ? (
          <div>
            <BackgroundMusic musicPath="ingame.mp3" />
            <Three3 />
            <ReturnButton
              onReturn={handleReturnToHome}
              text="Back to Menu"
              className="absolute top-4 left-4 px-4 py-2 text-lg font-semibold rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition duration-300"
            />
          </div>
        ) : (
          <div className="flex items-start">
            <Three2 sphereTexturePath={selectedTexture} />
            <motion.div
              className="flex-none"
              initial={{ x: isExiting ? 0 : '-100%' }}
              animate={{ x: isExiting ? '-100%' : 0 }}
              transition={{ duration: 0.5 }}
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
