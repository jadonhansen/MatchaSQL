const sql = require('./database/setup');
const app = require('./app');
const PORT = 3306;

sql.setupDB();

app.listen(PORT, () => {
	console.log(`Server is listening on port: ${PORT}`);
});