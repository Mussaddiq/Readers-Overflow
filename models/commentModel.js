const mongoose = require('mongoose');
const Book = require('./bookModel');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'comment can not be blank!'],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'comment must belong to a book'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'comment must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ book: 1, user: 1 });

//Query Middlewares
commentSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'book',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// commentSchema.statics.calcAverageRatings = async function (bookId) {
//   const stats = await this.aggregate([
//     {
//       $match: { book: bookId },
//     },
//     {
//       $group: {
//         _id: '$book',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' },
//       },
//     },
//   ]);

//   if (stats.length > 0) {
//     await Book.findByIdAndUpdate(bookId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating,
//     });
//   } else {
//     await Book.findByIdAndUpdate(bookId, {
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5,
//     });
//   }
// };

// commentSchema.post('save', function () {
//   //this points to current comment
//   this.constructor.calcAverageRatings(this.book);
// });

//findByIdAndUpdate
//findByIdAndDelete
// commentSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();

//   next();
// });

// commentSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calcAverageRatings(this.r.book);
// });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
