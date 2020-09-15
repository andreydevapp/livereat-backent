'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const axios = require('axios');

var _require = require('./config');

const API_URL = _require.API_URL;


const secondsBeforeExp = 600; // 10 minutes

axios.defaults.headers.common['Content-Type'] = 'application/json';

module.exports = (client_id, client_secret) => {
  let token = null;

  return _asyncToGenerator(function* () {
    const now = new Date();

    if (token && token.expires_at > now.getTime()) {
      return token.access_token;
    }

    const res = yield axios.post(`${API_URL}/authentication/token/`, {
      client_id,
      client_secret,
      grant_type: 'client_credentials'
    });

    token = res.data;

    const time = new Date();
    time.setSeconds(time.getSeconds() + (token.expires_in - secondsBeforeExp));
    token.expires_at = time.getTime();
    return token.access_token;
  });
};