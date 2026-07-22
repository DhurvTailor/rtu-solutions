// import mysql from "mysql2/promise";

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
//   ssl: {
//     rejectUnauthorized: true,
//   },
// });

// export default pool; 



// import mysql from "mysql2/promise";

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// export default pool;



// lib/db.js
import mysql from "mysql2/promise";

const globalForDb = global;

if (!globalForDb._mysqlPool) {
  globalForDb._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
    ssl: {
      rejectUnauthorized: false,
    },
    // 🔑 Yeh limits add karo
    connectionLimit: 5,        // B1ms ke liye max 5 connections
    waitForConnections: true,  // Queue karo, reject mat karo
    queueLimit: 10,            // Max 10 requests wait karein
    connectTimeout: 10000,     // 10s timeout
    idleTimeout: 60000,        // 60s idle pe connection close
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });
}

const pool = globalForDb._mysqlPool;
export default pool;