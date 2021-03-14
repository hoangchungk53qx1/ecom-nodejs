const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword:{ type: String, required: true},

});

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hahedPassword = await bcrypt.hash(this.password, salt);
        this.confirmPassword = hahedPassword;
        this.password = hahedPassword;

        next();
    } catch (error) {
        next(error);
    }
})


UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error
    }
}


const User = mongoose.model('user', UserSchema)
module.exports = User
