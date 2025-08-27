const sgMail = require('@sendgrid/mail');
const multiparty = require('multiparty');
const fetch = require('node-fetch');
const fs = require('fs');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    const form = new multiparty.Form();

    const data = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const prenom = data.fields.prenom[0];
    const email = data.fields.email[0];
    const photo = data.files.photo[0]; // fichye foto

    // --- Soumèt nan Netlify Forms API ---
    const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;
    const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
    const FORM_ID = 'contact';

    await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms/${FORM_ID}/submissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: { prenom, email, photo: photo.originalFilename } })
    });

    // --- Voye imèl otomatik ---
    const msg = {
      to: email,
      from: 'votre-email@domain.com',
      subject: 'Mèsi pou ranpli fòm nan!',
      text: `Bonjou ${prenom},\n\nMèsi paske ou te soumèt fòm nan. Nou pral kontakte ou byento!`,
      html: `<p>Bonjou <strong>${prenom}</strong>,</p><p>Mèsi paske ou te soumèt fòm nan. Nou pral kontakte ou byento!</p>`
    };

    await sgMail.send(msg);

    return { statusCode: 200, body: JSON.stringify({ message: 'Soumisyon ak imel voye avèk siksè!' }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
