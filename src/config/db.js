const mysql = require('mysql2/promise');
const { createClient } = require('redis');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true, 
    keepAliveInitialDelay: 0,
});


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-18045.c323.us-east-1-2.ec2.cloud.redislabs.com',
        port: 18045
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
        
        const connection = await pool.getConnection();
        console.log("Connected to MySQL");
        connection.release();
    } catch (err) {
        console.error("Connection Failed:", err);
    }
})();

module.exports = { pool, redisClient };

