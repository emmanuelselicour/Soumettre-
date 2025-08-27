// netlify/functions/getSubmissions.js
// Plus besoin de require('node-fetch'), fetch est natif sur Node 18+

exports.handler = async function(event, context) {
    const NETLIFY_API_TOKEN = "nfp_PUrabHFkXjtTHDnc15EDCjfCz1KCp7pXbc9b"; // Ton API token
    const SITE_ID = "68ae9cdcef1f810008173b4d"; // Ton Site ID Netlify
    const FORM_NAME = "broadcast"; // Nom exact de ton formulaire Netlify

    if (!NETLIFY_API_TOKEN || !SITE_ID) {
        return { statusCode: 500, body: JSON.stringify({ error: "API Token ou Site ID manquant" }) };
    }

    const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/forms/${FORM_NAME}/submissions`;

    try {
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${NETLIFY_API_TOKEN}` }
        });
        const data = await res.json();

        const submissions = data.map(sub => ({
            nom: sub.data.nom || "",
            prenom: sub.data.prenom || "",
            whatsapp: sub.data.whatsapp || "",
            submitted_at: sub.submitted_at
        }));

        return { statusCode: 200, body: JSON.stringify(submissions) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
