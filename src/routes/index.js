const router = require('express').Router();
const { users } = require('./users');
const { auth } = require('./auth');
const { stripe } = require('./stripe');
const { authenticate } = require('../middlewares');

router.use('/users', authenticate, users);
router.use('/stripe', stripe);
router.use('/auth', auth);

module.exports = { router };
