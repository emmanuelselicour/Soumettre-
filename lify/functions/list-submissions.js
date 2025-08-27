const fetch = require("node-fetch");

exports.handler = async function () {
  const SITE_ID = "68ae5dd774ba370008f0f9a2"; // ✅ Ton site ID
  const API_TOKEN = "nfp_Vi9ecVV6LHeewxV2W1pQAZCYGGmU2rSHac32"; // ✅ Ton API Key

  try {
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/forms/employeurs/submissions`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const submissions = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(submissions),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
