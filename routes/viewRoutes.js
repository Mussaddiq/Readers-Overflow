const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.get(
  '/',
  purchaseController.createPurchaseCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get(
  '/all/:availableFor',
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/book/:id', authController.isLoggedIn, viewsController.getBook);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get(
  '/addBook',
  authController.isLoggedIn,
  viewsController.getAddBookForm
);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/success', authController.isLoggedIn, viewsController.showSuccess);
router.get('/my-books', authController.protect, viewsController.getMyBooks);

module.exports = router;
