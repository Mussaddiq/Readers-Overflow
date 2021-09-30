const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A book name must be less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'A book name must be greater than or equal to 10 characters',
      ],
      // validate: [validator.isAlpha,'book name must only contain alpha characters',],
    },
    slug: String,
    quantity: {
      type: Number,
      required: [true, 'A book must have a quantity'],
    },
    availableFor: {
      type: String,
      required: [true, 'A book must have availability option'],
      enum: {
        values: ['sell', 'rent', 'exchange'],
        message: 'Please choose between "sell","rent" or "exchange"!',
      },
    },
    author: {
      type: String,
      required: [true, 'A book must have author'],
    },
    condition: {
      type: String,
      required: [true, 'A book must have condition'],
      enum: {
        values: ['brand new', 'new', 'slightly used', 'used', 'worn out'],
        message:
          'Condition is either brand new, new, slightly used, used, or worn out ',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'Ratings must not be less than 1.0'],
      max: [5.0, 'Ratings must not be greater than 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A book must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on new document creation not on updating
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A book must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A book must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
    location: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    endUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'book must have a creator'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.index({ price: 1, ratingsAverage: -1 });
bookSchema.index({ slug: 1 });
bookSchema.index({ location: '2dsphere' });

//Virtual Properties
bookSchema.virtual('quantityWeek').get(function () {
  return this.quantity / 7;
});

bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id',
});
bookSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'book',
  localField: '_id',
});

//Document Middleware; Runs on .save() and .create()
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// bookSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

//Query Middleware
bookSchema.pre(/^find/, function (next) {
  this.find({ soldOut: { $ne: true } });

  this.start = Date.now();
  next();
});

bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'endUser',
    select: '-__v -passwordChangedAt',
  });
  next();
});

bookSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//Aggregate Middleware
bookSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { soldOut: { $ne: true } } });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
