/* eslint-disable camelcase */
/* eslint-disable strict */
'use strict';

require('dotenv').config();
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const Users = require('../schema/users-schema.js');

let tokenURL = 'https://github.com/login/oauth/access_token';
let remoteAPI = 'https://api.github.com/user';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

let SECRET = process.env.SECRET || 'MYOWNSECRET';

module.exports = async function authorize(req, res, next) {
  try {
    console.log('hello from authorize');
    let code = req.query.code;
    console.log('code => ',code);
    let remoteToken = await codeTokenExchanger(code);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.log('error');
    next(e);
  }
};

async function codeTokenExchanger(code) {
  let tokenResponse = await superagent.post(tokenURL).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;
  console.log('access_token => ',access_token);
  console.log('tokenResponse.body => ',tokenResponse.body);
  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = await superagent.get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);
  console.log('userResponse => ', userResponse);
  let user = userResponse.body;
  console.log('user => ',user);
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    name: remoteUser.login,
    pass: '123456789',
  };
  let newUser = new Users(userRecord);
  let user = await newUser.save();
  let usreInfo = {
    id: user._id,
  };
  let token = jwt.sign(usreInfo,SECRET);
  return [user, token];
}
