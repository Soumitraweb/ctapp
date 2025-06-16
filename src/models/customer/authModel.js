const db = require('../../../config/db');

const resetTokenHealper = require('../../utils/resetTokenHelper');

const getAllUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};


const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users where email = ?', [email]);
  return rows[0];
};


const getUserByToken = async (resetPasswordToken) => {
  const [rows] = await db.query('SELECT * FROM users where resetPasswordToken = ?  AND resetPasswordExpires < NOW() + INTERVAL 10 MINUTE' , [resetPasswordToken, Date.now()]);
  return rows[0];
};


const savePasswordToken = async (id) => {
    let user = await db.query('SELECT * FROM users where id = ?', [id]);
    const token = await resetTokenHealper.generateToken();
    const resetPasswordToken = token.resetToken;
    const resetPasswordExpires = token.resetTokenExpire;
    await db.query(
      'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
      [resetPasswordToken, resetPasswordExpires, id]
    );
    return  resetPasswordToken;
};

const updateUserPassword = async (password, id) => {
    await db.query(
      'UPDATE users SET password = ?, resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
      [password, '', '', id]
    );
    return  true;
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  savePasswordToken,
  getUserByToken,
  updateUserPassword
};
