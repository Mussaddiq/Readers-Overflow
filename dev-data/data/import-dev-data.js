const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../../models/bookModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const Comment = require('../../models/commentModel');

dotenv.config({ path: './config.env' });

// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected successfully!'));

//Reading the file

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/tours-modified.json`, 'utf8')
// );
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);
// const books = JSON.parse(fs.readFileSync(`${__dirname}/books.json`, 'utf8'));

// const comments = JSON.parse(
//   fs.readFileSync(`${__dirname}/comments.json`, 'utf8')
// );

//Import data into database
const importData = async () => {
  try {
    // await Book.create(books);
    // await User.create(users, { validateBeforeSave: false });
    // await Comment.create(comments);
    await Review.create(reviews);
    console.log('Data loaded successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // await Book.deleteMany();
    // await User.deleteMany();
    // await Comment.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
