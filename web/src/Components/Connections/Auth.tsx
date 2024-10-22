import { useState, useEffect } from 'react';
import Connection from './Connection';
import CreateAccount from './CreateAccount';
import HomePage from '../Home/Home';

export default function Auth() {
  const [currentView, setCurrentView] = useState<'login' | 'createAccount' | 'home'>('login');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setCurrentView('home');
    }
  }, []);

  const switchToCreateAccount = () => setCurrentView('createAccount');
  const switchToLogin = () => setCurrentView('login');
  const switchToHome = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setCurrentView('login');
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
      {currentView === 'home' && <HomePage onLogout={handleLogout} />}
    </div>
  );
}
