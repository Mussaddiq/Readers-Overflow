/* eslint-disable */
import '@babel/polyfill';
import { signup, login, logout } from './login';
import { updateSettings, addBook } from './updateSettings';
import { purchaseBook } from './stripe';
//! Dom elements
// Signup Form
const signupForm = document.querySelector('.form--signup');
// Login Form
const loginForm = document.querySelector('.form--login');
//Logout button
const logoutBtn = document.querySelector('.nav__el--logout');
//Update user data form
const userDataForm = document.querySelector('.form-user-data');
//Update user password form
const userPasswordForm = document.querySelector('.form-user-password');
//Purchase book button
const purchaseBtn = document.getElementById('purchase-book');
//Add book
const addBookForm = document.querySelector('.form--addBook');

// Perform signup
if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    let role;
    if (document.getElementById('buyer').checked) {
      role = document.getElementById('buyer').value;
    } else if (document.getElementById('seller').checked) {
      role = document.getElementById('seller').value;
    }

    signup(name, email, password, passwordConfirm, role);
  });
}
//Perform Login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // updateSettings({ name, email }, 'data');

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    console.log(form);
    updateSettings(form, 'data');
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (purchaseBtn) {
  purchaseBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { bookId } = e.target.dataset;
    purchaseBook(bookId);
  });
}

//Add the book
if (addBookForm) {
  addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let availableFor, condition;
    if (document.getElementById('sell').checked) {
      availableFor = document.getElementById('sell').value;
    } else if (document.getElementById('rent').checked) {
      availableFor = document.getElementById('rent').value;
    } else if (document.getElementById('exchange').checked) {
      availableFor = document.getElementById('exchange').value;
    }

    // if (document.getElementById('new').checked) {
    //   condition = document.getElementById('new').value;
    // } else if (document.getElementById('used').checked) {
    //   condition = document.getElementById('used').value;
    // }
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('author', document.getElementById('author').value);
    form.append('price', document.getElementById('price').value);
    form.append('quantity', document.getElementById('quantity').value);
    form.append('summary', document.getElementById('summary').value);
    form.append('description', document.getElementById('description').value);
    form.append('imageCover', document.getElementById('imageCover').files[0]);
    form.append('images', document.getElementById('images').files);

    console.log(form);
    addBook(form);
  });
}
