const sql = require('./database/setup');
const app = require('./app');
require('dotenv').config();

sql.setupDB();

app.listen(process.env.port, () => {
	console.log(`Server is listening on port: ${process.env.port}`);
});