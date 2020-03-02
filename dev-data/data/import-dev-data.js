const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');

const Tour = require('../../models/tour');
const User = require('../../models/user');
const Review = require('../../models/review');

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

const tours = JSON.parse(fs.readFileSync(__dirname + '/tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8'));

const importData = async () => {
    //TODO before importing the data we need to turn off 2 of the query middleware in the user model file that encrypt the password because it's already encrypted in the users data file 
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data loaded successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
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