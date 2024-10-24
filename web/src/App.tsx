import React from 'react';
import './styles/global.scss';

import { RealtimeProvider } from './Providers/RealTimeContext';


import Auth from './Components/Connections/Auth';

function App() {
  return (
      <RealtimeProvider>
        <Auth />
      </RealtimeProvider>
  );
}

export default App;
