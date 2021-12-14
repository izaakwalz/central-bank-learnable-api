const express = require('express');
const morgan = require('morgan');
const connectDB = require('./configuration/db');
const config = require('./configuration');
const { notFound, errorHandler } = require('./middlewares/error-handler');

const app = express();
// express body parser
app.use(express.json({ limit: '20mb', extended: true }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// API routes
app.use('/api/v1', require('./routes/index.routes'));
app.get('/', (req, res) => {
	res.send('API IS RUNNING  🚨 🚨 🚨 🚨 ');
});

// error middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, async () => {
	await connectDB(); // database connection
	console.log(`> Server listening on port ${config.PORT} :> http://localhost:${config.PORT}/api/v1/`);
});
