const Response = require('../Response');
const Stripe = require('stripe');

class Balance extends Response {
  stripe = Stripe(
    process.env.ENV === 'staging'
      ? process.env.STRIPE_KEY_DEV
      : process.env.STRIPE_KEY_LIVE
  );
  getBalance = async (req, res) => {
    try {
      const balance = await this.stripe.balance
        .retrieve()
        .then((balance) => balance)
        .catch((err) => err);
      if (!balance?.object)
        return this.sendResponse(
          res,
          balance?.raw?.message,
          null,
          balance?.statusCode
        );
      return this.sendResponse(res, null, balance, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
}

module.exports = { Balance };
