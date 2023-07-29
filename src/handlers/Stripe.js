const { validateEmail } = require('../utils');
const Response = require('./Response');
const StripeClass = require('stripe');

class Stripe extends Response {
  stripe = StripeClass(
    process.env.ENV === 'staging'
      ? process.env.STRIPE_KEY_DEV
      : process.env.STRIPE_KEY_LIVE
  );
  createCustomer = (req, res) => {
    try {
      const {
        address,
        balance,
        currency,
        description,
        discount,
        email,
        phone,
        name,
        shipping,
        test_clock,
      } = req.body;
      if (!name) {
        return this.sendResponse(res, 'Customer name is required', null, 400);
      }
      if (!email) {
        return this.sendResponse(res, 'Customer email is required', null, 400);
      }
      if (!validateEmail(email)) {
        return this.sendResponse(res, 'Invalid email address', null, 400);
      }
      if (!description) {
        return this.sendResponse(
          res,
          'Customer description is required',
          null,
          400
        );
      }
      return this.stripe.customers.create(
        {
          address,
          balance,
          currency,
          description,
          discount,
          email,
          phone,
          name,
          shipping,
          test_clock,
        },
        (err, customer) => {
          if (err) return this.sendResponse(res, 'Error', err, 400);
          return this.sendResponse(
            res,
            'Customer created successfully',
            customer,
            201
          );
        }
      );
    } catch (err) {
      return this.sendResponse(res, 'Internal server error', err, 500);
    }
  };
  getSingleCustomer = async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return this.sendResponse(res, 'Customer id is required', null, 400);
      }
      const customer = await this.stripe.customers
        .retrieve(id)
        .then((res) => res)
        .catch((err) => err);
      if (!customer?.object)
        return this.sendResponse(
          res,
          customer?.raw?.message,
          null,
          customer?.statusCode
        );
      return this.sendResponse(res, null, customer, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal server error', err, 500);
    }
  };
  getAllCustomers = async (req, res) => {
    try {
      const { limit } = req.query;
      const params = {};
      if (limit) {
        params.limit = limit;
      }
      const list = await this.stripe.customers.list(params);
      if (!list?.data)
        return this.sendResponse(res, 'No customers found', null, 404);
      return this.sendResponse(res, null, list.data, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal server error', err, 500);
    }
  };
  
}

module.exports = { Stripe };
