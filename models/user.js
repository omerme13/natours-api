const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must specify a name'],
        trim: true,
        maxlength: [30, 'The name field must have no more than 30 characters'],
        minlength: [2, 'The name field must have at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'You must specify an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'You must specify a password'],
        minlength: [8, 'Your password must have at least 8 characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'You must confirm your password'],
        validate: {
            // this only works on create and save
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same.'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.confirmPassword = undefined;

    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });

    next();
});

userSchema.methods.isPasswordMatch = async function(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
};

userSchema.methods.didChangePassword = function(tokenTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000
        );
        
        return tokenTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex'); 

    console.log({resetToken}, this.passwordResetToken)    

    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports  = User;