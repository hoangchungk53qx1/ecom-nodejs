const createError = require('http-errors')
const mongoose = require("mongoose");
const fs = require("fs");
const cloudinary = require('../cloudinary');

const Banner = require('../Model/Banner');
const Admin = require("../Model/Admin");

module.exports = {
    GET_BANNER: async (req, res, next) => {
        try {
            const banner = await Banner.find({}, { __v: 0 });
            res.status(200).json({
                data: banner
            })
        } catch (error) {
            res.send(createError(404, 'no banner found'))
        }
    },

    ADD_BANNERS: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const uploader = async (path) => await cloudinary.uploads(path, 'banner');
                if (req.method === 'POST') {
                    const banner = req.files;
                    for (const file of banner) {
                        const { path } = file;
                        const newPath = await uploader(path);
                        const banerSave = new Banner({
                            _id: new mongoose.Types.ObjectId(),
                            banner: newPath.url,
                        });
                        fs.unlinkSync(path);
                        const result = await banerSave.save();
                        res.status(200).json({
                            data: result
                        })
                    }
                }
            }
        } catch (error) {
            res.send(createError(404, 'no banner found'))
        }
    },

    DELETE_BANNER: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            const { id } = req.query;
            if (admin) {
                const result = await Banner.findByIdAndDelete(id);
                res.send(result);
            }
            else {
                res.send(createError(404, 'Product does not'));
            }
        } catch (error) {
            res.send(createError(404, 'no banner found'))
        }
    }
}