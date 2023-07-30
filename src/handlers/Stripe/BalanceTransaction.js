const Response = require('../Response');
const Stripe = require('stripe');

class BalanceTransaction extends Response {
  stripe = Stripe(
    process.env.ENV === 'staging'
      ? process.env.STRIPE_KEY_DEV
      : process.env.STRIPE_KEY_LIVE
  );
  retrieveTransaction = async (req, res) => {
    try {
      const { tx_id } = req.query;
      if (!tx_id) {
        return this.sendResponse(res, 'Transaction id is required', null, 400);
      }
      const balanceTransaction = await this.stripe.balanceTransactions
        .retrieve(tx_id)
        .then((balanceTransaction) => balanceTransaction)
        .catch((err) => err);
      if (!balanceTransaction?.object)
        return this.sendResponse(
          res,
          balanceTransaction?.raw?.message,
          null,
          balanceTransaction?.statusCode
        );
      return this.sendResponse(res, null, balanceTransaction, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
  getAllTransactions = async (req, res) => {
    try {
      const { limit } = req.query;
      const params = {};
      if (limit) {
        params.limit = limit;
      }
      const balanceTransactions = await this.stripe.balanceTransactions
        .list(params)
        .then((balanceTransactions) => balanceTransactions)
        .catch((err) => err);
      if (!balanceTransactions?.data || balanceTransactions?.data.length === 0)
        return this.sendResponse(
          res,
          balanceTransactions?.raw?.message,
          null,
          balanceTransactions?.statusCode
        );
      return this.sendResponse(res, null, balanceTransactions.data, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
}

module.exports = { BalanceTransaction };
