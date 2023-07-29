const jwt = require('jsonwebtoken');
const Response = require('../handlers/Response');
const response = new Response();

const authenticate = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return response.sendResponse(
        res,
        'Authorization token is required',
        null,
        400
      );
    }
    const [protocal, token] = authorization.split(' ');
    if (protocal.toLowerCase() !== 'jwt') {
      return response.sendResponse(
        res,
        'Token type should be JWT',
        null,
        400
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) return err;
      return decode;
    });
    if (decoded?.name === 'TokenExpiredError') {
      return response.sendResponse(
        res,
        'Authorization token is expired',
        null,
        400
      );
    }
    if (!decoded?.username) {
      return response.sendResponse(res, 'Error', decoded, 400);
    }
    next();
  } catch (err) {
    return response.sendResponse(res, 'Intenal Server Error', err, 500);
  }
};

module.exports = { authenticate };
