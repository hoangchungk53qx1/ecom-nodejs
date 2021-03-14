const createError = require('http-errors')
const mongoose = require("mongoose");
const moment = require('moment');
const Products = require("../Model/Product");
const Comment = require('../Model/Comment');
const User = require('../Model/User');

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
    }
    sorting() {
        this.query = this.query.sort('-timeComment')
        return this;
    }
}
class APIComments {
    constructor(query, queryString) {
        this.query = query;
    }
    sortingccomment() {
        this.query = this.query.sort('-timeComment')
        return this;
    }
}

module.exports = {

    POST_COMMENTS: async (req, res, next) => {
        try {
            const { start, id_product, content,array_product } = req.body;
            const onlyUser = await User.findById({ _id: req.data.id });
            const timeComment = moment().format();
            const newCommnet = new Comment({
                _id: new mongoose.Types.ObjectId(),
                id_product: id_product,
                array_product:array_product,
                content: content,
                start: start,
                timeComment: timeComment,
                id_user: onlyUser._id,
                name: onlyUser.name,
                avatar: onlyUser.avatar
            });
            if (start && start !== 0) {
                const product = await Products.findById(id_product);
                let num = product.numReviews;
                let rate = product.rating;
                const options = { new: true };
                const data = {
                    rating: rate + start,
                    numReviews: num + 1
                }
                await Products.findByIdAndUpdate(id_product, data, options);
            }
            const result = await newCommnet.save();
            const dataComments = await Comment.find({ id_product: id_product });
            res.status(200).json({
                length: dataComments.length,
                data: result
            });
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    },

    GET_ID_PRODUCTS: async (req, res, next) => {
        try {
            const { _id_product } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const start = (page - 1) * limit;
            const end = start + limit;
            const features = new APIfeatures(Comment.find({ id_product: _id_product }), req.query).sorting();
            const dataComments = await Comment.find({ id_product: _id_product });
            const comments = await features.query;
            const resultComments = comments.slice(0, end);
            res.status(200).json({
                status: 'success',
                start: 0,
                end: end,
                limit: limit,
                length: dataComments.length,
                data: resultComments,
            })
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, "invalid product id"));
                return;
            }
            next(error);
        }
    },

    DELETE_ID_COMMENT: async (req, res, next) => {
        const { id, _id_product } = req.query;
        try {
            const commnet = await Comment.findByIdAndDelete(id);
            const product = await Products.findById(_id_product);
            let num = product.numReviews;
            let rate = product.rating;
            let start_cmt = commnet.start;
            if (start_cmt > 0) {
                const options = { new: true };
                const data = {
                    rating: rate - start_cmt,
                    numReviews: num - 1
                }
                await Products.findByIdAndUpdate(_id_product, data, options);
            }
            if (!commnet) { createError(404, 'Product does not'); }
            const dataComments = await Comment.find({ id_product: _id_product });
            res.status(200).json({
                status: 'success',
                length: dataComments.length,
                data: commnet,
            })
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    },
    HISTORY_COMMENT: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const iteml = parseInt(req.query.iteml) || 5;
            const start = (page - 1) * iteml;
            const end = start + iteml;
            const onlyUser = await User.findById({ _id: req.data.id });
            const { _id } = onlyUser;
            const features = new APIComments(Comment.find({ id_user: _id }), req.query).sortingccomment();
            const list_comments = await features.query;
            const length_data = await Comment.find({ id_user: _id });
            const result_comments = list_comments.slice(0, end);
            res.status(200).json({
                status: 'success',
                start: 0,
                end: end,
                iteml: iteml,
                length: length_data.length,
                data: result_comments,
            })
        } catch (error) {
            res.json({
                error: error,
            })
        }
    }
}