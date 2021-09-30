/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51JRKIcIIBFFxpA9z7pxuNllCX1zmQb7hfQ7DiJBvSOAVTXGTcsq8ZrbgPSoZgp0umTr0mXzwxkvwirD5evCflGJs00sUjUIldl'
);

export const purchaseBook = async (bookId) => {
  try {
    // Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/purchases/checkout-session/${bookId}`
    );
    console.log(session);

    //Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
