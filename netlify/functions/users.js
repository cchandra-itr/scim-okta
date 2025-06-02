// placeholder comments

const axios = require('axios');

exports.handler = async function(event, context) {
  const { path, httpMethod, queryStringParameters } = event;

  // Define the routes and corresponding environment variables
  const apiUrl = process.env.API_URL_USERS
  const apiKey = process.env.API_KEY_USERS

  // Parse the external URL and append query parameters
  const externalUrl = new URL(apiUrl);
  if (queryStringParameters) {
    Object.entries(queryStringParameters).forEach(([key, value]) => {
      externalUrl.searchParams.append(key, value);
    });
  }

  // Forward the request to the external API
  try {
    const headers = {
      'x-api-client-token': apiKey
    };

    const params = {
      method: httpMethod,
      url: apiUrl,
      headers: headers,
      data: event.body ? JSON.parse(event.body) : null,
    };

    const response = await axios(params);

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
