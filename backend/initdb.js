const fs = require('fs');
const pg = require('pg');
const { Pool } = pg;

const DATABASE_URL = ""; // Dummy value
const PGHOST = "localhost";
const PGDATABASE = "testdb";
const PGUSER = "testuser";
const PGPASSWORD = "testpassword";
const PGPORT = 5432;

const pool = new Pool(
  DATABASE_URL
    ? { 
        connectionString: DATABASE_URL, 
        ssl: { require: true } 
      }
    : {
        host: PGHOST || "ep-ancient-dream-abbsot9k-pooler.eu-west-2.aws.neon.tech",
        database: PGDATABASE || "neondb",
        user: PGUSER || "neondb_owner",
        password: PGPASSWORD || "npg_jAS3aITLC5DX",
        port: Number(PGPORT),
        ssl: { require: true },
      }
);


async function initDb() {
  const client = await pool.connect();
  try {
    // Begin transaction
    await client.query('BEGIN');
    
    // Read and split SQL commands
    const dbInitCommands = fs
      .readFileSync(`./db.sql`, "utf-8")
      .toString()
      .split(/(?=CREATE TABLE |INSERT INTO)/);

    // Execute each command
    for (let cmd of dbInitCommands) {
      console.dir({ "backend:db:init:command": cmd });
      await client.query(cmd);
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('Database initialization completed successfully');
  } catch (e) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Database initialization failed:', e);
    throw e;
  } finally {
    // Release client back to pool
    client.release();
  }
}

// Execute initialization
initDb().catch(console.error);
