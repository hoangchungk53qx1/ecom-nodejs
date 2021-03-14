const mongoose = require("mongoose");
const newComment = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    id_product: { type: String, required: true },
    array_product: { type: Array, required: true},
    content: { type: String, required: true },
    start: { type: Number},
    timeComment: { type: String, required: true },
    id_user:{ type: String, required: true },
    name: { type: String, required: true },
    avatar:{ type: String, required: true }
   
})
module.exports = mongoose.model('Comment', newComment);