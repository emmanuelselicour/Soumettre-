const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;
    const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
    const FORM_ID = 'contact';

    const res = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms/${FORM_ID}/submissions`, {
      headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` }
    });

    if (!res.ok) throw new Error('Echwe pou chaje soumèt yo');

    const submissions = await res.json();

    return { statusCode: 200, body: JSON.stringify(submissions) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};



