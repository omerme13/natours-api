import axios from 'axios';
import showAlert from './alerts';
const stripe = Stripe('pk_test_N2xPxu2lrQaBNPMjxttGTq8h00dKSsk8aH');

export const bookTour = async tourId => {
    try {
        const res = await axios(
            `/api/v1/bookings/checkout-sessions/${tourId}`
        );
    
        const sessionId = res.data.session.id;
        await stripe.redirectToCheckout({ sessionId });

    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};