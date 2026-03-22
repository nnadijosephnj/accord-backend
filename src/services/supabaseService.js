const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("SUPABASE_URL or SUPABASE_KEY is missing from environment. App will likely fail authenticated requests.");
}

const supabase = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_KEY || 'dummy_key');

// Debugging (Safe logic to show prefixes only)
if (SUPABASE_URL && SUPABASE_KEY) {
    console.log(`Supabase initialized for: ${SUPABASE_URL.substring(0, 15)}...`);
    console.log(`Key prefix: ${SUPABASE_KEY.substring(0, 6)}...`);
}

module.exports = supabase;
