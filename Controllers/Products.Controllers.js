const mongoose = require("mongoose");
const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const fs = require("fs")
const cloudinary = require('../cloudinary');
const Product = require("../Model/Product");
const Admin = require("../Model/Admin");
const moment = require('moment');
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
    }
    sorting() {
        this.query = this.query.sort('-createdAt')
        return this;
    }
}
module.exports = {
    GET_PRODUCTS: async (req, res, next) => {
        try {
            //   get time create
            const page = parseInt(req.query.page) || 1;
            const perPage = 24;
            const start = (page - 1) * perPage;
            const end = start + perPage
            const features = new APIfeatures(Product.find({}, { __v: 0 }), req.query).sorting();
            const productAll = await Product.find({}, { __v: 0 });
            const lengthProducts = productAll.length;
            const products = await features.query;
            const resultProducts = products.slice(0, end);
            res.status(200).json({
                page: page,
                start: 0,
                end: end,
                lengthProducts: lengthProducts,
                data: resultProducts,
            })
        } catch (error) {

            res.send(createError(404, error));
            console.log(error)
        }
    },

    FORM_SEARCH: async (req, res, next) => {
        try {
            const keyword = req.query.keyword.trim().toLowerCase();
            const page = parseInt(req.query.page) || 1;
            const perPage = 24;
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
                data: resultProducts,
                page: page,
                start: start,
                end: end,
                lengthProducts: product.length
            })
        } catch (error) {
            res.send(createError(404, error))
        }

    },

    TYPES_PRODUCT: async (req, res, next) => {
        try {
            const name = req.query.name.trim().toLowerCase();
            const page = parseInt(req.query.page) || 1;
            const sort_Price = parseInt(req.query.sort_Price);
            const perPage = 16;
            const start = (page - 1) * perPage;
            const end = start + perPage
            const product = await Product.find({ key: name }, { __v: 0 }).sort({ price: sort_Price });
            if (!product) throw createError(404, 'Product does not');
            res.status(200).json({
                length: product.length,
                start: start,
                page: page,
                end: end,
                data: product.slice(start, end),
            })
        } catch (error) {
            res.send(createError(404, error))
        }
    },

    NSX: async (req, res, next) => {
        try {
            const NSX = req.params.NSX.replace(/-/g, ' ').trim().toLowerCase();
            const sort_price = parseInt(req.query.sort_price);
            const page = parseInt(req.query.page) || 1;
            const perPage = 12;
            const start = (page - 1) * perPage;
            const end = start + perPage
            const product = await Product.find({ NSX: NSX }, { __v: 0 }).sort({ price: sort_price });;
            if (!product) throw createError(404, 'Product does not');
            res.status(200).json({
                length: product.length,
                start: start,
                page: page,
                end: end,
                data: product.slice(start, end),
            })

        } catch (error) {
            res.send(createError(404, error))
        }
    },

    ADD_PRODUCTS: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            const { name, price, sex, color, collections, productType, description, key, NSX } = req.body;
            const createdAt = moment().format();
            if (admin) {
                const uploader = async (path) => await cloudinary.uploads(path, 'poster');
                if (req.method === 'POST') {
                    const urls = [];
                    const poster = req.files;
                    for (const file of poster) {
                        const { path } = file;
                        const newPath = await uploader(path);
                        urls.push(newPath);
                        fs.unlinkSync(path);
                    }
                    const product = new Product({
                        _id: new mongoose.Types.ObjectId(),
                        name: name.trim().toLowerCase(),
                        size: [
                            { "options": 38 },
                            { "options": 39 },
                            { "options": 40 },
                            { "options": 41 },
                            { "options": 42 },
                            { "options": 43 },
                        ],
                        price: price.trim(),
                        numReviews:0,
                        rating:0,
                        sex: sex.trim(),
                        poster: urls,
                        color: color.trim(),
                        collections: collections.trim(),
                        productType: productType.trim(),
                        description: description.trim(),
                        key: key.trim().toLowerCase(),
                        NSX: NSX.trim().toLowerCase(),
                        createdAt: createdAt
                    });
                    const result = await product.save()
                    res.status(200).json({
                        message: 'image upload successful',
                        urls: result
                    })

                } else {
                    res.status(405).json({
                        error: 'image upload failed'
                    })
                }
            } else {
                res.send(createError(404, err));

            }
        } catch (err) {
            res.send(createError(404, err));
            console.log(err)
        }

    },

    GET_ID: async (req, res, next) => {

        try {
            const { id } = req.query;
            const product = await Product.findById({ _id: id }, { __v: 0 });
            if (!product) throw createError(404, 'Product does not');
            res.status(200).json({
                data: [product],
            });
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, "invalid product id"));
                return;
            }
            next(error);
        }
    },

    UPDATED_ID: async (req, res, next) => {
        try {
            const { id } = req.query;
            // res.send(id)
            // const admin = await Admin.findById(req.data.id);
            const createdAt = moment().format();
            const options = { new: true };
            const data = {
                NSX: 'vans sk8 hi'
            }
            const product = await Product.findByIdAndUpdate(id, data, options);
            res.status(200).json({
                status: 'success',
                data: product
            })
        } catch (error) {
            res.send(error);
            if (error instanceof mongoose.CastError) {
                return next(createError(400, error));
            }
        }
    },

    DELETE_ID: async (req, res, next) => {

        try {
            const { id } = req.query;
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const result = await Product.findByIdAndDelete(id);
                if (!result) {
                    res.send(createError(404, 'Product does not'));
                }
                res.send(result);
            } else {
                res.send(createError(404, 'Product does not'));
            }


        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, "invalid product id"));
                return;
            }
            next(error);
            res.send(error);
        }
    }
}