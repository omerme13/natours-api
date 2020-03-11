const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tour');
const Booking = require('../models/booking');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const createBooking = factory.createOne(Booking);
const updateBooking = factory.updateOne(Booking);
const deleteBooking = factory.deleteOne(Booking);
const getBooking = factory.getOne(Booking);
const getBookings = factory.getAll(Booking);

const getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: tour.id,
        line_items: [{
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            amount: tour.price * 100,
            currency: 'usd',
            quantity: 1
        }]
    });

    res.json({
        status: 'success',
        session
    })
});

const createBookingCheckout = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.query;

    if (!tour || !user || !price) {
        return next()
    }

    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
});


module.exports = {
    createBooking,
    updateBooking,
    deleteBooking,
    getBooking,
    getBookings,
    getCheckoutSession,
    createBookingCheckout
};