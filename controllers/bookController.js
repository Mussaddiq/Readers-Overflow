const multer = require('multer');
const sharp = require('sharp');
const Book = require('../models/bookModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadBookImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

//upload.single('image) req.file
//upload.array('images',5) req.files

exports.resizeBookImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  //1. Cover image
  req.body.imageCover = `tour-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/books/${req.body.imageCover}`);

  //2. images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/books/${filename}`);
      req.body.images.push(filename);
    })
  );

  next();
});

exports.aliasTopBooks = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,author';
  next();
};

// exports.getAllBooks = catchAsync(async (req, res, next) => {
//   //! Executing query
//   const features = new APIFeatures(Book.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const books = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: books.length,
//     data: {
//       books,
//     },
//   });
// });
exports.setUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.endUser) req.body.endUser = req.user.id;
  next();
};

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, { path: 'reviews comments' });
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);

exports.getBookStats = catchAsync(async (req, res, next) => {
  const stats = await Book.aggregate([
    {
      $match: { ratingsAverage: { $gte: 1.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$author' },
        num: { $sum: 1 },
        numbook: { $sum: '$ratingsAverage' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // const year = +req.params.year;
  // const plan = await Book.aggregate([
  //   {
  //     $unwind: '$startDates',
  //   },
  //   {
  //     $match: {
  //       startDates: {
  //         $gte: new Date(`${year}-01-01`),
  //         $lte: new Date(`${year}-12-31`),
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { $month: '$startDates' },
  //       numBookStarts: { $sum: 1 },
  //       books: { $push: '$name' },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       month: '$_id',
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //     },
  //   },
  //   {
  //     $sort: {
  //       numBookStarts: -1,
  //     },
  //   },
  // ]);

  res.status(200).json({
    status: 'success',
    message: 'This route is temporarily closed',
    // plan,
  });
});

// /books-within/233/center/34.111745,-118.113491/unit/mi
exports.getBooksWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide in latitude and longitude in the format lat,lng',
        400
      )
    );
  }

  const books = await Book.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      data: books,
    },
  });
});
