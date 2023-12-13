import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  host: 'host.docker.internal',
  user: 'postgres',
  password: 'w123',
  port: 5432,
  database: 'mess'
})

export default pool