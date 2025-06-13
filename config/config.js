require('dotenv').config(); 
const config = {
    app: {
        port: process.env.PORT || 8000, // Application port
        env: process.env.NODE_ENV || 'development', // Application environment
    },
    db: {
        host: process.env.DB_HOST, 
        database:process.env.DB_DATABASE,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // JWT secret
        expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Token expiration
    },
    email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: process.env.SMTP_PORT || 587,
        fromEmail: process.env.EMAIL_USER,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    general: {
        resetTokenExpiresIn: process.env.RESET_TOKEN_EXPIRES_IN,
        //dataPerPages: process.env.DATA_PER_PAGE,
    },
};

module.exports = config;