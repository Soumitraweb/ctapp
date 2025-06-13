const db = require('../../../config/db');
const config = require('../../../config/config');
const crypto = require('crypto');
const Joi = require('joi');
const tokenGenerator = require('../../../src/utils/tokenGenerator');
const userLogin = async (req, res) => {
    try {
        const {email, password } = req.body;       
       
        // const { isValid, errors } = await loginValidation.validData({ username, password });
        // if (!isValid) {
        //     return res.status(400).json({ message: "Please provide all required fields", data: errors });
        // }
        // const existingUsername = await userService.getUserByUsername(username);
        // if(!existingUsername){
        //     return res.status(401).json({message: 'User not found.', });
        // }
        // const isPasswordValid = await userService.comparePassword(existingUsername.username ,password);
        // if (!isPasswordValid) return res.status(401).json({ message: "This is a invalid credentials" });
        // const token = tokenGenerator.generateToken({ id: existingUsername._id, username: existingUsername.username, email: existingUsername.email, roles: existingUsername.roles },  config.jwt.secret, config.jwt.expiresIn);

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });
        const data = { email, password };
        const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true});
        if (error) {
            const errors = error.details.reduce((acc, curr) => {
                acc[curr.path[0]] = curr.message.replace(/"/g, '').charAt(0).toUpperCase() + curr.message.replace(/"/g, '').slice(1);
                return acc;
            }, {});
           // return { isValid: false, errors };
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




module.exports = {
    userLogin
};