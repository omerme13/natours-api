const multer = require('multer');
const jimp = require('jimp');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new AppError('Please upload only images.', 400), false);
    }

    cb(null, true);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    const image = await jimp.read(req.file.buffer);

    image
        .resize(500, 500)
        .quality(90)
        .write(`public/img/users/${req.file.filename}`)
    
    next();
});

const uploadUserPhoto = upload.single('photo');

const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    
    next();
};

module.exports = {
    getMe,
    resizeUserPhoto,
    uploadUserPhoto
};