import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';

interface SettingsProps {
  userId: string;
  onClose: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userId, onClose, onLogout }) => {
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('username')
          .eq('id', userId)
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
        .eq('id', userId);
      if (error) {
        throw error;
      }

      alert('Username updated successfully!');
      setNewUsername('');
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
          style={{ fontSize: '2rem' }}
        >
          &times;
        </button>
        <h2 className="text-xl mb-4">Settings</h2>
        <input
          type="text"
          placeholder={currentUsername || 'New Username'}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="text-black px-4 py-2 rounded mb-4 border-2 border-black"
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
        <motion.button
          className="mt-4 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={onLogout}
        >
          Disconnect
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Settings;
