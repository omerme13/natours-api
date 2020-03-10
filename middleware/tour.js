const multer = require('multer');
const jimp = require('jimp');

const catchAsync = require('../utils/catchAsync');

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

const uploadTourPhotos = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

const resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.images || !req.files.imageCover) {
        return next();
    }

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    const imageCover = await jimp.read(req.files.imageCover[0].buffer);

    imageCover
        .resize(2000, 1333)
        .quality(90)
        .write(`public/img/tours/${req.body.imageCover}`);

    req.body.images = [];
    
    for (const [i, imageFile] of Object.entries(req.files.images)) {
        const fileName = `tour-${req.params.id}-${Date.now()}-${+i + 1}.jpeg`;
        const image = await jimp.read(imageFile.buffer);

        image
            .resize(2000, 1333)
            .quality(90)
            .write(`public/img/tours/${fileName}`);

        req.body.images.push(fileName);
    }

    // await Promise.all(
    //     req.files.images.map(async (imageFile, i) => {
    //         const fileName = `tour-${req.params.id}-${Date.now()}-${+i + 1}.jpeg`;
    //         const image = await jimp.read(imageFile.buffer);

    //         image
    //             .resize(2000, 1333)
    //             .quality(90)
    //             .write(`public/img/tours/${fileName}`);

    //         req.body.images.push(fileName);
    //     })
    // );

    next();
});

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    
    next();
};

module.exports = {
    aliasTopTours,
    uploadTourPhotos,
    resizeTourImages
};