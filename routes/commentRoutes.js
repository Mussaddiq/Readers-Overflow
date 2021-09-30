const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(commentController.getAllComments)
  .post(
    authController.restrictTo('buyer'),
    commentController.setBookUserIds,
    commentController.createComment
  );
router
  .route('/:id')
  .get(commentController.getComment)
  .patch(
    authController.restrictTo('buyer', 'admin'),
    commentController.updateComment
  )
  .delete(
    authController.restrictTo('buyer', 'admin'),
    commentController.deleteComment
  );

module.exports = router;
