const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routers/user');
const tourRouter = require('./routers/tour');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
