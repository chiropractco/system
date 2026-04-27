import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres.onwgfixvbyknotnbrkgr:Lc6Vj7ItpzB9a9gl@aws-1-us-east-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    // Tables
    const { rows: tables } = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;
    `);
    console.log('📊 Tables:');
    tables.forEach(r => console.log(`  ✅ ${r.table_name}`));

    // RLS policies
    const { rows: policies } = await client.query(`
      SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
    `);
    console.log('\n🔒 RLS Policies:');
    policies.forEach(r => console.log(`  ${r.tablename}: ${r.policyname}`));

    // Functions
    const { rows: funcs } = await client.query(`
      SELECT routine_name FROM information_schema.routines 
      WHERE routine_schema = 'public' AND routine_type = 'FUNCTION' ORDER BY routine_name;
    `);
    console.log('\n⚙️ Functions:');
    funcs.forEach(r => console.log(`  ✅ ${r.routine_name}`));

    // Triggers
    const { rows: triggers } = await client.query(`
      SELECT event_object_table, trigger_name FROM information_schema.triggers
      WHERE trigger_schema = 'public' ORDER BY event_object_table;
    `);
    console.log('\n🔔 Triggers:');
    triggers.forEach(r => console.log(`  ${r.event_object_table}: ${r.trigger_name}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
