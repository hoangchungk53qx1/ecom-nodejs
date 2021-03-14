const createError = require('http-errors')
const mongoose = require("mongoose");
const moment = require('moment');

const Cart = require('../Model/Cart');
const User = require("../Model/User");

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    sorting() {
        this.query = this.query.sort('-timeCart')
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
module.exports = {

    ADD_CART: async (req, res, next) => {
        try {
            const timeCart = moment().format();
            const newCart = new Cart({
                _id: new mongoose.Types.ObjectId(),
                id_User: req.data.id,
                address: req.body.address,
                phone: req.body.phone,
                totalSum: req.body.totalSum,
                timeCart: timeCart,
                cart: req.body.cart,
                payment: req.body.payment,
                success: false,
                status_order: true
            })
            const result = await newCart.save();
            res.status(200).json({
                data: result
            })
        } catch (error) {
            res.send(createError(404, error))
        }
    },

    GET_CART: async (req, res, next) => {
        try {

            const features = new APIfeatures(Cart.find({ id_User: req.data.id }), req.query).sorting().paginating();
            const cart = await features.query;
            res.status(200).json({
                status: 'success',
                data: cart,

            })
        } catch (error) {
            res.send(createError(404, 'no cart found'))
        }
    },

    UPDATE_ADDRESS: async (req, res, next) => {
        try {
            const { id } = req.data;
            const options = { new: true };
            const { address, phone } = req.body;
            const { id_card } = req.query;
            const data = {
                address: address,
                phone: phone,
            }
            const user = await User.findById(id);
            if (user) {
                const card = await Cart.findByIdAndUpdate(id_card, data, options);
                res.status(200).json({
                    status: "update success",
                    data: [card]
                })
            }
        } catch (error) {
            res.status(error)
        }
    },
    STATUS_ORDER: async (req, res, next) => {
        try {
            const { id } = req.data;
            const options = { new: true };
            const { status_order } = req.body;
            const { id_card } = req.query;
            const data = {
                status_order: status_order,
            }
            const data_success = {
                success: false,
                status_order: status_order
            }
            const user = await User.findById(id);
            if (user) {
                if (status_order) {
                    const card = await Cart.findByIdAndUpdate(id_card, data_success, options);
                    res.status(200).json({
                        status: "update success",
                        data: [card]
                    });
                } else {
                    const card = await Cart.findByIdAndUpdate(id_card, data, options);
                    res.status(200).json({
                        status: "update success",
                        data: [card]
                    });
                }
            }
        } catch (error) {
            res.status(error)
        }
    }
}