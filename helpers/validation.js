const Joi = require('@hapi/joi');

const authuShema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})


module.exports ={
    authuShema,
}