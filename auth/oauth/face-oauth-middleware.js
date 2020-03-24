/* eslint-disable camelcase */
/* eslint-disable strict */


'use strict ';
require('dotenv').config();
const superagent = require('superagent');
// const axios = require('axios');
const jwt = require('jsonwebtoken');
const Users = require('../schema/users-schema.js');
let tokenURL = 'https://graph.facebook.com/v6.0/oauth/access_token';
let remoteAPI = 'https://graph.facebook.com/me';
const CLIENT_ID = '520042838644247';
const CLIENT_SECRET = '672eea6cc59210a304c8239f1e6aa835';
const API_SERVER = 'http://localhost:3000/oauth';
let SECRET = process.env.SECRET || 'MYOWNSECRET';
module.exports = async function authorize(req, res, next) {
    try {
        console.log('hiiiiii')
    console.log('hello from authorize');
    let code = req.query.code;
    console.log('req.query.code => ',req.query.code);
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
  let tokenResponse = await superagent
    .post(tokenURL)
    .send({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: API_SERVER,
      // grant_type: 'authorization_code',
    });
  let access_token = tokenResponse.body.access_token;
  console.log('access_token => ',access_token);
  return access_token;
}
async function getRemoteUserInfo(access_token) {
  const data = await superagent
    .get(remoteAPI)
    .query({
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: access_token,
    });
  console.log(data); // { id, email, first_name, last_name }
  return JSON.parse(data.text);
}
async function getUser(remoteUser) {
  let userRecord = {
    name: remoteUser.first_name,
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
/*************************************************************************/
// module.exports = async function authorizeFacebook(req, res, next) {
//   try {
//     let [user, token] = await authorize(req);
//     req.user = user;
//     req.token = token;
//     next();
//   } catch (e) {
//     // console.log('error');
//     next(e);
//   }
// };
// const authorize = (req) => {
//   let code = req.query.code;
//   return superagent
//     .post(tokenURL)
//     .send({
//       code: code,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: API_SERVER,
//     })
//     .then( tokenResponse => {
//       let access_token = tokenResponse.body.access_token;
//       return access_token;
//     })
//     .then(access_token => {
//       return superagent
//         .get(remoteAPI)
//         .query({
//           fields: ['id', 'email', 'first_name', 'last_name'].join(','),
//           access_token: access_token,
//         }).then(data => {
//           return JSON.parse(data.text);
//         });
//     })
//     .then(oauthUser => {
//       let userRecord = {
//         name: oauthUser.first_name,
//         pass: '123456789',
//       };
//       let newUser = new Users(userRecord);
//       let user = newUser.save();
//       return user;
//     })
//     .then(user => {
//       let usreInfo = {
//         id: user._id,
//       };
//       let token = jwt.sign(usreInfo,SECRET);
//       return [user, token];
//     })
//     .catch(error => error);
// };
/*****************************************************************************/
// module.exports = async function authorize(req, res, next) {
//   try {
//     // console.log('hello from authorize');
//     let code = req.query.code;
//     console.log('req.query.code => ',req.query.code);
//     let remoteToken = await codeTokenExchanger(code);
//     let remoteUser = await getRemoteUserInfo(remoteToken);
//     let [user, token] = await getUser(remoteUser);
//     req.user = user;
//     req.token = token;
//     next();
//   } catch (e) {
//     console.log('error');
//     next(e);
//   }
// };
// async function codeTokenExchanger(code) {
//   let tokenResponse = await superagent
//     .post(tokenURL)
//     .send({
//       code: code,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: API_SERVER,
//       // grant_type: 'authorization_code',
//     });
//   let access_token = tokenResponse.body.access_token;
//   console.log('access_token => ',access_token);
//   return access_token;
// }
// async function getRemoteUserInfo(access_token) {
//   const { data, } = await axios({
//     url: remoteAPI,
//     method: 'get',
//     params: {
//       fields: ['id', 'email', 'first_name', 'last_name'].join(','),
//       access_token: access_token,
//     },
//   });
//   console.log(data); // { id, email, first_name, last_name }
//   return data;
// }
// async function getUser(remoteUser) {
//   let userRecord = {
//     name: remoteUser.first_name,
//     pass: '123456789',
//   };
//   let newUser = new Users(userRecord);
//   let user = await newUser.save();
//   let usreInfo = {
//     id: user._id,
//   };
//   let token = jwt.sign(usreInfo,SECRET);
//   return [user, token];
// }