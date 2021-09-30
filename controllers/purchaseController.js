const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Book = require('../models/bookModel');
const Purchase = require('../models/purchaseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

exports.getCheckoutSession = async (req, res, next) => {
  //Get currently purchased book
  const book = await Book.findById(req.params.bookId);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?book=${
      req.params.bookId
    }&user=${req.user.id}&price=${book.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/book/${book.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.bookId,
    line_items: [
      {
        name: `${book.name}`,
        description: book.summary,
        images: [
          `https://chronicle.brightspotcdn.com/dims4/default/b713459/2147483647/strip/true/crop/4288x2858+0+1243/resize/840x560!/brightness/-1x0/quality/90/?url=http%3A%2F%2Fchronicle-brightspot.s3.amazonaws.com%2F06%2F0c%2F3bd67bce4812a8f47a5cb4bb1d14%2Fpublishing-viitae-book-proposal.jpg`,
        ],
        amount: +(book.price * 0.66).toFixed(0),
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  //3. Create session as response

  res.status(200).json({
    status: 'success',
    session,
  });
};

exports.createPurchaseCheckout = catchAsync(async (req, res, next) => {
  const { book, user, price } = req.query;
  if (!book && !user && !price) return next();

  await Purchase.create({ book, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});
