const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tour');
const User = require('../models/user');
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
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: tour.id,
        line_items: [{
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
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

// const createBookingCheckout = catchAsync(async (req, res, next) => {
//     const { tour, user, price } = req.query;

//     if (!tour || !user || !price) {
//         return next()
//     }

//     await Booking.create({ tour, user, price });
//     res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async session => {
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.line_items[0].amount * session.line_items[0].price;

    await Booking.create({ tour, user, price });
};

const webhookCheckout = async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        await createBookingCheckout(event.data.object)
    }

    res.json({ received: true });
};

module.exports = {
    createBooking,
    updateBooking,
    deleteBooking,
    getBooking,
    getBookings,
    getCheckoutSession,
    // createBookingCheckout,
    webhookCheckout
};