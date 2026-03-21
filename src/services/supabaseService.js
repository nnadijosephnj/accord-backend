const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

let supabase;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("CRITICAL WARNING: SUPABASE_URL or SUPABASE_KEY is missing. Profile saving will NOT work, but the app will stay alive using a mock backend.");
    
    // Non-breaking Mock Client
    supabase = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: null }),
                    select: () => ({ single: () => Promise.resolve({ data: null, error: null }) })
                }),
                select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) })
            }),
            insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'mock' }, error: null }) }) }),
            upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'mock' }, error: null }) }) }),
            update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'mock' }, error: null }) }) }) })
        })
    };
} else {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

module.exports = supabase;
