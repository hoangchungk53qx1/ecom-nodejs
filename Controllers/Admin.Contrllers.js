const createError = require('http-errors')
const mongoose = require("mongoose");

const { authuShema } = require('../helpers/validation');
const { signRefreshToken, signAccessToken } = require('../helpers/jwt_helpers');

const Product = require("../Model/Product");
const Admin = require('../Model/Admin');
const User = require('../Model/User');
const Cart = require('../Model/Cart');
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
    }
    sorting() {
        this.query = this.query.sort('-timeCart')
        return this;
    }
}
module.exports = {
   
    LOGIN: async (req, res, next) => {
        try {
            const result = await authuShema.validateAsync(req.body);
            const admin = await Admin.findOne({ email: result.email });
            if (!admin) throw createError.NotFound('User not registered');
            const isMatch = await admin.isValidPassword(result.password);
            if (!isMatch) throw createError.Unauthorized('Username/password not valid');
            const accesToken = await signAccessToken(admin._id)
            const refreshToken = await signRefreshToken(admin._id)
            res.send({ accesToken: accesToken, refreshToken: refreshToken });
        } catch (error) {
            if (error.isJoi === true)
                return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },

    PROFILE: async (req, res, next) => {
        const admin = await Admin.findById(req.data.id);
        res.json(admin);
    },

    GET_ALL_USER: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const user = await User.find({}, {});
                res.status(200).json({
                    data: user
                })
            } else {
                res.send(createError(404, 'no user found'))
            }
        }
        catch (error) {
            res.send(createError(404, 'no user found'))
        }
    },
 

    CHECK_OUT_CARD: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            const { id_Card } = req.query;
            const options = { new: true };
            const data = {
                success: true,
            }
            if (admin) {
                const result = await Cart.findByIdAndUpdate(id_Card, data, options);
                res.status(200).json({
                    data: result
                });
            } else {
                res.send(createError(404, 'no Cart found'))
            }

        }
        catch (error) {
            res.send(createError(404, 'no Cart found'))
        }
    },
    LIST_CARD: async (req, res, next) => {
        try {
            const { success } = req.query || '';
            if (success === 'true') {
                const features = new APIfeatures(Cart.find({ success: success }, {}), req.query).sorting();
                const list_card = await features.query;
                res.status(200).json({
                    length: list_card.length,
                    data: list_card
                })
            } else if (success === 'false') {
                const features = new APIfeatures(Cart.find({ success: success }, {}), req.query).sorting();
                const list_card = await features.query;
                res.status(200).json({
                    length: list_card.length,
                    data: list_card
                })
            } else {
                const features = new APIfeatures(Cart.find({}, {}), req.query).sorting();
                const list_card = await features.query;
                res.status(200).json({
                    length: list_card.length,
                    data: list_card
                })
            }
        } catch (error) {
            console.log(error)
        }
    },

}