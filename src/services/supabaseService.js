const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xyz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'dummy_key';

if(!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.warn("WARNING: Supabase URL or Key not set. Using mock client for UI presentation.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
