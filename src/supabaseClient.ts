import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'http://127.0.0.1:54321';
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

supabase
    .channel('realtime:public:profile')
    .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profile' },
        () => {}
    )
    .subscribe();
