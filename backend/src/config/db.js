const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY is missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

const connectDB = async () => {
  try {
    // Quick ping to check Supabase connection
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log(`ℹ️ Supabase connected (Table query note: ${error.message})`);
    } else {
      console.log(`✅ Supabase PostgreSQL connected successfully!`);
    }
  } catch (error) {
    console.error(`❌ Supabase connection error: ${error.message}`);
  }
};

module.exports = connectDB;
module.exports.supabase = supabase;
