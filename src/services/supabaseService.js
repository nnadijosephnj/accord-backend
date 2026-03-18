const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if(!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("WARNING: Supabase URL or Key not set.");
}

const supabase = createClient(SUPABASE_URL || 'https://xyz.supabase.co', SUPABASE_KEY || 'dummy_key');

module.exports = supabase;
