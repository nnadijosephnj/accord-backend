require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { ethers } = require('ethers');

async function runStressTest() {
    console.log("🚀 STARTING BACKEND STRESS TEST...");
    let passed = true;

    // 1. SUPABASE TEST
    console.log("\n[1] Testing Supabase Database Connection...");
    try {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) throw error;
        console.log("✅ SUPABASE OK: Successfully connected! Found user data or empty live table.");
    } catch (e) {
        console.error("❌ SUPABASE FAILED:", e.message);
        passed = false;
    }

    // 2. INJECTIVE BLOCKCHAIN TEST
    console.log("\n[2] Testing Injective RPC Connection...");
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ INJECTIVE OK: Successfully connected! Current block number: ${blockNumber}`);
    } catch (e) {
        console.error("❌ INJECTIVE FAILED:", e.message);
        passed = false;
    }

    // 3. PINATA TEST
    console.log("\n[3] Testing Pinata JWT Authentication...");
    try {
        const fetch = require('node-fetch'); // Using dynamic import for node-fetch v3 or require for v2
        const res = await fetch('https://api.pinata.cloud/data/testAuthentication', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");
        console.log("✅ PINATA OK: Successfully authenticated!", data.message);
    } catch (e) {
        // Fallback for native fetch in Node 18+
        try {
            const res = await global.fetch('https://api.pinata.cloud/data/testAuthentication', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.PINATA_JWT}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Authentication failed");
            console.log("✅ PINATA OK: Successfully authenticated!", data.message);
        } catch(err2) {
             console.error("❌ PINATA FAILED:", err2.message);
             passed = false;
        }
    }

    // FINAL
    console.log("\n=============================");
    if (passed) {
        console.log("🎉 ALL TESTS PASSED! The code is 100% connected to live services.");
    } else {
        console.log("⚠️ SOME TESTS FAILED. Please review the errors above.");
    }
}

runStressTest();
