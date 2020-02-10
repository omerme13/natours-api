const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception!');
    process.exit(1);
});

const { DATABASE, DATABASE_PASSWORD } = process.env;
const db = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('connection to database successful!'))

const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
    console.log(`running on port ${port}...`)
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection!');
    server.close(() => process.exit(1));
});

