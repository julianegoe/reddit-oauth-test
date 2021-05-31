const axios = require('axios')
const qs = require('qs')
const port = 3080;


const credentials = {
  client_id: process.env.client_id,
  response_type: process.env.response_type,
  state: process.env.state,
  redirect_uri: process.env.redirect_uri,
  duration: process.env.duration,
  scope: process.env.scope,
  secret: process.env.secret
};

const { client_id, response_type, state, redirect_uri, duration, scope, secret} = credentials;

const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${client_id}&response_type=${response_type}&state=${state}&redirect_uri=${redirect_uri}&duration=${duration}&scope=${scope}`


module.exports.getUri = async () => {
  console.log(authUrl);
  return {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": "*"},
    body: JSON.stringify({authUrl: authUrl})
  }
  
};

module.exports.getBearerToken = async (event) => {
  const reqState = decodeURIComponent(`${event.pathParameters.state}`);
  if (reqState === state) {
    const reqCode = decodeURIComponent(`${event.pathParameters.code}`);
    const data = qs.stringify({
        grant_type: 'authorization_code',
        code: reqCode,
        redirect_uri: redirect_uri
      });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const auth = {
      withCredentials: true,
      auth: {
        username: client_id,
        password: secret
      }
    };
    
    try {
      const response = await axios.post('https://www.reddit.com/api/v1/access_token', data, auth, headers)
      return {body: JSON.stringify(response.data)}
    } catch (err) {
      return {body: JSON.stringify(err)}
  }
    
  } return {
    statusCode: 500,
    body: JSON.stringify({err: "there is an error"})
  }
}

