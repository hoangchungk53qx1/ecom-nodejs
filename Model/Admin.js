const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AdminSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true }
});

AdminSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hahedPassword = await bcrypt.hash(this.password, salt);
        this.password = hahedPassword;
        this.confirmPassword = hahedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

AdminSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error
    }
}


const  Admin = mongoose.model('admin', AdminSchema)
module.exports =  Admin;
