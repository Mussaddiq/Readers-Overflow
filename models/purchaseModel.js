const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: [true, 'Purchase must belong to a book'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Purchase must belong to a user'],
  },
  price: {
    type: Number,
    required: [true, 'Purchase must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'book',
    select: 'name',
  });
  next();
});
const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
