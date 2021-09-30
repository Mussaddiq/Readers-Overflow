const path = require('path');
const express = require('express');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const purchaseRouter = require('./routes/purchaseRoutes');
const commentRouter = require('./routes/commentRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//! Global Middlewares
//*Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//*Set Security http headers
// app.use(helmet());
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//*Limit requests from same IP
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour',
});
app.use('/api', limiter);

//*Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//*Cookie parser
app.use(cookieParser());

//* Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//* Data Sanitization against XSS
app.use(xss());

//* Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'quantity',
      'ratingsQuantity',
      'ratingsAverage',
      'availableFor',
      'author',
      'price',
    ],
  })
);

//!Routes

app.use('/', viewRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/purchases', purchaseRouter);
app.use('/api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // console.log('I am here', req.originalUrl);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
