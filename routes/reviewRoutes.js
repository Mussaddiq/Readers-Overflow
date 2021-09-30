const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('buyer'),
    reviewController.setBookUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('buyer', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('buyer', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
