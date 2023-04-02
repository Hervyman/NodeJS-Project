const express = require("express");
const router = express.Router()
const joi = require("joi")
const bcrypt = require("bcrypt")

const { User } = require("../model/users");

router.post("/", async (req, res)=>{
    const { error } = validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("invalid email");
      return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        res.status(400).send("invalid password");
        return;
      }
    const token = user.generateAuthToken();
    
    res.send({token})
})

const validate = (user)=>{
    const schema = joi.object({
        email:joi.string().min(6).max(255).required(),
        password:joi.string().min(6).max(255).required(),
    })
    return schema.validate(user)
}

module.exports = router