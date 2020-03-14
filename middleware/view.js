const alerts = (req, res, next) => {
    const alert = req.query.alert;

    if (alert === 'booking') {
        res.locals.alert = 'Your booking was successful. Please check your email.';
    }
    
    next();
};

module.exports = {
    alerts
};