import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

interface ProfilePayload {
    [key: string]: any;
}

export const RealTimeContext = createContext<ProfilePayload | null>(null);

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [realtimePayload, setRealtimePayload] = useState<ProfilePayload | null>(null);

    useEffect(() => {
        const channel = supabase
            .channel('realtime:public:profile')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profile' },
                (payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>) => {
                    setRealtimePayload(payload.new);
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return (
        <RealTimeContext.Provider value={realtimePayload}>
            {children}
        </RealTimeContext.Provider>
    );
};
