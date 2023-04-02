const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const { JWTSecretToken } = require("../configs/config")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 255 },
  email:{type: String, required: true, minLength: 6, maxLength: 255, unique:true},
  password:{type: String, required: true, minLength: 6, maxLength: 1000},
  biz:{type: Boolean, required: true},
  createdAt:{type: Date, default: Date.now}
});


const validateUser = (user)=>{
    const schema = joi.object({
        name:joi.string().min(2).max(255).required(),
        email:joi.string().min(6).max(255).required(),
        password:joi.string().min(6).max(255).required(),
        biz:joi.boolean().required(),
    })
    return schema.validate(user)
}

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id:this._id, biz:this.biz}, JWTSecretToken)
}

const User = mongoose.model("user", userSchema, "users");

module.exports = {User, validateUser}
