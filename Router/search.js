const express = require("express");
const Product = require("../Model/Product");
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const keyword = req.query.keyword.toLowerCase();
        const page = parseInt(req.query.page) || 1;
        const perPage = 16;
        const start = (page - 1) * perPage;
        const end = start + perPage
        const product = await Product.find({
            $or: [
                { name: { $regex: `${keyword}.*` } },
                { key: { $regex: `${keyword}.*` } },
                { description: { $regex: `${keyword}.*` } },
                { productType: { $regex: `${keyword}.*` } },
                { collections: { $regex: `${keyword}.*` } },
                { NSX: { $regex: `${keyword}.*` } }
            ]
        }, { __v: 0 });
        const resultProducts = product.slice(start, end);
        res.status(200).json({
            page: page,
            start: start,
            end: end,
            lengthProducts: product.length,
            data: resultProducts,
        })
    } catch (error) {
        res.send(createError(404, error))
    }

});


module.exports = router;