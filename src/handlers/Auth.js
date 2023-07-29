const { User } = require('../model');
const Response = require('./Response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Auth extends Response {
  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username) {
        return this.sendResponse(res, 'Username is required', null, 400);
      }
      if (!password) {
        return this.sendResponse(res, 'Password is required', null, 400);
      }
      const user = await User.findOne({ username });
      if (!user) {
        return this.sendResponse(
          res,
          'Invalid username/password combination',
          null,
          404
        );
      }
      const valid = await bcrypt.compare(password, user?.password);
      if (!valid) {
        return this.sendResponse(
          res,
          'Invalid username/password combination',
          null,
          404
        );
      }
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: 60 * 10 + 's',
      });
      return this.sendResponse(res, 'Login Successful', { token });
    } catch (err) {
      return this.sendResponse(res, 'Internal server error', err, 500);
    }
  };
  refreshToken = (req, res) => {
    try {
      const { authorization } = req.headers;
      const [protocol, token] = authorization.split(' ');
      if (protocol.toLowerCase() !== 'jwt') {
        return this.sendResponse(res, 'Token type should be jwt', null, 400);
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decode) => {
          if (err) return err;
          return decode;
        }
      );
      if (decoded?.name === 'TokenExpiredError') {
        return this.sendResponse(
          res,
          'Authorization token is expired',
          null,
          400
        );
      }
      if (!decoded?.username) {
        return this.sendResponse(res, 'Error', decoded, 400);
      }
      const newToken = jwt.sign(
        { username: decoded?.username },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 10 + 's' }
      );
      return this.sendResponse(res, null, { token: newToken });
    } catch (err) {
      return this.sendResponse(res, 'Internal server error', err, 500);
    }
  };
}

module.exports = { Auth };
