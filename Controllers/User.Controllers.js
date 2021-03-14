const createError = require('http-errors')
const mongoose = require("mongoose");
const fs = require("fs");
const cloudinary = require('cloudinary');
const { authuShema } = require('../helpers/validation');
const { signRefreshToken, signAccessToken, verilyRefreshToken } = require('../helpers/jwt_helpers');

const Comment = require('../Model/Comment');
const User = require("../Model/User");


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


module.exports = {
    REGISTER: async (req, res, next) => {
        try {
            const { email, name, password } = req.body;
            const doseExists = await User.findOne({ email: email });
            if (doseExists) throw createError.Conflict('tài khoản này tồn tại');
            const userSave = new User({
                _id: new mongoose.Types.ObjectId(),
                name: name.trim(),
                email: email.trim(),
                password: password,
                confirmPassword: password,
            });
            const result = await userSave.save();
            res.status(200).json({
                data: result
            })
        } catch (error) {
            if (error.name === 'ValidationError') {
                next(createError(422, error.message));
                return;
            }
            next(error);
        }
    },

    PROFILE: async (req, res, next) => {
        const user = await User.findById(req.data.id);
        res.status(200).json({
            data: [user]
        });
    },
    LOGIN: async (req, res, next) => {
        try {
            const result = await authuShema.validateAsync(req.body);
            const user = await User.findOne({ email: result.email });
            if (!user) throw createError.NotFound('User not registered');
            const isMatch = await user.isValidPassword(result.password);
            if (!isMatch) throw createError.Unauthorized('Username/password not valid');
            const accesToken = await signAccessToken(user._id)
            const refreshToken = await signRefreshToken(user._id)
            res.send({ accesToken: accesToken, refreshToken: refreshToken });
        } catch (error) {
            if (error.isJoi === true)
                return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },

    REFRESH_TOKEN: async (req, res, next) => {
        try {
            const refreshToken = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const id = await verilyRefreshToken(refreshToken);
            const accesToken = await signAccessToken(id);
            const refToken = await signRefreshToken(id);

            res.send({ accesToken: accesToken, refreshToken: refToken })
        } catch (error) {
            next(error);
        }
    },

    UPDATA_IMAGE_USER: async (req, res, next) => {
        try {
            const { id } = req.data;
            const options = { new: true };

            const file = req.file;
            cloudinary.v2.uploader.upload(file.path, { folder: 'test' }, async (error, result) => {
                if (result) {
                    const userSave = {
                        avatar: result.url,
                    }
                    const update = {
                        avatar: result.url,
                    }
                    const user = await User.findByIdAndUpdate(id, userSave, options);
                    const comment = await Comment.updateMany({ id_user: id }, update, options);
                    res.json({
                        user: [user],
                        comment: comment,
                    })
                }
            })

        } catch (error) {
            res.send(error);
            if (error instanceof mongoose.CastError) {
                return next(createError(400, "invalid product id"));
            }
        }
    },
    INFORMATION: async (req, res, next) => {
        try {
            const { id } = req.data;
            const { name, sex } = req.body;
            const options = { new: true };
            const data = {
                name: name,
                sex: sex
            }

            const user = await User.findByIdAndUpdate(id, data, options);
            const comment = await Comment.updateMany({ id_user: id }, { name: name }, options);
            res.status(200).json({
                status: "updata success",
                data: [user],
                comment: comment
            })
        } catch (error) {
            console.log('error', error)
        }
    },


}