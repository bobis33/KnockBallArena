import React from 'react';
import ReactDOM from 'react-dom/client';
import './Styles/global.scss';
import Auth from "./Components/Connections/Auth";
import { RealtimeProvider } from "./Providers/RealTimeContext";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <RealtimeProvider>
        <Auth />
    </RealtimeProvider>
);
