const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');
const Tour = require('../../models/tour');

const { DATABASE, DATABASE_PASSWORD } = process.env;
const db = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('connection to database successful!'));

const tours = JSON.parse(fs.readFileSync(__dirname + '/tours-simple.json', 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data loaded successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}