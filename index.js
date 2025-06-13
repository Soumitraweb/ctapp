require('dotenv').config(); // Load environment variables
const connectDB = require('./config/db'); // Import the database connection function
const app = require('./app'); // Import the Express app
const config = require('./config/config');
const PORT = config.app.port || 8000;

async function startServer() {
  try {
    
    const connection = await connectDB.getConnection();
    const [rows, fields] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Database connection successful:', rows[0].solution);
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MySQL connection failed:', err);
    process.exit(1);
  }
}
startServer();