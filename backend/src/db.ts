import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database");
  })
  .catch((err) => {
    console.log("Error connecting to the PostgreSQL database", err);
  });


export default pool;
