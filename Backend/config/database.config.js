require('dotenv').config();

module.exports = {
  host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postman_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL is required for TiDB Cloud - always enable it
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
};
