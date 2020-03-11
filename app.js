const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const userRouter = require('./routers/user');
const tourRouter = require('./routers/tour');
const viewRouter = require('./routers/view');
const reviewRouter = require('./routers/review');
const bookingRouter = require('./routers/booking');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');
const securityMiddleware = require('./middleware/security');

const app = express();

app.use(helmet());
app.use('/api', securityMiddleware.limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const whitelist = ['duration', 'ratingQuantity', 'ratingAverage', 'maxGroupSize', 'difficulty', 'price'];
app.use(hpp({ whitelist }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// middleware that handles unrecognized URLs
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
