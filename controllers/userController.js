const userModel = require("../models/userModel");
const jwtAuth = require('../services/jwtAuth');
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const mailUtil = require("../services/mailUtil");
 
const signup = async(req,res)=> {
    try{

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;

        const data = req.body;
        console.log(data);
        const user = new userModel(data);
        const response = await user.save();
        console.log('data saved', response);
        res.status(200).json({message:"User Signup Successfully!"})
    
    }catch(error){

        console.log(error);
        res.status(500).json({
          error:"Internal server error"
        })
    }
}

const login = async(req,res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }

        //compare the password enetred atv the time of login with the stored password(hashed) 
        const isMatch = bcrypt.compareSync(password,user.password);

        if(!isMatch){
            return res.status(400).json({message: "Incorrect Password"})
        }

        const token = jwtAuth.setUser(user);
        // console.log(token);

        res.status(200).json({
            message: "Login Success",
            data: user,
            token: token
        })
        
    }catch(error){
        console.log(error);
        res.status(500).json({
          error:"Internal server error"
        })
    }
}

const forgotPassword = async(req,res) => {

    try{
        const email = req.body.email;
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwtAuth.resetPasswordToken(user);
        console.log(token);
    
        const url = `http://localhost:5173/resetpassword/${token}`;
        const mailContent = `<html>
                                <a href = "${url}">Click here to reset Password</a>
                            </html>`;

        await mailUtil.sendingMail(user.email, 'Reset Password', mailContent);

        return res.status(200).json({ 
            message: "Reset password link sent",
            data: {email:user.email}
        });

    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const resetpassword = async(req,res) => {
    try{
       
        const {token, password } = req.body;

        if(!token){
            return res.status(400).json({
                message: "Token is missing"
            })
        }

        //get the user from the token
        const user = jwtAuth.getUser(token);
        if(!user || user.tokenType !== 'reset'){
             return res.status(400).json({ message: "Invalid token" });
        }

        //Hash new Password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        //find the user by userId and update the password(hashed)
        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        return res.status(200).json({
            message: "Password Update SUccessfully"
        })

    }catch(error){
        console.log(error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
}

module.exports = {
    signup,
    login,
    forgotPassword,
    resetpassword
}