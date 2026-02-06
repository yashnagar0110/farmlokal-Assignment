const express = require('express');
const ProductService = require('./services/ProductService');

require('dotenv').config();

const app = express();
app.use(express.json());


app.get('/products', async (req, res) => {
    try {
        const result = await ProductService.getProducts(req.query);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.get('/metrics', (req, res) => {
    res.json({
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        status: 'healthy'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});