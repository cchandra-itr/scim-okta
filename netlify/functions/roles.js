// placeholder comments

const axios = require('axios');

// Retrieve necessary environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const apiUrl = process.env.API_URL_ROLES
const apiKey = process.env.API_KEY_ROLES

exports.handler = async function(event, context) {
  const { path, httpMethod, queryStringParameters } = event;

  // Check for Basic Authentication
  const authHeader = headers.authorization;
  if (!authHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: No Authorization header provided' }),
    };
  }

  // Extract and decode the credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [providedClientId, providedClientSecret] = credentials.split(':');

  // Verify the credentials
  if (providedClientId !== clientId || providedClientSecret !== clientSecret) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: Invalid client ID or secret' }),
    };
  }

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
      url: externalUrl,
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
