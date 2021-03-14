const mongoose = require("mongoose");
const bannerSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    banner: { type: String,required: true},
});
module.exports = mongoose.model('banner', bannerSchema); 