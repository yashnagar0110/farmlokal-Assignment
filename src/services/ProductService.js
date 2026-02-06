const { pool, redisClient } = require('../config/db');
const crypto = require('crypto');

class ProductService {
    
    static async getProducts({ cursor, limit, category, minPrice }) {
        const fetchLimit = parseInt(limit, 10) || 20;
        const currentCursor = parseInt(cursor, 10) || 0;

        const filterString = JSON.stringify({ cursor: currentCursor, limit: fetchLimit, category, minPrice });
        const cacheKey = `products:${crypto.createHash('md5').update(filterString).digest('hex')}`;

        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (err) {
            console.error("Redis Error:", err); 
        }

        let query = `SELECT id, name, price, category, created_at FROM products WHERE id > ?`;
        const params = [currentCursor]; 
        const [rows] = await pool.execute(query, params);

        const result = {
            data: rows,
            nextCursor: rows.length === fetchLimit ? rows[rows.length - 1].id : null
        };

        try {
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 60 });
        } catch (err) {
             console.error("Redis Set Error:", err);
        }

        return result;
    }
}

module.exports = ProductService;