const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://ecommerce_user:password@postgres:5432/ecommerce'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};