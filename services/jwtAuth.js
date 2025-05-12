const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;
console.log(secret);


//generate token 
const setUser = (user) => {
    //jwt.sign(payload,key);
    return jwt.sign({_id:user._id,email:user.email},secret);
}

//generate token for reset password with expiry
const resetPasswordToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email, tokenType: 'reset' }, secret, { expiresIn: '15m' });
}

//verify token
const getUser = (token) => {
    return jwt.verify(token, secret);
}

module.exports = {
    setUser,
    getUser,
    resetPasswordToken
}
