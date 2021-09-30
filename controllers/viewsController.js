const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Purchase = require('../models/purchaseModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data form Collection
  let books;
  if (!req.params.availableFor) {
    books = await Book.find();
  } else {
    books = await Book.find({ availableFor: req.params.availableFor });
  }

  if (!books.length) {
    return next(new AppError('No data found for this page!!', 404));
  }
  // const books = await Book.find({ availableFor: 'sell' });

  // 2. Build template

  // 3. Render that template using data from step 1
  res.status(200).render('overview', {
    title: `Books - ${
      req.params.availableFor ? req.params.availableFor : 'All'
    }`,
    books,
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  // 1. Get the data for the requested book (including reviews, comments and endUser)
  const book = await Book.findById(req.params.id)
    .populate({
      path: 'reviews',
      fields: 'review rating user',
    })
    .populate({
      path: 'comments',
      fields: 'comment user',
    });

  if (!book) {
    console.log('No book found');
    return next(new AppError('There is no book with this id', 404));
  }

  //2. Build the template

  //3. Render template using data form step 1
  res.status(200).render('book', {
    title: `${book.name}`,
    book,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create an account',
  });
};
exports.getAddBookForm = (req, res) => {
  res.status(200).render('addBook', {
    title: 'Add a new book',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
exports.showSuccess = (req, res) => {
  res.status(200).render('success', {
    title: 'Success',
  });
};

exports.getMyBooks = catchAsync(async (req, res, next) => {
  //1 Find all purchases
  const purchases = await Purchase.find({ user: req.user.id });

  //Find books with the returned ids
  const bookIds = purchases.map((el) => el.book);
  const books = await Book.find({ _id: { $in: bookIds } });
  // if (books.length < 1) {
  //   console.log('No book found');
  //   return next(new AppError('You do not have any books yet', 404));
  // }
  res.status(200).render('overview', {
    title: 'My Books',
    books,
  });
});
