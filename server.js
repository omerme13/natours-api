const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const mongoose = require('mongoose');

const { DATABASE, DATABASE_PASSWORD } = process.env;
const db = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('connection successful!'))


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`running on port ${port}...`)
});