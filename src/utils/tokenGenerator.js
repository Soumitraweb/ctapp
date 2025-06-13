const jwt = require('jsonwebtoken');

const generateToken = (payload, secret, expiresIn = '1h') => {
    return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

const decodeToken = (existingToken) => {
    return jwt.decode(existingToken, { complete: true });
};

module.exports = { generateToken, verifyToken, decodeToken };
