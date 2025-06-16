const db = require('../../../config/db');
const config = require('../../../config/config');
const crypto = require('crypto');
const Joi = require('joi');
const tokenGenerator = require('../../../src/utils/tokenGenerator');
const loginValidation = require('../../../src/validations/auth/loginValidation');
const authModel = require('../../models/customer/authModel');
const forgetPasswordValidation = require('../../../src/validations/auth/forgetPasswordValidation');
const resetPasswordValidation = require('../../../src/validations/auth/resetPasswordValidation');
const emailHelper = require("../../../src/utils/emailHelper");
const userLogin = async (req, res) => {
    try {
        const {email, password } = req.body; 

        const { isValid, errors } = await loginValidation.validData({ email, password });
        if (!isValid) {
           return res.status(400).json({ message: "Please provide all required fields", data: errors });
        }

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const [rows] = await db.execute('SELECT id, first_name, last_name, email FROM users WHERE email = ? AND password = ?', [email, hashedPassword]);
         if (rows.length === 0) {
             return res.status(200).json({message: 'Invalid login credentials'});
         }        
        const token = tokenGenerator.generateToken({ id: rows.id, email: rows.email, first_name: rows.first_name, first_name: rows.first_name },  config.jwt.secret, config.jwt.expiresIn);
        res.status(200).json({ message: "You have logged In successfully", token , user: rows});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const userForgetPassword = async (req, res) =>{   
    try {
       const {email} = req.body;
        const { isValid, errors } = await forgetPasswordValidation.validData({ email });
        if (!isValid) {
            return res.status(400).json({ message: "Please provide all required fields", data: errors });
        }
        const existingEmail = await authModel.getUserByEmail(email);
       if(!existingEmail){
                 return res.status(422).json({message: 'Email not exists', });
             }
           
        const resetPasswordToken = await authModel.savePasswordToken(existingEmail.id);
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${resetPasswordToken}`;

        let emailBody =  `
            <p>You requested for a password reset</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link is valid for 1 hour only.</p>
        `;
      
        await emailHelper.sendEmail(existingEmail.email,'Password Reset Request',emailBody);
        return res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const userResetPassword = async (req, res) => {
    try {
        const { token } = req.body;
        const { password } = req.body
        const { isValid, errors } = await resetPasswordValidation.validData({ token, password});
        if (!isValid) {
            return res.status(400).json({ message: "Please provide all required fields", data: errors });
        }
        const user = await authModel.getUserByToken(token);
       
        if(!user){
            return res.status(422).json({message: 'Invalid or expired token.', });
        }       
        const md5Hash = crypto.createHash('md5').update(password).digest('hex');
      
        await authModel.updateUserPassword(md5Hash, user.id);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};




module.exports = {
    userLogin,
    userForgetPassword,
    userResetPassword
};