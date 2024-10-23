import { useState, useEffect } from 'react';
import Connection from './Connection';
import CreateAccount from './CreateAccount';
import HomePage from '../Home/Home';
import { supabase } from '../../supabaseClient';
import { Session } from '@supabase/supabase-js'; // Import du type Session

export default function Auth() {
  const [currentView, setCurrentView] = useState<'login' | 'createAccount' | 'home'>('login');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setCurrentView('home');
      }
    };

    checkSession();
  }, []);

  const switchToCreateAccount = () => setCurrentView('createAccount');
  const switchToLogin = () => setCurrentView('login');

  const switchToHome = () => {
    setCurrentView('home');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      setCurrentView('login');
    } else {
      console.error("Error logging out: ", error);
    }
  };

  return (
      <div>
        {currentView === 'login' && (
            <Connection
                onSwitchToCreateAccount={switchToCreateAccount}
                onSwitchToHome={switchToHome}
            />
        )}
        {currentView === 'createAccount' && (
            <CreateAccount onSwitchToLogin={switchToLogin} />
        )}
        {currentView === 'home' && <HomePage onLogout={handleLogout} userId={session?.user.id || ''} />}
      </div>
  );
}
