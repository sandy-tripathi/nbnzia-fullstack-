require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`NBNZIA backend listening on http://localhost:${PORT}`);
  });
})();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});
