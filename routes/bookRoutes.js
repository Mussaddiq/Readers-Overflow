const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const commentRouter = require('./commentRoutes');

const router = express.Router();
//POST /book/dfs54325fdgr5/reviews
//GET /book/dfs54325fdgr5/reviews
//GET /book/dfs54325fdgr5/sfd343

// router
//   .route('/:bookId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('buyer'),
//     reviewController.createReview
//   );
router.use('/:bookId/reviews', reviewRouter);
router.use('/:bookId/comments', commentRouter);

// router.param('id', bookController.checkID);
router
  .route('/top-5-cheap')
  .get(bookController.aliasTopBooks, bookController.getAllBooks);

router.route('/book-stats').get(bookController.getBookStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    bookController.getMonthlyPlan
  );

router
  .route('/books-within/:distance/center/:latlng/unit/:unit')
  .get(bookController.getBooksWithin);

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    bookController.setUserIds,
    bookController.uploadBookImages,
    bookController.resizeBookImages,
    bookController.createBook
  );
router
  .route('/:id')
  .get(bookController.getBook)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    bookController.uploadBookImages,
    bookController.resizeBookImages,
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'seller'),
    bookController.deleteBook
  );

module.exports = router;
