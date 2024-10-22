import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './../../styles/global.scss';

export default function Connection() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // État pour l'email
  const [password, setPassword] = useState(''); // État pour le mot de passe
  const [error, setError] = useState(null); // État pour les erreurs
  const [loading, setLoading] = useState(false); // État pour indiquer le chargement

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Empêche le rechargement de la page

    setLoading(true); // Commence le chargement
    setError(null); // Réinitialise les erreurs

    // Effectue la requête de connexion
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false); // Arrête le chargement

    // Redirigez l'utilisateur ou gérez le succès ici
    console.log('Successfully logged in!');
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Connect to Your Account</h2>
            <p className="text-center text-gray-600 mb-8">Enter your email and password to log in</p>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email} // Liaison de l'email
                      onChange={(e) => setEmail(e.target.value)} // Met à jour l'état
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        value={password} // Liaison du mot de passe
                        onChange={(e) => setPassword(e.target.value)} // Met à jour l'état
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={togglePasswordVisibility}
                    >
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <button
                    type="submit"
                    disabled={loading} // Désactive le bouton lors du chargement
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Logging in...' : 'Log In'} {/* Affiche un message de chargement */}
                </button>
                {error && <p className="text-red-500 text-center">{error}</p>} {/* Affiche les erreurs */}
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?
                </div>
                <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create an Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
