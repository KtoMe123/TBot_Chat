import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  user: 'postgres',
  password: 'w123',
  host: "localhost",
  port: 5432,
  database: 'mess'
})

export default pool