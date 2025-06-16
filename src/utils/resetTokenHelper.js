const crypto = require('crypto');
const config = require('../../config/config');

const generateToken = () => {
    let currentTime = Date.now();
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpire = (currentTime + parseInt(config.general.resetTokenExpiresIn, 10)); 
    return {resetToken, resetTokenExpire};
};

module.exports = { generateToken };